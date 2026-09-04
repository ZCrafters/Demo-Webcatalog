import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const root = fileURLToPath(new URL("../", import.meta.url));
const input =
  process.argv[2] || path.join(root, "data/nigoo-data-produk-shopee.xlsx");
const workbook = XLSX.read(fs.readFileSync(input), { type: "buffer" });
const sheet = workbook.Sheets["Product Data"];
if (!sheet) throw new Error("Sheet Product Data tidak ditemukan.");
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
if (
  rows[0]?.[1] !== "Nama Produk (Shopee)" ||
  !String(rows[0]?.[2]).includes("Setelah Diskon")
)
  throw new Error("Kolom XLSX tidak sesuai format Nigoo.");
const products = [];
const overrides = JSON.parse(fs.readFileSync(path.join(root, 'data/product-overrides.json'), 'utf8'));
const slugs = new Map();
const report = {
  source: path.basename(input),
  sheet: "Product Data",
  rawRows: 0,
  uniqueProducts: 0,
  duplicates: [],
  assumptions: [
    "Harga memakai nilai sumber tanpa menghitung diskon ulang.",
    "Harga sebelum diskon tidak tersedia.",
    "Kategori dan nama tampilan diturunkan dari nama produk.",
    "Terjual dengan RB+ adalah batas bawah, bukan angka pasti.",
    "Stok dan varian belum tersedia.",
  ],
  products: [],
};
const categoryMap = {
  cardigan: "cardigan",
  sweater: "sweater",
  atasan: "atasan",
  top: "atasan",
  "half-zip": "half-zip",
  "half zip": "half-zip",
};
for (const [index, row] of rows.entries()) {
  if (index === 0 || !row[1]) continue;
  report.rawRows++;
  const [
    id,
    sourceName,
    price,
    discount,
    rating,
    sold,
    manualCategory,
    manualSlug,
  ] = row;
  if (
    !Number.isInteger(id) ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isFinite(discount) ||
    discount < 0 ||
    discount >= 1 ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5
  )
    throw new Error(`Data numerik tidak valid pada baris ${index + 1}`);
  const cleaned = sourceName
    .replace(/\s*\(duplikat\)/i, "")
    .replace(/^nigoo\s+/i, "")
    .replace(/\.{3}$/, "")
    .trim();
  const category = manualCategory
    ? categoryMap[String(manualCategory).toLowerCase()]
    : /half.?zip/i.test(cleaned)
      ? "half-zip"
      : /cardigan/i.test(cleaned)
        ? "cardigan"
        : /sweater/i.test(cleaned)
          ? "sweater"
          : "atasan";
  if (!category)
    throw new Error(`Kategori tidak dikenal pada baris ${index + 1}`);
  const name = cleaned.match(/^(.+?(?:Cardigan|Sweater|Top))/i)?.[1] || cleaned;
  const slug = String(manualSlug || name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const soldLabel = String(sold || "");
  if (!/^\d+(?:RB)?\+?$/i.test(soldLabel))
    throw new Error(`Format terjual tidak dikenal: ${soldLabel}`);
  const soldCount =
    Number(soldLabel.replace(/RB\+?/i, "").replace("+", "")) *
    (/RB/i.test(soldLabel) ? 1000 : 1);
  if (slugs.has(slug)) {
    const original = slugs.get(slug);
    if (
      original.price !== price ||
      original.rating !== rating ||
      original.discountPercent !== Math.round(discount * 100) ||
      original.soldLabel !== soldLabel
    )
      throw new Error(`Duplikat bertentangan: ${slug}`);
    original.sourceRows.push(index + 1);
    report.duplicates.push({
      sourceRow: index + 1,
      mergedIntoId: original.id,
      name,
    });
    continue;
  }
  const product = {
    id,
    slug,
    name,
    sourceName,
    price,
    originalPrice: null,
    discountPercent: Math.round(discount * 100),
    rating,
    soldLabel,
    soldCount,
    soldCountIsLowerBound: soldLabel.includes("+"),
    category,
    images: overrides[slug]?.images || [],
    variants: [],
    stock: null,
    description: overrides[slug]?.description || `${name}, bagian dari koleksi rajut wanita Nigoo. Padukan dengan pilihan pakaian harianmu.`,
    sourceRows: [index + 1],
  };
  if (!Array.isArray(product.images) || product.images.some(image => typeof image !== 'string' || !/^\/[^/]|^https:\/\//.test(image))) throw new Error(`Path foto tidak valid: ${slug}`);
  slugs.set(slug, product);
  products.push(product);
}
if (!products.length) throw new Error("Import kosong; data lama tidak diubah.");
report.uniqueProducts = products.length;
report.products = products.map(({ id, slug, sourceRows }) => ({
  id,
  slug,
  sourceRows,
}));
fs.mkdirSync(path.join(root, "public/data"), { recursive: true });
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(
  path.join(root, "public/data/products.json"),
  JSON.stringify(products, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(root, "docs/catalog-import-report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  `Nigoo: ${report.rawRows} baris, ${products.length} produk unik, ${report.duplicates.length} duplikat digabung.`,
);

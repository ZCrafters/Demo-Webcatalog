import assert from "node:assert/strict";
import fs from "node:fs";
import XLSX from "xlsx";
const products = JSON.parse(
  fs.readFileSync(
    new URL("../public/data/products.json", import.meta.url),
    "utf8",
  ),
);
const workbook = XLSX.read(
  fs.readFileSync(
    new URL("../data/nigoo-data-produk-shopee.xlsx", import.meta.url),
  ),
  { type: "buffer" },
);
const rows = XLSX.utils.sheet_to_json(workbook.Sheets["Product Data"], {
  header: 1,
});
const spreadsheetProducts = products.filter((p) => p.sourceRows.length);
const manualProducts = products.filter((p) => !p.sourceRows.length);

assert.equal(products.length, 36);
assert.equal(spreadsheetProducts.length, 30);
assert.equal(manualProducts.length, 6);
assert.equal(new Set(products.map((p) => p.slug)).size, products.length);
assert.equal(new Set(products.map((p) => p.id)).size, products.length);
for (const p of products) {
  assert.ok(["cardigan", "sweater", "atasan", "half-zip"].includes(p.category));
  assert.equal(p.originalPrice, null, "Do not invent original prices");
}
const used = new Set();
for (const p of spreadsheetProducts) {
  for (const rowNumber of p.sourceRows) {
    assert.ok(!used.has(rowNumber), "Every source row must be consumed once");
    used.add(rowNumber);
    const row = rows[rowNumber - 1];
    assert.equal(p.price, row[2]);
    assert.equal(p.discountPercent, Math.round(row[3] * 100));
    assert.equal(p.rating, row[4]);
    assert.equal(p.soldLabel, row[5]);
    assert.equal(p.sourceName, row[1].replace(/\s*\(duplikat\)/i, ""));
  }
}
assert.equal(used.size, rows.length - 1);
// Products added straight from the nigoo/ scrape (not yet in the spreadsheet) must still carry real photos.
for (const p of manualProducts) {
  assert.ok(p.images.length, `Manually added product missing photos: ${p.slug}`);
}
assert.equal(Math.min(...products.map((p) => p.price)), 129900);
assert.equal(Math.max(...products.map((p) => p.price)), 389900);
console.log(
  "Verified all 35 source rows against 30 spreadsheet products, plus 6 products added directly from the nigoo/ scrape: prices, discounts, ratings, sold labels, IDs, slugs, and duplicate provenance.",
);

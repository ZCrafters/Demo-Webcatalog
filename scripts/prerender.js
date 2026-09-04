import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const products = JSON.parse(
  fs.readFileSync(path.join(root, "public/data/products.json"), "utf8"),
);
const routes = [
  ["/", "Rajutan untuk setiap hari"],
  ["/catalog", "Koleksi"],
  ["/about", "Tentang Nigoo"],
  ["/contact", "Hubungi kami"],
  ["/cart", "Keranjang"],
  ["/checkout", "Checkout simulasi"],
];
for (const category of new Set(products.map((p) => p.category)))
  routes.push([`/kategori/${category}`, `Koleksi ${category}`]);
for (const p of products) {
  routes.push([`/produk/${p.slug}`, p.name]);
  routes.push([`/product/${p.slug}`, p.name]);
}
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
for (const [route, title] of routes) {
  const dir = path.join(dist, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "index.html"),
    template.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escape(title)} | Nigoo</title>`,
    ),
  );
}
fs.writeFileSync(
  path.join(dist, "404.html"),
  template.replace(
    /<title>[^<]*<\/title>/,
    "<title>Halaman tidak ditemukan | Nigoo</title>",
  ),
);
// Pre-launch prototype: do not publish stale pricing in search until the owner validates it.
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log(
  `Generated ${routes.length} static route entry points. Content renders in React; these are not SSR pages.`,
);

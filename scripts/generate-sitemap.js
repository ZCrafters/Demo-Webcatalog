import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const products = JSON.parse(
  fs.readFileSync(path.join(root, "public/data/products.json"), "utf8"),
);
const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });

const SITE = "https://nigoo.vercel.app";
const lastmod = new Date().toISOString().split("T")[0];
const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/catalog", priority: "0.9", changefreq: "weekly" },
  { loc: "/about", priority: "0.6", changefreq: "monthly" },
  { loc: "/contact", priority: "0.5", changefreq: "monthly" },
  { loc: "/cart", priority: "0.3", changefreq: "never" },
  { loc: "/checkout", priority: "0.3", changefreq: "never" },
];

const categories = [...new Set(products.map((p) => p.category))];
const categoryPages = categories.map((cat) => ({
  loc: `/kategori/${cat}`,
  priority: "0.8",
  changefreq: "weekly",
}));

const productPages = products.map((p) => ({
  loc: `/produk/${p.slug}`,
  priority: "0.8",
  changefreq: "weekly",
}));

const allPages = [...staticPages, ...categoryPages, ...productPages];

const urlset = allPages
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

// Also update robots.txt to allow indexing and point to sitemap
const robots = `User-agent: *
Allow: /
Sitemap: ${SITE}/sitemap.xml
`;

fs.writeFileSync(path.join(dist, "sitemap.xml"), xml);
fs.writeFileSync(path.join(dist, "robots.txt"), robots);

console.log(
  `Generated sitemap.xml with ${allPages.length} URLs and updated robots.txt`,
);
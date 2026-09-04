// Home page section configuration — inspired by Cartiera's page-builder sections.
// Each entry is one section. Order in the array = order on the page.
import banners from "./banners.json";

const homeSections = [
  { type: "hero", slides: banners.slides || [] },
  {
    type: "productGrid",
    id: "curated",
    title: "Curated picks for you.",
    linkLabel: "All products",
    to: "/catalog",
    sort: "featured",
    limit: 8,
    note: null,
  },
  {
    type: "promoGrid",
    title: "Sweater, your way.",
    to: "/kategori/sweater",
    image: banners.sweater?.src || null,
    imageAlt: banners.sweater?.alt || "NFT Sweater collection",
    variant: "sweater",
  },
  {
    type: "productGrid",
    id: "best",
    title: "Top picks on Shopee.",
    linkLabel: "View collection",
    to: "/catalog?sort=sold",
    sort: "sold",
    limit: 8,
    note: "Ranked by units sold on Shopee. Current prices and availability follow the official store.",
  },
  {
    type: "promoGrid",
    title: "Your favorite layer.",
    to: "/kategori/cardigan",
    image: banners.cardigan?.src || null,
    imageAlt: banners.cardigan?.alt || "Nigoo cardigan collection",
    variant: "cardigan",
    label: "CARDIGAN COLLECTION",
  },
  {
    type: "productGrid",
    id: "cardigan",
    title: "Find your cardigan.",
    linkLabel: "View collection",
    to: "/kategori/cardigan",
    category: "cardigan",
    limit: 4,
    note: null,
  },
  { type: "brandStatement", title: "Personal style.", subtitle: "Born from knitwear." },
  { type: "social" },
];

export default homeSections;
import products from "../../public/data/products.json";
export { products };
export const brand = {
  shopee: "https://shopee.co.id/nigoo.id",
  tiktok: "https://www.tiktok.com/@knitgoods.id",
};
export const categories = [
  {
    slug: "cardigan",
    name: "Cardigan",
    description: "The perfect layering piece for any day.",
  },
  {
    slug: "sweater",
    name: "Sweater",
    description: "Your go-to for relaxed, cozy moments.",
  },
  { slug: "atasan", name: "Tops", description: "Start with something simple." },
  {
    slug: "half-zip",
    name: "Half-Zip",
    description: "A sporty edge on classic knitwear.",
  },
];
export const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
export const categoryName = (slug) =>
  categories.find((category) => category.slug === slug)?.name || slug;

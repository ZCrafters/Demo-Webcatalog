import { Helmet } from "react-helmet-async";
import { categoryName } from "./catalog";

const SITE = "https://www.cartiera.id"; // TODO: replace with real Nigoo domain before going live

function productJsonLd(product) {
  const images = (product.images || []).filter(Boolean);
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description || undefined,
    sku: product.slug,
    brand: { "@type": "Brand", name: "Nigoo" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      ratingCount: product.soldCount || 1,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE}/produk/${product.slug}`,
      priceCurrency: "IDR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };
}

function breadcrumbJsonLd(product, categorySlug) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    { "@type": "ListItem", position: 2, name: "Collection", item: `${SITE}/catalog` },
  ];
  if (categorySlug) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: categoryName(categorySlug),
      item: `${SITE}/kategori/${categorySlug}`,
    });
  }
  if (product) {
    items.push({ "@type": "ListItem", position: items.length + 1, name: product.name, item: `${SITE}/produk/${product.slug}` });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${SITE}/#organization`,
    name: "Nigoo",
    alternateName: "Nigoo Indonesia",
    url: SITE,
    description: "Women's knitwear brand. Cardigans, sweaters, and knit tops.",
    areaServed: { "@type": "Country", name: "Indonesia" },
  };
}

function clean(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => (value === undefined ? undefined : value)),
  );
}

export function Seo({ title, description, ogImage, product, categorySlug }) {
  const pageTitle = title ? `${title} | Nigoo` : "Nigoo | Knits made for every day";
  const baseDescription =
    description ||
    "Explore Nigoo's collection of women's cardigans, sweaters, and knit tops. Find your pick and shop through the official Nigoo store.";

  const scripts = [];
  if (product) scripts.push(productJsonLd(product));
  scripts.push(breadcrumbJsonLd(product, categorySlug));
  if (!product) scripts.push(organizationJsonLd());

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={baseDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={baseDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content={product ? "product" : "website"} />
      {scripts.map((script, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(clean(script))}
        </script>
      ))}
    </Helmet>
  );
}
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import {
  Home,
  Catalog,
  ProductDetail,
  About,
  Contact,
  Cart,
  Checkout,
  NotFound,
} from "./pages";
import { brand, categories, products } from "./catalog";

function PagePosition() {
  const { pathname: rawPathname, hash } = useLocation();
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  useEffect(() => {
    window.scrollTo(0, 0);
    const product = products.find(
      (p) =>
        pathname === `/produk/${p.slug}` || pathname === `/product/${p.slug}`,
    );
    const names = {
      "/": "Knits made for every day",
      "/catalog": "Collection",
      "/about": "About Nigoo",
      "/contact": "Contact us",
      "/cart": "Cart",
      "/checkout": "Demo checkout",
    };
    document.title = `${product?.name || names[pathname] || (pathname.startsWith("/kategori/") ? "Collection" : "Page not found")} | Nigoo`;
    document.getElementById("main-content")?.focus({ preventScroll: true });
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [pathname, hash]);
  return null;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark" to="/">
            nigoo.
          </Link>
          <p>
            Knits made for every day.
            <br />
            Find your pick, wear it your way.
          </p>
        </div>
        <div>
          <h2>Collection</h2>
          <Link to="/catalog">All products</Link>
          {categories.map((c) => (
            <Link key={c.slug} to={`/kategori/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div>
          <h2>About</h2>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/contact#belanja">Shopping guide</Link>
        </div>
        <div>
          <h2>Find us</h2>
          <a href={brand.shopee} target="_blank" rel="noreferrer">
            Shopee <span aria-hidden="true">↗</span>
          </a>
          <a href={brand.tiktok} target="_blank" rel="noreferrer">
            TikTok <span aria-hidden="true">↗</span>
          </a>
          <p>@nigoo.id / @knitgoods.id</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Nigoo.</span>
        <span>Final prices &amp; availability confirmed at the official store.</span>
        <span>Indonesia · IDR</span>
      </div>
    </footer>
  );
}

export function Storefront() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar />
      <PagePosition />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/kategori/:category" element={<Catalog />} />
          <Route path="/produk/:slug" element={<ProductDetail />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

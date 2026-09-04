import { useCallback, useEffect, useState } from "react";
import { PromoBar } from "./PromoBar";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { SearchPanel } from "./SearchPanel";
import { ShopeeIcon, TikTokIcon } from "./SocialIcons";
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
import { Seo } from "./Seo";

function PagePosition() {
  const { pathname: rawPathname, hash } = useLocation();
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const product = products.find(
    (p) =>
      pathname === `/produk/${p.slug}` || pathname === `/product/${p.slug}`,
  );

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  const names = {
    "/": { title: "Knits made for every day", desc: "Women's cardigans, sweaters, and knit tops by Nigoo." },
    "/catalog": { title: "Collection" },
    "/about": { title: "About Nigoo" },
    "/contact": { title: "Contact us" },
    "/cart": { title: "Cart" },
    "/checkout": { title: "Demo checkout" },
  };
  const isCategory = pathname.startsWith("/kategori/");
  const categorySlug = isCategory ? pathname.split("/")[2] : null;
  const meta = product
    ? { title: product.name, ogImage: product.images?.[0] }
    : names[pathname] || (isCategory ? { title: "Collection" } : { title: "Page not found" });

  return (
    <>
      <Seo
        title={meta.title}
        description={product?.description || meta.desc}
        ogImage={meta.ogImage}
        product={product}
        categorySlug={isCategory ? categorySlug : product?.category}
      />
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark" to="/">
            nigoo<span>.</span>
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
          <a href={brand.shopee} target="_blank" rel="noreferrer" className="social-link">
            <ShopeeIcon />
            <span>Shopee · @nigoo.id</span>
          </a>
          <a href={brand.tiktok} target="_blank" rel="noreferrer" className="social-link">
            <TikTokIcon />
            <span>TikTok · @knitgoods.id</span>
          </a>
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const handleMenu = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <PromoBar />
      <TopNav
        key={isHome ? "overlay" : "solid"}
        onMenu={handleMenu}
        overlay={isHome}
        onSearch={handleSearchOpen}
      />
      <Sidebar open={drawerOpen} onClose={handleDrawerClose} />
      <SearchPanel open={searchOpen} onClose={handleSearchClose} />
      <div id="nav-sentinel" aria-hidden="true" />
      <PagePosition />
      <main
        id="main-content"
        tabIndex={-1}
        className={isHome ? "has-overlay-hero" : ""}
      >
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
      <BottomNav onSearch={handleSearchOpen} />
    </>
  );
}
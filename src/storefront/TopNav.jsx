import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { CartContext } from "./CartProvider";
import { categories } from "./catalog";

export function TopNav({ onMenu, onSearch, overlay }) {
  const { count } = useContext(CartContext);
  const [scrolled, setScrolled] = useState(!overlay);

  useEffect(() => {
    if (!overlay) return;
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [overlay]);

  const transparent = overlay && !scrolled;

  return (
    <div className={`top-nav-wrap${transparent ? " overlay" : ""}`}>
      <nav className="top-nav" aria-label="Primary navigation">
        <div className="top-nav-left">
          <button
            className="icon-button nav-menu-trigger"
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
            onClick={onMenu}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
          <Link to="/" className="wordmark" aria-label="Nigoo, home">
            nigoo<span>.</span>
          </Link>
        </div>

        <div className="top-nav-center">
          <NavLink to="/catalog">Collection</NavLink>
          <div className="nav-categories">
            <NavLink to="/catalog">
              Categories <span aria-hidden="true" className="nav-chevron">▾</span>
            </NavLink>
            <div className="nav-categories-dropdown">
              {categories.map((c) => (
                <NavLink key={c.slug} to={`/kategori/${c.slug}`}>
                  {c.name}
                </NavLink>
              ))}
            </div>
          </div>
          <NavLink to="/about">About</NavLink>
        </div>

        <div className="top-nav-right">
          <button
            className="icon-button"
            aria-label="Search products"
            onClick={onSearch}
          >
            <Search size={20} aria-hidden="true" />
          </button>
          <Link
            className="top-cart"
            to="/cart"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {count > 0 && <span className="top-cart-count">{count}</span>}
          </Link>
        </div>
      </nav>
    </div>
  );
}
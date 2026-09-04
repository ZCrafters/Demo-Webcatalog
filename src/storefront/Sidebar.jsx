import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { CartContext } from "./CartProvider";
import { brand, categories } from "./catalog";

function Navigation({ close, prefix }) {
  const { count } = useContext(CartContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <>
      <nav className="sidebar-links" aria-label="Main navigation">
        <NavLink to="/catalog" onClick={close}>
          All products <ArrowUpRight size={15} aria-hidden="true" />
        </NavLink>
        <details
          className="sidebar-categories"
          data-active={pathname.startsWith("/kategori/")}
        >
          <summary>
            Categories <ChevronDown size={15} aria-hidden="true" />
          </summary>
          <div>
            {categories.map((category) => (
              <NavLink
                key={category.slug}
                to={`/kategori/${category.slug}`}
                onClick={close}
              >
                {category.name}
              </NavLink>
            ))}
          </div>
        </details>
        <NavLink to="/about" onClick={close}>
          About us
        </NavLink>
        <NavLink to="/contact" onClick={close}>
          Contact
        </NavLink>
      </nav>
      <div className="sidebar-tools">
        <button
          aria-expanded={searchOpen}
          aria-controls={`${prefix}-search`}
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search size={18} aria-hidden="true" />
          Search
        </button>
        <Link
          to="/cart"
          aria-label={`Cart, ${count} items`}
          onClick={close}
        >
          <ShoppingBag size={18} aria-hidden="true" />
          Cart <span className="sidebar-count">{count}</span>
        </Link>
      </div>
      {searchOpen && (
        <form
          className="sidebar-search"
          id={`${prefix}-search`}
          onSubmit={(event) => {
            event.preventDefault();
            const query = new FormData(event.currentTarget).get("q");
            navigate(`/catalog?q=${encodeURIComponent(query)}`);
            close?.();
          }}
        >
          <label htmlFor={`${prefix}-query`}>Search the Nigoo collection</label>
          <div>
            <input
              autoFocus
              type="search"
              id={`${prefix}-query`}
              name="q"
              placeholder="Product name"
            />
            <button
              className="icon-button"
              type="submit"
              aria-label="Run search"
            >
              <ArrowUpRight size={20} aria-hidden="true" />
            </button>
          </div>
        </form>
      )}
      <div className="sidebar-bottom">
        <p>Connect with Nigoo</p>
        <a href={brand.shopee} target="_blank" rel="noreferrer">
          Shopee <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a href={brand.tiktok} target="_blank" rel="noreferrer">
          TikTok <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <small>© {new Date().getFullYear()} Nigoo.</small>
      </div>
    </>
  );
}

export function Sidebar() {
  const { count } = useContext(CartContext);
  const [announcement, setAnnouncement] = useState(true);
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialog.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previous;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  const close = () => dialog.current?.close();
  const trapFocus = (event) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...dialog.current.querySelectorAll(
        "a[href],button:not([disabled]),input:not([disabled]),summary",
      ),
    ].filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };
  return (
    <>
      <aside className="desktop-sidebar">
        <Link to="/" className="wordmark" aria-label="Nigoo, home">
          nigoo.
        </Link>
        <Navigation prefix="desktop" />
      </aside>
      <header className="mobile-bar">
        <button
          ref={opener}
          className="icon-button"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="navigation-drawer"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <Link className="wordmark" to="/" aria-label="Nigoo, home">
          nigoo.
        </Link>
        <Link
          className="mobile-cart"
          to="/cart"
          aria-label={`Cart, ${count} items`}
        >
          <ShoppingBag size={21} aria-hidden="true" />
          <span>{count}</span>
        </Link>
      </header>
      <dialog
        ref={dialog}
        id="navigation-drawer"
        className="navigation-dialog"
        aria-label="Nigoo navigation menu"
        onKeyDown={trapFocus}
        onClose={() => {
          setOpen(false);
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="drawer-panel">
          <div className="drawer-heading">
            <Link to="/" className="wordmark" onClick={close}>
              nigoo.
            </Link>
            <button
              autoFocus
              className="icon-button"
              aria-label="Close navigation menu"
              onClick={close}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <Navigation prefix="mobile" close={close} />
        </div>
      </dialog>
      {announcement && (
        <div className="announcement">
          <a href={brand.shopee} target="_blank" rel="noreferrer">
            Discover the Nigoo collection on Shopee{" "}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <button
            aria-label="Close announcement"
            onClick={() => setAnnouncement(false)}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}

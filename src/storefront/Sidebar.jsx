import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Search,
  ShoppingBag,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { CartContext } from "./CartProvider";
import { brand, categories } from "./catalog";
import { ShopeeIcon, TikTokIcon } from "./SocialIcons";

function Navigation({ close }) {
  const { count } = useContext(CartContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <>
      <nav className="drawer-links" aria-label="Sidebar navigation">
        <NavLink to="/catalog" onClick={close}>
          All products <ArrowUpRight size={15} aria-hidden="true" />
        </NavLink>
        <details
          className="drawer-categories"
          data-active={pathname.startsWith("/kategori/")}
        >
          <summary>
            Categories <ChevronDown size={15} aria-hidden="true" />
          </summary>
          <div>
            {categories.map((category) => (
              <NavLink key={category.slug} to={`/kategori/${category.slug}`} onClick={close}>
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
      <div className="drawer-tools">
        <button aria-expanded={searchOpen} aria-controls="drawer-search" onClick={() => setSearchOpen(!searchOpen)}>
          <Search size={18} aria-hidden="true" />
          Search
        </button>
        <Link to="/cart" aria-label={`Cart, ${count} items`} onClick={close}>
          <ShoppingBag size={18} aria-hidden="true" />
          Cart <span className="drawer-count">{count}</span>
        </Link>
      </div>
      {searchOpen && (
        <form
          className="drawer-search"
          id="drawer-search"
          onSubmit={(event) => {
            event.preventDefault();
            const query = new FormData(event.currentTarget).get("q");
            navigate(`/catalog?q=${encodeURIComponent(query)}`);
            close?.();
          }}
        >
          <label htmlFor="drawer-query">Search the Nigoo collection</label>
          <div>
            <input autoFocus type="search" id="drawer-query" name="q" placeholder="Product name" />
            <button className="icon-button" type="submit" aria-label="Run search">
              <ArrowUpRight size={20} aria-hidden="true" />
            </button>
          </div>
        </form>
      )}
      <div className="drawer-bottom">
        <p>Connect with Nigoo</p>
        <a href={brand.shopee} target="_blank" rel="noreferrer" className="social-link">
          <ShopeeIcon />
          Shopee
        </a>
        <a href={brand.tiktok} target="_blank" rel="noreferrer" className="social-link">
          <TikTokIcon />
          TikTok
        </a>
        <small>© {new Date().getFullYear()} Nigoo.</small>
      </div>
    </>
  );
}

export function Sidebar({ open, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => dialog.current?.close();
  const handleClose = () => {
    close();
    onClose?.();
  };

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
    <dialog
      ref={dialog}
      id="navigation-drawer"
      className="navigation-dialog"
      aria-label="Nigoo navigation menu"
      onKeyDown={trapFocus}
      onCancel={handleClose}
      onClose={() => onClose?.()}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="drawer-panel">
        <div className="drawer-heading">
          <Link to="/" className="wordmark" onClick={handleClose}>
            nigoo<span>.</span>
          </Link>
          <button
            autoFocus
            className="icon-button"
            aria-label="Close navigation menu"
            onClick={handleClose}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <Navigation close={handleClose} />
      </div>
    </dialog>
  );
}
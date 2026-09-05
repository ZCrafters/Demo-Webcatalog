import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { X, ArrowUpRight, ChevronDown } from "lucide-react";
import { brand, categories } from "./catalog";
import { ShopeeIcon, TikTokIcon } from "./SocialIcons";

function Navigation({ close }) {
  return (
    <>
      <nav className="drawer-links" aria-label="Sidebar navigation">
        <NavLink to="/catalog" onClick={close}>
          All products <ArrowUpRight size={15} aria-hidden="true" />
        </NavLink>
        <details className="drawer-categories" data-active={false}>
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
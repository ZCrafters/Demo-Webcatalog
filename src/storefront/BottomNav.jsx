import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingBag, Grid3x3 } from "lucide-react";
import { CartContext } from "./CartProvider";

export function BottomNav({ onSearch }) {
  const { count } = useContext(CartContext);

  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/catalog">
          <Grid3x3 size={22} aria-hidden="true" />
          <span>Collection</span>
        </NavLink>
        <button
          className="bottom-nav-btn"
          aria-label="Search products"
          onClick={onSearch}
        >
          <Search size={22} aria-hidden="true" />
          <span>Search</span>
        </button>
        <Link to="/cart" className="bottom-nav-cart" aria-label={`Cart, ${count} items`}>
          <ShoppingBag size={22} aria-hidden="true" />
          <span>Cart</span>
          {count > 0 && <span className="bottom-cart-count">{count}</span>}
        </Link>
      </nav>
      <div className="bottom-nav-spacer" aria-hidden="true" />
    </>
  );
}
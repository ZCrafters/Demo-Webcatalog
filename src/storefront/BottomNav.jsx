import { NavLink } from "react-router-dom";
import { Search, Grid3x3, House } from "lucide-react";

export function BottomNav({ onSearch }) {
  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/">
          <House size={22} aria-hidden="true" />
          <span>Home</span>
        </NavLink>
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
      </nav>
      <div className="bottom-nav-spacer" aria-hidden="true" />
    </>
  );
}
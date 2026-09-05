import { NavLink } from "react-router-dom";
import { Grid3x3, House } from "lucide-react";

export function BottomNav() {
  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/">
          <House size={22} aria-hidden="true" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/catalog">
          <Grid3x3 size={22} aria-hidden="true" />
          <span>Products</span>
        </NavLink>
      </nav>
      <div className="bottom-nav-spacer" aria-hidden="true" />
    </>
  );
}
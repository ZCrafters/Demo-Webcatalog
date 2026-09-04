import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { brand } from "./catalog";

export function PromoBar() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="promo-bar">
      <a href={brand.shopee} target="_blank" rel="noreferrer">
        Free shipping min. purchase IDR 199k <ArrowUpRight size={13} aria-hidden="true" />
      </a>
      <button
        aria-label="Close announcement"
        onClick={() => setShow(false)}
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
import { useState } from "react";
import { X } from "lucide-react";

export function PromoBar() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="promo-bar">
      <p className="promo-bar-text">Free shipping on orders over IDR 199k</p>
      <button
        aria-label="Close announcement"
        onClick={() => setShow(false)}
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
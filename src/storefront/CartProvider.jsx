import { createContext, useEffect, useState } from "react";
import { products } from "./catalog";

// Store IDs and quantities only. Prices always come from the current catalog.
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);
const storageKey = "nigoo-cart-v1";
function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(stored)) return [];
    const seen = new Set();
    return stored
      .filter((item) => {
        if (
          !item ||
          seen.has(item.id) ||
          !products.some((p) => p.id === item.id) ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99
        )
          return false;
        seen.add(item.id);
        return true;
      })
      .map(({ id, quantity }) => ({ id, quantity }));
  } catch {
    return [];
  }
}
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      /* Works in memory when storage is unavailable. */
    }
  }, [cart]);
  const items = cart.map((item) => ({
    ...products.find((p) => p.id === item.id),
    quantity: item.quantity,
  }));
  const add = (id) =>
    setCart((previous) => {
      if (!products.some((p) => p.id === id)) return previous;
      return previous.some((item) => item.id === id)
        ? previous.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(99, item.quantity + 1) }
              : item,
          )
        : [...previous, { id, quantity: 1 }];
    });
  const update = (id, quantity) =>
    setCart((previous) =>
      quantity <= 0
        ? previous.filter((item) => item.id !== id)
        : previous.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(99, Math.max(1, quantity)) }
              : item,
          ),
    );
  return (
    <CartContext.Provider
      value={{
        items,
        add,
        update,
        clear: () => setCart([]),
        count: items.reduce((n, item) => n + item.quantity, 0),
        total: items.reduce((n, item) => n + item.price * item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

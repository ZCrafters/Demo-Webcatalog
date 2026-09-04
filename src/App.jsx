import { BrowserRouter } from "react-router-dom";
import { Storefront } from "./storefront/Storefront";
import { CartProvider } from "./storefront/CartProvider";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Storefront />
      </CartProvider>
    </BrowserRouter>
  );
}

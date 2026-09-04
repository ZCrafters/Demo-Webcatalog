import { BrowserRouter } from "react-router-dom";
import { Storefront } from "./storefront/Storefront";
import { CartProvider } from "./storefront/CartProvider";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <Storefront />
      </CartProvider>
    </BrowserRouter>
  );
}

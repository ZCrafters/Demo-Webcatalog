import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Storefront } from "./storefront/Storefront";
import { CartProvider } from "./storefront/CartProvider";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <HelmetProvider>
        <CartProvider>
          <Storefront />
        </CartProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

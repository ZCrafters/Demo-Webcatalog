import { CollectionBanner, Reveal } from "./CollectionBanner";
import { useContext, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CartContext } from "./CartProvider";
import { brand, categories, categoryName, products, rupiah } from "./catalog";
import {
  ButtonLink,
  EmptyState,
  ProductGrid,
  ProductImage,
} from "./components";

export function Home() {
  const favorites = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);
  return (
    <>
      <CollectionBanner
        variant="hero"
        title="Knits made for every day."
        label="THE EVERYDAY KNIT EDIT"
        to="/catalog"
        hero
      />
      <Reveal>
        <section className="section editorial-products">
          <div className="section-heading">
            <h2>Curated picks for you.</h2>
            <Link className="text-link" to="/catalog">
              All products ({products.length}) ↗
            </Link>
          </div>
          <ProductGrid products={products.slice(0, 8)} />
        </section>
      </Reveal>
      <Reveal>
        <CollectionBanner
          variant="sweater"
          title="Sweater, your way."
          to="/kategori/sweater"
        />
      </Reveal>
      <Reveal>
        <section className="section editorial-products">
          <div className="section-heading">
            <h2>Top picks on Shopee.</h2>
            <Link className="text-link" to="/catalog?sort=sold">
              View collection ↗
            </Link>
          </div>
          <ProductGrid products={favorites} />
          <p className="source-note">
            Ranked by units sold on Shopee. Current prices and availability
            follow the official store.
          </p>
        </section>
      </Reveal>
      <Reveal>
        <CollectionBanner
          variant="cardigan"
          title="Your favorite layer."
          to="/kategori/cardigan"
          label="CARDIGAN COLLECTION"
        />
      </Reveal>
      <Reveal>
        <section className="section editorial-products">
          <div className="section-heading">
            <h2>Find your cardigan.</h2>
            <Link className="text-link" to="/kategori/cardigan">
              View collection ↗
            </Link>
          </div>
          <ProductGrid
            products={products
              .filter((p) => p.category === "cardigan")
              .slice(0, 4)}
          />
        </section>
      </Reveal>
      <Reveal>
        <section className="brand-statement">
          <h2>
            Personal style.
            <br />
            Born from knitwear.
          </h2>
          <Link className="text-link" to="/about">
            Discover Nigoo ↗
          </Link>
        </section>
      </Reveal>
      <section className="social-section">
        <h2>Stay close with Nigoo.</h2>
        <p>
          Explore the collection on Shopee and find style inspiration on TikTok.
        </p>
        <div className="social-links">
          <a href={brand.shopee} target="_blank" rel="noreferrer">
            <span>Shopee</span>
            <span>@nigoo.id ↗</span>
          </a>
          <a href={brand.tiktok} target="_blank" rel="noreferrer">
            <span>TikTok</span>
            <span>@knitgoods.id ↗</span>
          </a>
        </div>
      </section>
    </>
  );
}

export function Catalog() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const activeCategory = category || params.get("category") || "";
  const query = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const update = (key, value) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  if (activeCategory && !categories.some((c) => c.slug === activeCategory))
    return <NotFound />;
  const filtered = products
    .filter(
      (p) =>
        (!activeCategory || p.category === activeCategory) &&
        `${p.name} ${p.sourceName} ${categoryName(p.category)}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "price-asc"
        ? a.price - b.price
        : sort === "price-desc"
          ? b.price - a.price
          : sort === "sold"
            ? b.soldCount - a.soldCount
            : a.id - b.id,
    );
  const queryString = new URLSearchParams(params);
  queryString.delete("category");
  const suffix = queryString.size ? `?${queryString}` : "";
  return (
    <div className="section catalog-page">
      <div className="page-heading">
        <p className="label">NIGOO COLLECTION</p>
        <h1>
          {activeCategory ? categoryName(activeCategory) : "Knitwear, your way."}
        </h1>
        <p>Discover pieces that complete your everyday look.</p>
      </div>
      <nav className="category-tabs" aria-label="Product categories">
        <Link
          className={!activeCategory ? "active" : ""}
          aria-current={!activeCategory ? "page" : undefined}
          to={`/catalog${suffix}`}
        >
          All <span>{products.length}</span>
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            className={activeCategory === c.slug ? "active" : ""}
            aria-current={activeCategory === c.slug ? "page" : undefined}
            to={`/kategori/${c.slug}${suffix}`}
          >
            {c.name}{" "}
            <span>{products.filter((p) => p.category === c.slug).length}</span>
          </Link>
        ))}
      </nav>
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <label htmlFor="catalog-search">Search products</label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            placeholder="Name or knit style"
            onChange={(event) => update("q", event.target.value)}
          />
        </div>
        <p role="status">{filtered.length} products</p>
        <div className="sort-control">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => update("sort", event.target.value)}
          >
            <option value="featured">{"Nigoo's picks"}</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="sold">Best sellers</option>
          </select>
        </div>
      </div>
      {filtered.length ? (
        <ProductGrid products={filtered} />
      ) : (
        <div className="empty-state">
          <h2>Nothing found?</h2>
          <p>
            No products match &ldquo;{query}&rdquo;. Try a different term or
            clear the search.
          </p>
          <button className="button" onClick={() => update("q", "")}>
            Clear search
          </button>
        </div>
      )}
      <p className="source-note">
        Reference prices sourced from Shopee catalog. Current availability,
        variants, and promotions are confirmed at the official store.
      </p>
    </div>
  );
}

export function ProductDetail() {
  const { slug } = useParams();
  const product = products.find(
    (p) => p.slug === slug || String(p.id) === slug,
  );
  const { add } = useContext(CartContext);
  const [added, setAdded] = useState(null);
  if (!product) return <NotFound />;
  return (
    <div className="section detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/catalog">Collection</Link>
        <span>/</span>
        <Link to={`/kategori/${product.category}`}>
          {categoryName(product.category)}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <div className="product-detail">
        <ProductImage key={product.id} product={product} />
        <div className="detail-copy">
          <p className="label">{categoryName(product.category)}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{rupiah(product.price)}</p>
          <p className="product-meta">
            ☆ {product.rating.toFixed(1)} / 5{" "}
            <span>{product.soldLabel} sold on Shopee</span>
          </p>
          <p className="detail-description">{product.description}</p>
          <div className="product-availability">
            <p>Size &amp; color</p>
            <span>
              View available variants and latest stock on Shopee.
            </span>
          </div>
          <a
            className="button full-width"
            href={brand.shopee}
            target="_blank"
            rel="noreferrer"
          >
            Shop on Shopee <span aria-hidden="true">↗</span>
          </a>
          <button
            className="button button-outline full-width"
            onClick={() => {
              add(product.id);
              setAdded(product.id);
            }}
          >
            Add to demo cart <span aria-hidden="true">+</span>
          </button>
          <div className="add-feedback" role="status">
            {added === product.id && (
              <>
                Added.{" "}
                <Link className="text-link" to="/cart">
                  View cart →
                </Link>
              </>
            )}
          </div>
          <p className="source-note">
            The website cart is a demo only. Real purchases are available
            through the official store.
          </p>
          <details>
            <summary>Product information</summary>
            <p>
              {product.sourceName.replace(/\.\.\.$/, "")}. Material details,
              sizing, and care instructions follow the seller&apos;s information.
            </p>
          </details>
          <details>
            <summary>Pricing &amp; shipping</summary>
            <p>
              Reference price {rupiah(product.price)}. A discount of{" "}
              {product.discountPercent}% is recorded on Shopee; promotions may
              change. Final price and shipping are confirmed at checkout on
              Shopee.
            </p>
          </details>
        </div>
      </div>
      <section className="related-products">
        <div className="section-heading">
          <h2>More from this collection.</h2>
        </div>
        <ProductGrid
          products={products
            .filter(
              (p) => p.category === product.category && p.id !== product.id,
            )
            .slice(0, 4)}
        />
        {products.filter((p) => p.category === product.category).length ===
          1 && (
          <ButtonLink to="/catalog" outline>
            Browse other collections
          </ButtonLink>
        )}
      </section>
    </div>
  );
}

export function About() {
  return (
    <>
      <section className="about-intro section">
        <p className="label">ABOUT US</p>
        <h1>
          Meet Nigoo.
          <br />
          Find your style.
        </h1>
        <div className="about-body">
          <p>
            Nigoo is a women&apos;s knitwear brand with a collection of
            cardigans, sweaters, and knit tops.
          </p>
          <div>
            <p>
              We offer thoughtfully crafted knitwear to complement your everyday
              style — from layering cardigans to sweaters and tops worn exactly
              your way.
            </p>
            <p>
              Browse the full collection here, then discover available variants
              and stock through Nigoo&apos;s official Shopee store.
            </p>
            <ButtonLink to="/catalog">
              View collection <span aria-hidden="true">↗</span>
            </ButtonLink>
          </div>
        </div>
      </section>
      <div className="about-banner">
        <span className="hero-monogram" aria-hidden="true">
          nigoo.
        </span>
        <span>Collection photos coming soon</span>
      </div>
      <section className="social-section">
        <h2>Connect with us, every day.</h2>
        <p>Find Nigoo on Shopee @nigoo.id and TikTok @knitgoods.id.</p>
        <div className="social-links">
          <a href={brand.shopee} target="_blank" rel="noreferrer">
            Shop on Shopee <span>↗</span>
          </a>
          <a href={brand.tiktok} target="_blank" rel="noreferrer">
            Follow on TikTok <span>↗</span>
          </a>
        </div>
      </section>
    </>
  );
}

export function Contact() {
  return (
    <div className="section contact-page">
      <div className="page-heading">
        <p className="label">CONTACT &amp; SOCIAL</p>
        <h1>Find us here.</h1>
        <p>
          Need help with sizing, colors, or an order? Reach the seller directly
          via chat in the Shopee store.
        </p>
      </div>
      <div className="contact-channels">
        <a href={brand.shopee} target="_blank" rel="noreferrer">
          <span className="label">SHOP &amp; ENQUIRIES</span>
          <h2>
            Shopee <span>↗</span>
          </h2>
          <p>@nigoo.id</p>
          <p>Full collection, variant options, and seller chat.</p>
        </a>
        <a href={brand.tiktok} target="_blank" rel="noreferrer">
          <span className="label">INSPIRATION &amp; UPDATES</span>
          <h2>
            TikTok <span>↗</span>
          </h2>
          <p>@knitgoods.id</p>
          <p>Explore the collection and get styling inspiration.</p>
        </a>
      </div>
      <section className="shopping-guide" id="belanja">
        <h2>Before you shop.</h2>
        <details open>
          <summary>How do I purchase?</summary>
          <p>
            Browse the catalog, then open Nigoo&apos;s Shopee store from the
            product page. Find the same product, choose your variant, and
            complete payment on Shopee.
          </p>
        </details>
        <details>
          <summary>Can I checkout on this website?</summary>
          <p>
            At this stage, the website cart and checkout are a demo simulation.
            No payment is processed and no order is sent to the seller.
          </p>
        </details>
        <details>
          <summary>What about pricing, shipping, and returns?</summary>
          <p>
            Prices shown are reference figures from the Shopee catalog. Final
            price, shipping fees, promotions, and return policies are governed
            by the store and platform at the time of purchase.
          </p>
        </details>
      </section>
    </div>
  );
}

function OrderSummary({ total, children }) {
  return (
    <aside className="order-summary">
      <h2>Order Summary</h2>
      <div>
        <span>Product subtotal</span>
        <strong>{rupiah(total)}</strong>
      </div>
      <div>
        <span>Shipping</span>
        <span>Not calculated</span>
      </div>
      <p>This is a shopping simulation. No payment will be charged.</p>
      {children}
    </aside>
  );
}

export function Cart() {
  const { items, update, total } = useContext(CartContext);
  return (
    <div className="section cart-page">
      <div className="page-heading">
        <p className="label">DEMO CART</p>
        <h1>Your picks.</h1>
      </div>
      {!items.length ? (
        <EmptyState title="Your cart is empty.">
          Find your favorite knitwear in the Nigoo collection.
        </EmptyState>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <Link to={`/produk/${item.slug}`}>
                  <ProductImage product={item} />
                </Link>
                <div className="cart-item-copy">
                  <span className="label">{categoryName(item.category)}</span>
                  <h2>
                    <Link to={`/produk/${item.slug}`}>{item.name}</Link>
                  </h2>
                  <p>{rupiah(item.price)}</p>
                  <div className="quantity-control">
                    <button
                      aria-label={`Decrease ${item.name}`}
                      onClick={() => update(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      disabled={item.quantity >= 99}
                      aria-label={`Increase ${item.name}`}
                      onClick={() => update(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <strong>{rupiah(item.price * item.quantity)}</strong>
                  <button
                    className="text-link"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => update(item.id, 0)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <OrderSummary total={total}>
            <ButtonLink to="/checkout">Proceed to demo →</ButtonLink>
            <Link className="text-link" to="/catalog">
              Continue browsing
            </Link>
          </OrderSummary>
        </div>
      )}
    </div>
  );
}

export function Checkout() {
  const { items, total, clear } = useContext(CartContext);
  const [complete, setComplete] = useState(false);
  if (complete)
    return (
      <div className="section">
        <div className="empty-state">
          <p className="label">SIMULATION COMPLETE</p>
          <h1>Thank you.</h1>
          <p>
            You&apos;ve completed the demo checkout. No order was placed, no
            payment was charged, and no address was saved.
          </p>
          <a
            className="button"
            href={brand.shopee}
            target="_blank"
            rel="noreferrer"
          >
            Shop on Shopee ↗
          </a>
          <ButtonLink outline to="/catalog">
            View collection
          </ButtonLink>
        </div>
      </div>
    );
  if (!items.length)
    return (
      <div className="section">
        <EmptyState title="No items selected yet.">
          Add products to your cart to try the checkout flow.
        </EmptyState>
      </div>
    );
  return (
    <div className="section checkout-page">
      <div className="page-heading">
        <p className="label">DEMO CHECKOUT</p>
        <h1>Try the checkout flow.</h1>
        <p>
          Use sample details. This form does not send or store your address,
          and no payment is processed.
        </p>
      </div>
      <div className="cart-layout">
        <form
          id="checkout-form"
          className="checkout-form"
          onSubmit={(event) => {
            event.preventDefault();
            clear();
            setComplete(true);
            window.scrollTo(0, 0);
          }}
        >
          <h2>Shipping address</h2>
          <label htmlFor="name">Recipient name</label>
          <input
            id="name"
            name="name"
            autoComplete="off"
            required
            maxLength={100}
          />
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            pattern="[+0-9() -]{8,20}"
            title="Enter 8–20 digit phone number"
            required
          />
          <label htmlFor="address">Full address</label>
          <textarea
            id="address"
            name="address"
            autoComplete="off"
            required
            maxLength={400}
            rows={3}
          />
          <div className="form-columns">
            <div>
              <label htmlFor="city">City / district</label>
              <input id="city" name="city" autoComplete="off" required />
            </div>
            <div>
              <label htmlFor="postcode">Postal code</label>
              <input
                id="postcode"
                name="postcode"
                inputMode="numeric"
                pattern="[0-9]{5}"
                title="Enter a 5-digit postal code"
                autoComplete="off"
                required
              />
            </div>
          </div>
        </form>
        <OrderSummary total={total}>
          <ul className="summary-items">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{rupiah(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <button className="button" type="submit" form="checkout-form">
            Complete simulation
          </button>
        </OrderSummary>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="section">
      <EmptyState title="Page not found.">
        The product or page you&apos;re looking for doesn&apos;t exist. Head
        back to the Nigoo collection to continue.
      </EmptyState>
    </div>
  );
}

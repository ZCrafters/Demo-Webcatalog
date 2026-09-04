import { Reveal } from "./CollectionBanner";
import { HeroSlideshow } from "./HeroSlideshow";
import { useContext, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CartContext } from "./CartProvider";
import { brand, categories, categoryName, products, rupiah } from "./catalog";
import { ShopeeIcon, TikTokIcon } from "./SocialIcons";
import {
  ButtonLink,
  EmptyState,
  ProductGrid,
  ProductGallery,
  ProductImage,
} from "./components";
import homeSections from "./sections";

export function Home() {
  return (
    <>
      {homeSections.map((section, i) => {
        switch (section.type) {
          case "hero":
            return <HeroSlideshow key="hero" />;
          case "productGrid":
            return <ProductGridSection key={section.id || i} {...section} />;
          case "promoGrid":
            return <PromoGridSection key={i} {...section} />;
          case "brandStatement":
            return <BrandStatementSection key="brand" />;
          case "social":
            return <SocialSection key="social" />;
          default:
            return null;
        }
      })}
    </>
  );
}

function ProductGridSection({
  title,
  linkLabel,
  to,
  sort,
  category,
  limit,
  note,
}) {
  const filtered = [...products]
    .filter((p) => !category || p.category === category)
    .sort((a, b) =>
      sort === "sold" ? b.soldCount - a.soldCount : a.id - b.id,
    )
    .slice(0, limit || products.length);
  return (
    <Reveal>
      <section className="section editorial-products">
        <div className="section-heading">
          <h2>{title}</h2>
          {to && linkLabel && (
            <Link className="text-link" to={to}>
              {linkLabel} ↗
            </Link>
          )}
        </div>
        <ProductGrid products={filtered} />
        {note && <p className="source-note">{note}</p>}
      </section>
    </Reveal>
  );
}

function PromoGridSection({ title, to, label, variant }) {
  return (
    <Reveal>
      <section className={`editorial-banner banner-${variant || "sweater"}`}>
        <Link to={to} className="banner-link" aria-label={`${title}, view collection`}>
          <div className="banner-photo-placeholder" aria-hidden="true">
            <span>n.</span>
            <small>Collection photo coming soon</small>
          </div>
          <div className="banner-caption">
            {label && <p className="label">{label}</p>}
            <h2>{title}</h2>
            <span className="banner-cta">
              View collection ↗
            </span>
          </div>
        </Link>
      </section>
    </Reveal>
  );
}

function BrandStatementSection({ title, subtitle }) {
  return (
    <Reveal>
      <section className="brand-statement">
        <h2>
          {title}
          <br />
          {subtitle || ""}
        </h2>
        <Link className="text-link" to="/about">
          Discover Nigoo ↗
        </Link>
      </section>
    </Reveal>
  );
}

function SocialSection() {
  return (
    <section className="social-section">
      <h2>Stay close with Nigoo.</h2>
      <p>
        Explore the collection on Shopee and find style inspiration on TikTok.
      </p>
      <div className="social-links">
        <a href={brand.shopee} target="_blank" rel="noreferrer">
          <ShopeeIcon />
          <span>Shopee</span>
          <span>@nigoo.id ↗</span>
        </a>
        <a href={brand.tiktok} target="_blank" rel="noreferrer">
          <TikTokIcon />
          <span>TikTok</span>
          <span>@knitgoods.id ↗</span>
        </a>
      </div>
    </section>
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
        <ProductGallery key={product.id} product={product} />
        <div className="detail-copy">
          <p className="label">{categoryName(product.category)}</p>
          <h1>{product.name}</h1>
          <div className="detail-price-row">
            {product.originalPrice ? (
              <>
                <p className="detail-price">{rupiah(product.price)}</p>
                <s className="detail-price-original">{rupiah(product.originalPrice)}</s>
                {product.discountPercent ? (
                  <span className="detail-discount">-{product.discountPercent}%</span>
                ) : null}
              </>
            ) : (
              <p className="detail-price">{rupiah(product.price)}</p>
            )}
          </div>
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
  const stats = {
    total: products.length,
    cardigan: products.filter((p) => p.category === "cardigan").length,
    sweater: products.filter((p) => p.category === "sweater").length,
    tops: products.filter((p) => p.category === "atasan").length,
    halfZip: products.filter((p) => p.category === "half-zip").length,
    avgRating: (
      products.reduce((s, p) => s + p.rating, 0) / products.length
    ).toFixed(1),
  };
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
            Nigoo is a women&apos;s knitwear brand built around pieces you
            actually want to wear.
          </p>
          <div>
            <p>
              We design knitwear that moves with your day — cardigans that
              layer without bulk, sweaters that feel like a second skin, tops
              that work from morning coffee to evening plans. Everything is
              available through Nigoo&apos;s official Shopee store, where you
              can browse variants, check stock, and order directly.
            </p>
            <ButtonLink to="/catalog">
              View collection <span aria-hidden="true">↗</span>
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="about-value">
          <span className="about-value-icon">○</span>
          <h3>Crafted to layer.</h3>
          <p>
            Every piece is designed to sit comfortably under a jacket or
            stand on its own. No bulk, no fuss.
          </p>
        </div>
        <div className="about-value">
          <span className="about-value-icon">○</span>
          <h3>Made for every day.</h3>
          <p>
            Machine-washable knits in neutral and seasonal tones that pair
            with everything you already own.
          </p>
        </div>
        <div className="about-value">
          <span className="about-value-icon">○</span>
          <h3>Worn your way.</h3>
          <p>
            Oversized or fitted, dressed up or down — Nigoo fits your
            silhouette, not the other way around.
          </p>
        </div>
      </section>

      <section className="about-stats">
        <div className="about-stat">
          <span className="about-stat-number">{stats.total}</span>
          <span className="about-stat-label">pieces</span>
        </div>
        <div className="about-stat">
          <span className="about-stat-number">{stats.cardigan}</span>
          <span className="about-stat-label">cardigans</span>
        </div>
        <div className="about-stat">
          <span className="about-stat-number">{stats.sweater}</span>
          <span className="about-stat-label">sweaters</span>
        </div>
        <div className="about-stat">
          <span className="about-stat-number">{stats.avgRating}</span>
          <span className="about-stat-label">★ avg rating</span>
        </div>
      </section>

      <section className="about-platforms">
        <h2>Two places, one brand.</h2>
        <div className="about-platform">
          <ShopeeIcon />
          <div>
            <strong>Shopee</strong>
            <span>Browse the full collection, pick your variant, and order.</span>
            <span className="about-platform-handle">@nigoo.id</span>
          </div>
        </div>
        <div className="about-platform">
          <TikTokIcon />
          <div>
            <strong>TikTok</strong>
            <span>Style inspiration, restock updates, and behind the scenes.</span>
            <span className="about-platform-handle">@knitgoods.id</span>
          </div>
        </div>
      </section>

      <section className="about-statement">
        <div className="about-statement-overlay" />
        <h2>
          Personal style.
          <br />
          Born from knitwear.
        </h2>
        <Link className="text-link" to="/catalog">
          Discover Nigoo ↗
        </Link>
      </section>
    </>
  );
}

export function Contact() {
  return (
    <div className="section contact-page">
      <h1 className="contact-heading">Find us here.</h1>
      <div className="social-rows">
        <a href={brand.shopee} target="_blank" rel="noreferrer" className="social-row">
          <ShopeeIcon />
          <span className="social-name">Shopee</span>
          <span className="social-handle">@nigoo.id ↗</span>
        </a>
        <a href={brand.tiktok} target="_blank" rel="noreferrer" className="social-row">
          <TikTokIcon />
          <span className="social-name">TikTok</span>
          <span className="social-handle">@knitgoods.id ↗</span>
        </a>
      </div>
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { categoryName, rupiah } from "./catalog";
export function ButtonLink({ children, to, outline = false, ...props }) {
  return (
    <Link
      className={`button${outline ? " button-outline" : ""}`}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
}
export function ProductImage({ product, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = product?.images?.[0];
  return (
    <div className={`product-image ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={product.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="photo-placeholder"
          role="img"
          aria-label={`Photo of ${product?.name || "Nigoo collection"} coming soon`}
        >
          <span className="placeholder-mark" aria-hidden="true">
            n.
          </span>
          <span>Photo coming soon</span>
        </div>
      )}
    </div>
  );
}
export function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/produk/${product.slug}`} aria-label={`View ${product.name}`}>
        <ProductImage product={product} />
      </Link>
      <div className="product-info">
        <span className="label">{categoryName(product.category)}</span>
        <h3>
          <Link to={`/produk/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="price">{rupiah(product.price)}</p>
        <p className="product-meta">
          <span aria-label={`Rating ${product.rating} out of 5`}>
            ☆ {product.rating.toFixed(1)}
          </span>
          <span>{product.soldLabel} sold</span>
        </p>
      </div>
    </article>
  );
}
export function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
export function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{children}</p>
      <ButtonLink to="/catalog">View collection</ButtonLink>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import banners from "./banners.json";

export function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            node.classList.remove("reveal-pending");
            observer.unobserve(node);
          }
      },
      { threshold: 0.05 },
    );
    node.classList.add("reveal-pending");
    observer.observe(node);
    return () => {
      observer.disconnect();
      node.classList.remove("reveal-pending");
    };
  }, []);
  return (
    <div ref={ref} className={`reveal-section ${className}`}>
      {children}
    </div>
  );
}
export function CollectionBanner({ variant, title, to, hero = false, label }) {
  const image = banners[variant];
  const [failed, setFailed] = useState(false);
  const hasImage = image?.src && !failed;
  const Heading = hero ? "h1" : "h2";
  return (
    <section
      className={`editorial-banner banner-${variant} ${hero ? "banner-hero" : ""} ${hasImage ? "has-photo" : ""}`}
    >
      <Link
        to={to}
        className="banner-link"
        aria-label={`${title}, view collection`}
      >
        {hasImage ? (
          <img
            src={image.src}
            alt={image.alt}
            loading={hero ? "eager" : "lazy"}
            fetchPriority={hero ? "high" : "auto"}
            onError={() => setFailed(true)}
            style={{ objectPosition: image.position || "center" }}
          />
        ) : (
          <div className="banner-photo-placeholder" aria-hidden="true">
            <span>n.</span>
            <small>Collection photo coming soon</small>
          </div>
        )}
        <div className="banner-caption">
          {label && <p className="label">{label}</p>}
          <Heading>{title}</Heading>
          <span className="banner-cta">
            View collection <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </section>
  );
}


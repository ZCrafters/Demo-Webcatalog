import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import banners from "./banners.json";
import { Reveal } from "./CollectionBanner";

export function HeroSlideshow() {
  const slides = banners.slides || [];
  const [index, setIndex] = useState(0);
  const reduce = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!slides.length || reduce.current) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <Reveal>
      <section
        className="hero-slideshow"
        aria-roledescription="carousel"
        aria-label="Featured collections"
      >
        <div
          className="hero-slideshow-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <Slide key={i} slide={slide} active={i === index} />
          ))}
        </div>

        {slides.length > 1 && (
          <div className="hero-slideshow-nav">
            <button
              className="icon-button"
              aria-label="Previous slide"
              onClick={prev}
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <div className="hero-slideshow-dots" role="tablist">
              {slides.map((slide, i) => (
                <button
                  key={i}
                  className={`hero-dot${i === index ? " active" : ""}`}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <button
              className="icon-button"
              aria-label="Next slide"
              onClick={next}
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </Reveal>
  );
}

function Slide({ slide, active }) {
  const [failed, setFailed] = useState(false);
  const hasImage = slide?.src && !failed;
  const Heading = active ? "h1" : "h2";
  return (
    <div className="hero-slide" aria-hidden={!active}>
      <Link
        to={slide.to || "/catalog"}
        className="hero-slide-link"
        aria-label={`${slide.title}, view collection`}
      >
        {hasImage ? (
          <img
            src={slide.src}
            alt={slide.alt}
            loading={active ? "eager" : "lazy"}
            fetchPriority={active ? "high" : "auto"}
            style={{ objectPosition: slide.position || "center" }}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="banner-photo-placeholder" aria-hidden="true">
            <span>n.</span>
            <small>Collection photo coming soon</small>
          </div>
        )}
        <div className="hero-slide-caption">
          {slide.label && <p className="label">{slide.label}</p>}
          <Heading>{slide.title}</Heading>
          <span className="banner-cta">
            View collection <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </div>
  );
}
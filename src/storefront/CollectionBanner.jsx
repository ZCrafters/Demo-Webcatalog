import { useEffect, useRef } from "react";

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


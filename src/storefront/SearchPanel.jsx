import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const POPULAR = ["cardigan", "sweater", "knit", "cable", "oversize", "stripe", "top", "polo"];

export function SearchPanel({ open, onClose }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  const run = useCallback(
    (term) => {
      navigate(`/catalog?q=${encodeURIComponent(term)}`);
      onClose();
    },
    [navigate, onClose],
  );

  const submit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    if (q?.trim()) run(q.trim());
  };

  return (
    <>
      <div
        className={`search-panel-backdrop${open ? " open" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`search-panel${open ? " open" : ""}`}
        role="dialog"
        aria-label="Search products"
        aria-hidden={!open}
      >
        <form className="search-panel-form" onSubmit={submit}>
          <input
            ref={inputRef}
            id="search-panel-input"
            type="search"
            name="q"
            placeholder="Search the Nigoo collection"
            autoComplete="off"
            aria-label="Search products"
          />
          <button
            className="icon-button search-panel-close"
            type="button"
            aria-label="Close search"
            onClick={onClose}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </form>

        <div className="search-panel-hints">
          <p className="search-panel-label">Popular searches</p>
          <div className="search-panel-pills">
            {POPULAR.map((term) => (
              <button key={term} className="search-pill" onClick={() => run(term)} type="button">
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
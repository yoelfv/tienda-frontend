import { useEffect, useRef } from "react";
import { getStrapiMedia } from "../services/api";

export default function CategoriesBar({ categorias, categoriaActiva, onSelect }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY * 2, behavior: "auto" });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="categories-scroll" ref={scrollRef}>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          className={`cat-chip ${categoriaActiva === cat.slug ? "active" : ""}`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.imagen?.url ? (
            <img
              src={getStrapiMedia(cat.imagen.url)}
              alt={cat.nombre}
              className="cat-chip-img"
            />
          ) : (
            <span className="cat-chip-icon">📦</span>
          )}
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
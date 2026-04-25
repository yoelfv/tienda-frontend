import { useEffect, useRef } from "react";
import { getStrapiMedia } from "../services/api";

export default function CategoriasBar({ categorias, categoriaActiva, onSelect }) {
  const scrollRef = useRef(null);

  // 🖱️ Permitir scroll horizontal con la rueda del mouse
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // Solo aplica si el scroll horizontal es posible
      if (el.scrollWidth <= el.clientWidth) return;

      e.preventDefault();

      // Usa deltaY para desplazamiento horizontal más rápido
      el.scrollBy({
        left: e.deltaY * 2, // Multiplicador para hacerlo más rápido
        behavior: "auto",
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="categorias-scroll" ref={scrollRef}>
      <button
        className={`cat-chip ${categoriaActiva === "todas" ? "active" : ""}`}
        onClick={() => onSelect("todas")}
      >
        🏪 Todo
      </button>
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
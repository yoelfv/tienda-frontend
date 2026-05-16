import { useEffect, useRef } from "react";
import { getStrapiMedia } from "../../services/api";

export default function CategoryBar({ categories, activeCategory, onSelect }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleWheel = (event) => {
      if (element.scrollWidth <= element.clientWidth) return;

      event.preventDefault();
      element.scrollBy({
        left: event.deltaY * 2,
      });
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => element.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="categories-scroll" ref={scrollRef}>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`cat-chip ${activeCategory === category.slug ? "active" : ""}`}
          onClick={() => onSelect(category.slug)}
        >
          {category.image?.url ? (
            <img src={getStrapiMedia(category.image.url)} className="cat-chip-img" />
          ) : (
            <span className="cat-chip-icon">📦</span>
          )}
          {category.name}
        </button>
      ))}
    </div>
  );
}

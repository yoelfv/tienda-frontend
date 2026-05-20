import { useEffect, useRef } from "react";

import { getStrapiMedia } from "@/services/api";

import type { Category } from "@/types/category";

type CategoryBarProps = {
  categories: Category[];
  activeCategory: string;
  onSelect: (slug: string) => void;
};

export default function CategoryBar({ categories, activeCategory, onSelect }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    const handleWheel = (event: WheelEvent): void => {
      if (element.scrollWidth <= element.clientWidth) {
        return;
      }

      event.preventDefault();

      element.scrollBy({
        left: event.deltaY * 2,
      });
    };

    element.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
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
            <img
              src={getStrapiMedia(category.image.url)}
              className="cat-chip-img"
              alt={category.name}
            />
          ) : (
            <span className="cat-chip-icon">📦</span>
          )}

          {category.name}
        </button>
      ))}
    </div>
  );
}

import { useEffect, useLayoutEffect, useRef } from "react";

import { getStrapiMedia } from "@/services/api";

import type { Category } from "@/types/category";

type CategoryBarProps = {
  categories: Category[];
  activeCategory: string;
  onSelect: (slug: string) => void;
};

const ACTIVE_CATEGORY_SELECTOR = ".cat-chip.active";

export default function CategoryBar({ categories, activeCategory, onSelect }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Permite desplazar horizontalmente la barra con la rueda del ratón.
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

  // Mantiene visible y centrada la categoría activa.
  useLayoutEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const activeButton = container.querySelector<HTMLElement>(ACTIVE_CATEGORY_SELECTOR);

    if (!activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const isFullyVisible =
      buttonRect.left >= containerRect.left && buttonRect.right <= containerRect.right;

    if (!isFullyVisible) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeCategory]);

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

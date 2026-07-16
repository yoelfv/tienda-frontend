import { useEffect, useRef } from "react";

import { getDailyData } from "@/utils/storage";

import { STORAGE_KEYS } from "@/constants/storageKeys";

type ScrollPositions = Record<string, number>;

export function useCategoryScroll(
  activeCategory: string | null,
  isReady: boolean
) {
  const restoredCategory = useRef<string | null>(null);

  useEffect(() => {
    if (!activeCategory || !isReady) return;

    if (restoredCategory.current === activeCategory) {
      return;
    }

    const positions =
        getDailyData<ScrollPositions>(
            STORAGE_KEYS.CATEGORY_SCROLLS
        ) ?? {};

    const savedPosition = positions[activeCategory] ?? 0;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: "instant",
        });

        restoredCategory.current = activeCategory;

        observer.disconnect();
      });
    });

    const content = document.querySelector(".main-content");

    if (content) {
      observer.observe(content);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeCategory, isReady]);
}
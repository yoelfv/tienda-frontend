import { useEffect, useState } from "react";

import { getProductsByCategory, getCategories } from "@/services/api";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";

import {
  getDailyData,
  saveDailyData,
} from "@/utils/storage";

import CategoryBar from "./CategoryBar";
import ProductGrid from "./ProductGrid";

import type { ProductPage } from "@/types/product";
import type { Category } from "@/types/category";

import { STORAGE_KEYS } from "@/constants/storageKeys";

import ProductGridSkeleton from "./ProductGridSkeleton";

export default function Shop() {

  const [productsCache, setProductsCache] = useState<Record<string, ProductPage>>({});

  const [categories, setCategories] = useState<Category[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const products = activeCategory
    ? productsCache[activeCategory] ?? null
    : null;

  const isLoadingProducts =
    activeCategory !== null &&
    !productsCache[activeCategory];

  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useCategoryScroll(
    activeCategory,
    products !== null
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const header = document.querySelector(".header");

      if (header instanceof HTMLElement) {
        setHeaderHeight(header.offsetHeight);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        const sortedCats = [...cats].sort((a, b) =>
          a.name.localeCompare(b.name, "es")
        );

        setCategories(sortedCats);

        const lastCategory = getDailyData<string>(
          STORAGE_KEYS.LAST_ACTIVE_CATEGORY
        );

        const categoryExists = sortedCats.some(
          (cat) => cat.slug === lastCategory
        );

        if (categoryExists && lastCategory) {
          setActiveCategory(lastCategory);
        } else if (sortedCats.length > 0) {
          setActiveCategory(sortedCats[0].slug);
        }
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;

    if (productsCache[activeCategory]) {
      return;
    }

    getProductsByCategory(activeCategory).then((result) => {
      setProductsCache((prev) => ({
        ...prev,
        [activeCategory]: result,
      }));
    });
  }, [activeCategory, productsCache]);

  useEffect(() => {
    if (!activeCategory) return;

    saveDailyData(
      STORAGE_KEYS.LAST_ACTIVE_CATEGORY,
      activeCategory
    );
  }, [activeCategory]);

  if (loadingCategories || activeCategory === null) {
    return (
      <div className="loading-container">
        <div className="spinner" />

        <p className="loading-text">Cargando tienda...</p>
      </div>
    );
  }

const handleCategoryChange = (newCategory: string) => {
  if (activeCategory) {
    const positions =
      getDailyData<Record<string, number>>(
        STORAGE_KEYS.CATEGORY_SCROLLS
      ) ?? {};

    positions[activeCategory] = window.scrollY;

    saveDailyData(
      STORAGE_KEYS.CATEGORY_SCROLLS,
      positions
    );
  }

  setActiveCategory(newCategory);
};

const loadNextPage = async () => {
  if (!activeCategory || isLoadingMore) {
    return;
  }

  const currentPage = productsCache[activeCategory];

  if (!currentPage || !currentPage.hasMore) {
    return;
  }

  setIsLoadingMore(true);

  try {
    const nextPage = await getProductsByCategory(
      activeCategory,
      currentPage.page + 1
    );

    setProductsCache((prev) => ({
      ...prev,
      [activeCategory]: {
        products: [
          ...prev[activeCategory].products,
          ...nextPage.products,
        ],
        page: nextPage.page,
        hasMore: nextPage.hasMore,
      },
    }));
  } finally {
    setIsLoadingMore(false);
  }
};

  return (
    <>
      <div
        className="categories-fixed-wrapper"
        style={{
          top: `${headerHeight}px`,
        }}
      >
        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleCategoryChange}
        />
      </div>

      <div
        className="main-content"
        style={{
          paddingTop: `${headerHeight}px`,
        }}
      >
        {isLoadingProducts ? (
          <ProductGridSkeleton />
        ) : (
          <>
            <ProductGrid products={products?.products ?? []} />

            {products?.hasMore && (
              <div className="load-more-container">
                <button
                  className="btn-load-more"
                  onClick={loadNextPage}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Cargando..." : "Ver más productos"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

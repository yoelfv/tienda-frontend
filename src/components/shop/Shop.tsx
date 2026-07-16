import { useEffect, useState } from "react";

import { getProductsByCategory, getCategories } from "@/services/api";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";

import {
  getDailyData,
  saveDailyData,
} from "@/utils/storage";

import CategoryBar from "./CategoryBar";
import ProductGrid from "./ProductGrid";

import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

import { STORAGE_KEYS } from "@/constants/storageKeys";

//const LAST_ACTIVE_CATEGORY_STORAGE_KEY = "tienda:lastActiveCategory";

export default function Shop() {
  const [products, setProducts] = useState<Product[] | null>(null);

  const [productsCache, setProductsCache] = useState<Record<string, Product[]>>({});

  const [categories, setCategories] = useState<Category[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

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

    const cachedProducts = productsCache[activeCategory];

    if (cachedProducts) {
      setProducts(cachedProducts);
      return;
    }

    setProducts(null);

    getProductsByCategory(activeCategory).then((prods) => {
      setProducts(prods);

      setProductsCache((prev) => ({
        ...prev,
        [activeCategory]: prods,
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
        <ProductGrid products={products} />
      </div>
    </>
  );
}

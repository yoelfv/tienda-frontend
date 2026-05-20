import {
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  getCategories,
} from "../../services/api";

import CategoryBar from "./CategoryBar";
import ProductGrid from "./ProductGrid";

import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

export default function Shop() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState<string | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [headerHeight, setHeaderHeight] =
    useState<number>(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const header =
        document.querySelector(".header");

      if (header instanceof HTMLElement) {
        setHeaderHeight(
          header.offsetHeight,
        );
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      getProducts(),
      getCategories(),
    ])
      .then(([prods, cats]) => {
        const sortedCats = [...cats].sort(
          (a, b) =>
            a.name.localeCompare(
              b.name,
              "es",
            ),
        );

        setProducts(prods);
        setCategories(sortedCats);

        if (sortedCats.length > 0) {
          setActiveCategory(
            sortedCats[0].slug,
          );
        }
      })
      .finally(() =>
        setLoading(false),
      );
  }, []);

  if (
    loading ||
    activeCategory === null
  ) {
    return (
      <div className="loading-container">
        <div className="spinner" />

        <p className="loading-text">
          Cargando tienda...
        </p>
      </div>
    );
  }

  const filteredProducts =
    products.filter(
      (product) =>
        product.category?.slug ===
        activeCategory,
    );

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
          activeCategory={
            activeCategory
          }
          onSelect={
            setActiveCategory
          }
        />
      </div>

      <div
        className="main-content"
        style={{
          paddingTop: `${headerHeight}px`,
        }}
      >
        <ProductGrid
          products={
            filteredProducts
          }
        />
      </div>
    </>
  );
}
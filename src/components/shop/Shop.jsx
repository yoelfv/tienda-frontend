import { useEffect, useState } from "react";
import { getProductos, getCategorias } from "../../services/api";

import CategoryBar from "./CategoryBar";
import ProductGrid from "./ProductGrid";

export default function Shop() {
  const [products, setProducts] = useState([]);        // ← antes "productos"
  const [categories, setCategories] = useState([]);    // ← antes "categorias"
  const [activeCategory, setActiveCategory] = useState(null); // ← antes "categoriaActiva"
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    Promise.all([getProductos(), getCategorias()])
      .then(([prods, cats]) => {
        const sortedCats = [...cats].sort((a, b) =>
          a.name.localeCompare(b.name, "es")
        );

        setProducts(prods);           // ← actualizado
        setCategories(sortedCats);    // ← actualizado

        if (sortedCats.length > 0) {
          setActiveCategory(sortedCats[0].slug);  // ← actualizado
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || activeCategory === null) {   // ← actualizado
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando tienda...</p>
      </div>
    );
  }

  const filteredProducts = products.filter(   // ← actualizado
    (product) => product.category?.slug === activeCategory  // ← actualizado
  );

  return (
    <>
      <div
        className="categories-fixed-wrapper"
        style={{ top: `${headerHeight}px` }}
      >
        <CategoryBar
          categories={categories}           // ← antes "categorias"
          activeCategory={activeCategory}   // ← antes "categoriaActiva"
          onSelect={setActiveCategory}      // ← antes "setCategoriaActiva"
        />
      </div>

      <div
        className="main-content"
        style={{
          paddingTop: `${headerHeight}px`
        }}
      >
        <ProductGrid products={filteredProducts} />  {/* ← "productosFiltrados" → "filteredProducts" */}
      </div>
    </>
  );
}
import { useEffect, useState } from "react";
import { getProductos, getCategorias } from "../../services/api";

import CategoryBar from "./CategoryBar";
import ProductGrid from "./ProductGrid";

export default function Shop() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
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
          a.nombre.localeCompare(b.nombre, "es")
        );

        setProductos(prods);
        setCategorias(sortedCats);

        if (sortedCats.length > 0) {
          setCategoriaActiva(sortedCats[0].slug);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || categoriaActiva === null) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando tienda...</p>
      </div>
    );
  }

  const productosFiltrados = productos.filter(
    (p) => p.categoria?.slug === categoriaActiva
  );

  return (
    <>
      <div
        className="categories-fixed-wrapper"
        style={{ top: `${headerHeight}px` }}
      >
        <CategoryBar
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onSelect={setCategoriaActiva}
        />
      </div>

      <div
        className="main-content"
        style={{
          paddingTop: `${headerHeight}px`
        }}
      >
        <ProductGrid productos={productosFiltrados} />
      </div>
    </>
  );
}
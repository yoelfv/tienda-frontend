import { useEffect, useState, useCallback } from "react";
import { getProductos, getCategorias, getStrapiMedia } from "../services/api";
import AddToCart from "./AddToCart";
import SafeImage from "./SafeImage";

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProductos(), getCategorias()]);
      
      setProductos(prods);
      setCategorias(cats);

      // Primera carga: seleccionar la primera categoría
      if (categoriaActiva === null && cats.length > 0) {
        setCategoriaActiva(cats[0].slug);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [categoriaActiva]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCategoriaClick = (slug) => {
    setCategoriaActiva(slug);
    cargarDatos();
  };

  // Recargar al volver a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        cargarDatos();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cargarDatos]);

  if (categoriaActiva === null && loading) {
    return <div className="loading">Cargando tienda...</div>;
  }

  const productosFiltrados = productos.filter(
    (p) => p.categoria?.slug === categoriaActiva
  );

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="store-content">
      {/* 🎠 BARRA DE CATEGORÍAS */}
      <div className="categorias-scroll">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`cat-chip ${categoriaActiva === cat.slug ? "active" : ""}`}
            onClick={() => handleCategoriaClick(cat.slug)}
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

      {/* 📦 PRODUCTOS */}
      <div className="productos-grid">
        {productosFiltrados.length === 0 ? (
          <p className="no-products">No hay productos en esta categoría</p>
        ) : (
          productosFiltrados.map((p) => (
            <div className="card" key={p.id}>
              <SafeImage
                src={getStrapiMedia(p.imagen?.url)}
                alt={p.nombre}
                className="product-img"
              />
              <div className="card-body">
                <h3>{p.nombre}</h3>
                <p className="precio">{formatPrice(p.precio)}</p>
                {p.descripcion && <p className="descripcion">{p.descripcion}</p>}
                <p className={`stock ${p.disponible ? "ok" : "no"}`}>
                  {p.disponible ? "Disponible" : "Agotado"}
                </p>
                <AddToCart product={p} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
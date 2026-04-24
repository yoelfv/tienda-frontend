import { useEffect, useState } from "react";
import { getProductos, getCategorias, getStrapiMedia } from "../services/api";
import AddToCart from "./AddToCart";
import SafeImage from "./SafeImage";

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProductos(), getCategorias()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const productosFiltrados =
    categoriaActiva === "todas"
      ? productos
      : productos.filter((p) => {
          if (typeof p.categoria === "object" && p.categoria?.slug) {
            return p.categoria.slug === categoriaActiva;
          }
          return false;
        });

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="store-content">
      {/* 🎠 BARRA HORIZONTAL DESLIZABLE */}
      <div className="categorias-scroll">
        <button
          className={`cat-chip ${categoriaActiva === "todas" ? "active" : ""}`}
          onClick={() => setCategoriaActiva("todas")}
        >
          🏪 Todo
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`cat-chip ${categoriaActiva === cat.slug ? "active" : ""}`}
            onClick={() => setCategoriaActiva(cat.slug)}
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
                {p.descripcion && (
                  <p className="descripcion">{p.descripcion}</p>
                )}
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
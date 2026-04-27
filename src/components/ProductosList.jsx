import { useEffect, useState, useCallback } from "react";
import { getProductos, getCategorias, getStrapiMedia } from "../services/api";
import AddToCart from "./AddToCart";
import SafeImage from "./SafeImage";

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iniciado, setIniciado] = useState(false);

  // Cargar datos
  const cargarDatos = useCallback(() => {
    setLoading(true);
    Promise.all([getProductos(), getCategorias()])
      .then(([prods, cats]) => {
        // Ordenar categorías alfabéticamente A-Z
        const catsOrdenadas = [...cats].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, 'es')
        );

        setProductos(prods);
        setCategorias(catsOrdenadas);

        // Solo en la primera carga: seleccionar la primera categoría
        if (!iniciado && catsOrdenadas.length > 0) {
          setCategoriaActiva(catsOrdenadas[0].slug);
          setIniciado(true);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [iniciado]);

  // Carga inicial
  useEffect(() => {
    cargarDatos();
  }, []); // Solo se ejecuta una vez al montar

  // Recargar al hacer clic en una categoría
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

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cargarDatos]);

  // Si aún no se ha inicializado, no mostrar nada
  if (categoriaActiva === null || loading) {
    return <div className="loading">Cargando...</div>;
  }

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

  return (
    <div className="store-content">
      {/* 🎠 BARRA HORIZONTAL DESLIZABLE */}
      <div className="categorias-scroll">
        {/* Categorías A-Z primero */}
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

        {/* Botón "Todas" al final */}
        <button
          className={`cat-chip ${categoriaActiva === "todas" ? "active" : ""}`}
          onClick={() => handleCategoriaClick("todas")}
        >
          🏪 Todas
        </button>
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
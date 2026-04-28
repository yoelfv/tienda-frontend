import { useState, useEffect, useRef } from "react";
import { getProductos, getCategorias, getStrapiMedia } from "../services/api";
import AddToCart from "./AddToCart";
import SafeImage from "./SafeImage";
import CategoriasBar from "./CategoriasBar";

export default function Store() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null); // 🆕 Cambiado de "todas" a null
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    Promise.all([getProductos(), getCategorias()])
      .then(([prods, cats]) => {
        // 🆕 Ordenar categorías A-Z
        const catsOrdenadas = [...cats].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, 'es')
        );
        
        setProductos(prods);
        setCategorias(catsOrdenadas);
        
        // 🆕 Seleccionar la primera categoría por defecto
        if (catsOrdenadas.length > 0) {
          setCategoriaActiva(catsOrdenadas[0].slug);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Calcular altura del header
    const header = document.querySelector('.header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
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

  if (loading || categoriaActiva === null) {
    return <div className="loading">Cargando tienda...</div>;
  }

  return (
    <>
      {/* 🎠 BARRA DE CATEGORÍAS FIJA */}
      <div
        className="categorias-barra-fija"
        style={{
          position: 'fixed',
          top: `${headerHeight}px`,
          left: 0,
          right: 0,
          zIndex: 99,
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          boxSizing: 'border-box',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <CategoriasBar
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onSelect={setCategoriaActiva}
        />
      </div>

      {/* 📦 PRODUCTOS */}
      <div className="productos-grid" style={{ marginTop: `${headerHeight + 56 + 20}px` }}>
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
    </>
  );
}
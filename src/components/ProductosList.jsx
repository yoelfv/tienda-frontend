import { useEffect, useState } from "react";
import { getProductos, getStrapiMedia } from "../services/api";
import AddToCart from "./AddToCart";
import SafeImage from "./SafeImage";

export default function ProductosList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);

  return (
    <div className="productos-grid">
      {productos.map(p => (
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
      ))}
    </div>
  );
}
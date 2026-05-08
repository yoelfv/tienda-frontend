import { getStrapiMedia } from "../../services/api";
import AddToCart from "../AddToCart";
import SafeImage from "../SafeImage";

export default function ProductGrid({ productos }) {
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(value);

  if (!productos.length) {
    return <p className="no-products">No hay productos en esta categoría</p>;
  }

  return (
    <div className="productos-grid">
      {productos.map((p) => (
        <ProductCard key={p.id} product={p} formatPrice={formatPrice} />
      ))}
    </div>
  );
}

function ProductCard({ product, formatPrice }) {
  return (
    <div className="card">
      <SafeImage
        src={getStrapiMedia(product.imagen?.url)}
        alt={product.nombre}
        className="product-img"
        width={240}
      />

      <div className="card-body">
        <h3>{product.nombre}</h3>
        <p className="precio">{formatPrice(product.precio)}</p>

        {product.descripcion && (
          <p className="descripcion">{product.descripcion}</p>
        )}

        <p className={`stock ${product.disponible ? "ok" : "no"}`}>
          {product.disponible ? "Disponible" : "Agotado"}
        </p>

        <AddToCart product={product} />
      </div>
    </div>
  );
}
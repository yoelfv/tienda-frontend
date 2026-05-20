import { getStrapiMedia } from "@/services/api";

import AddToCart from "@/components/AddToCart";
import SafeImage from "@/components/SafeImage";

import type { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[];
};

type ProductCardProps = {
  product: Product;
  formatPrice: (value: number) => string;
};

export default function ProductGrid({ products }: ProductGridProps) {
  const formatPrice = (value: number): string =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(value);

  if (!products.length) {
    return <p className="no-products">No hay productos en esta categoría</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
      ))}
    </div>
  );
}

function ProductCard({ product, formatPrice }: ProductCardProps) {
  return (
    <div className="card">
      <SafeImage
        src={getStrapiMedia(product.image?.url)}
        alt={product.name}
        className="product-img"
        width={240}
      />

      <div className="card-body">
        <h3>{product.name}</h3>

        <p className="price">{formatPrice(product.price)}</p>

        {product.description && <p className="description">{product.description}</p>}

        <p className={`stock ${product.available ? "ok" : "no"}`}>
          {product.available ? "Disponible" : "Agotado"}
        </p>

        <AddToCart product={product} />
      </div>
    </div>
  );
}

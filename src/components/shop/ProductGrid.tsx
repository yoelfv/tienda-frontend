import { useState } from "react";
import { getStrapiMedia } from "@/services/api";
import ProductGridSkeleton from "./ProductGridSkeleton";

import AddToCart from "@/components/AddToCart";
import SafeImage from "@/components/SafeImage";
import ImageLightbox from "@/components/ImageLightbox";

import type { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[] | null;
};

type ProductCardProps = {
  product: Product;
  formatPrice: (value: number) => string;
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const formatPrice = (value: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  if (products === null) {
    return <ProductGridSkeleton />;
  }

  if (!products.length) {
    return <p className="no-products">No hay productos en esta categoría</p>;
  }

  return (
    <>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            formatPrice={formatPrice}
            onImageClick={(src, alt) => setLightboxImage({ src, alt })}
          />
        ))}
      </div>

      {lightboxImage && (
        <ImageLightbox
          key={`${lightboxImage.src}-${lightboxImage.alt}`}
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}

interface ProductCardWithLightboxProps extends ProductCardProps {
  onImageClick: (src: string, alt: string) => void;
}

function ProductCard({ product, formatPrice, onImageClick }: ProductCardWithLightboxProps) {
  const imageSrc = getStrapiMedia(product.image?.url);

  return (
    <div className="card">
      <button
        type="button"
        className="product-image-button"
        onClick={() => onImageClick(imageSrc, product.name)}
        aria-label={`Ver imagen de ${product.name} en grande`}
      >
        <SafeImage src={imageSrc} alt={product.name} className="product-img" width={240} />
      </button>

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

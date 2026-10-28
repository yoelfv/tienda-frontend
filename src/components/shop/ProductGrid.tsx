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
          key={lightboxImage.src}
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

  // URL optimizada para el lightbox:
  // - w_auto:100:1600 → ancho del dispositivo (2x para Retina), con límite 1600px
  // - c_limit         → no agranda imágenes más allá de su tamaño original
  // - f_auto          → formato óptimo (WebP/AVIF si el navegador lo soporta)
  // - q_auto:good     → calidad alta pero optimizada
  const optimizedImageSrc = imageSrc.includes("/upload/")
    ? imageSrc.replace("/upload/", "/upload/w_auto:100:1600,c_limit,f_auto,q_auto:good/")
    : imageSrc;

  return (
    <div className="card">
      <button
        type="button"
        className="product-image-button"
        onClick={() => onImageClick(optimizedImageSrc, product.name)}
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

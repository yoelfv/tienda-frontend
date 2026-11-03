import { useState } from "react";
import { getStrapiMedia, optimizeCloudinaryLightbox } from "@/utils/strapi-media";
import ProductGridSkeleton from "./ProductGridSkeleton";

import AddToCart from "@/components/AddToCart";
import SafeImage from "@/components/SafeImage";
import ImageLightbox from "@/components/ImageLightbox";
import { formatPrice } from "@/utils/format";

import type { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[] | null;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

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

function ProductCard({ product, onImageClick }: ProductCardWithLightboxProps) {
  const imageSrc = getStrapiMedia(product.image);
  const optimizedImageSrc = optimizeCloudinaryLightbox(imageSrc);

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

        <p className="price">
          {formatPrice(product.price)}
          {product.saleUnit === "weight" && <span className="price-unit"> / lb</span>}
        </p>

        {product.description && <p className="description">{product.description}</p>}

        <p className={`stock ${product.available ? "ok" : "no"}`}>
          {product.available ? "Disponible" : "Agotado"}
        </p>

        <AddToCart product={product} />
      </div>
    </div>
  );
}

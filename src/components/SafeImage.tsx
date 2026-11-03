import { useMemo, useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { optimizeCloudinary } from "@/utils/strapi-media";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  width?: number;
}

export default function SafeImage({
  src,
  alt = "Imagen",
  fallback = "https://res.cloudinary.com/dllyinogi/image/upload/v1777646899/placeholder_u6r8km.png",
  className = "",
  width = 240,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);

  const optimizedSrc = useMemo(() => optimizeCloudinary(imgSrc, width), [imgSrc, width]);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}

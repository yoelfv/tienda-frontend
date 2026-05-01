import { useState } from "react";

export default function SafeImage({
  src,
  alt = "Imagen",
  fallback = "https://res.cloudinary.com/dllyinogi/image/upload/v1777646899/placeholder_u6r8km.png",
  className = "",
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  const handleError = () => {
    // evitar loop infinito
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
      loading="lazy"
    />
  );
}
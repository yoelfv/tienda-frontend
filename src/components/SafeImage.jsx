import { useState, useMemo } from "react";

// 🔧 función de optimización Cloudinary
const optimizeImage = (url, width = 240) => {
  if (!url) return "";

  // evita romper si ya está optimizada
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width}/`);
  }

  return url;
};

export default function SafeImage({
  src,
  alt = "Imagen",
  fallback = "https://res.cloudinary.com/dllyinogi/image/upload/v1777646899/placeholder_u6r8km.png",
  className = "",
  width = 240, // 👈 configurable
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  // 🧠 optimizar solo cuando cambie src
  const optimizedSrc = useMemo(() => {
    return optimizeImage(imgSrc, width);
  }, [imgSrc, width]);

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

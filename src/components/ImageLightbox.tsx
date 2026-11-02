import { useEffect, useRef, useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ZOOM_STEP = 0.5;
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

export default function ImageLightbox({
  src,
  alt = "Imagen",
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Añadir una entrada al historial para capturar el "atrás"
    history.pushState({ lightbox: true }, "");

    // 2. Escuchar el evento "popstate" (atrás)
    const handlePopState = () => {
      // Cuando se pulsa atrás, cerramos el lightbox en lugar de navegar
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    // 3. Limpieza: cuando el lightbox se cierra (por cualquier motivo),
    //    quitar el listener y, si la entrada falsa sigue en el historial,
    //    eliminarla con history.back()
    return () => {
      window.removeEventListener("popstate", handlePopState);

      // Si la entrada actual del historial es la que hemos añadido,
      // la eliminamos con history.back()
      if (history.state?.lightbox) {
        // Marcamos un flag para evitar bucles
        history.back();
      }
    };
  }, [isOpen, onClose]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+") handleZoomIn();
      if (e.key === "-") handleZoomOut();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  function handleZoomIn() {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  }

  function handleZoomOut() {
    setZoom((z) => {
      const next = Math.max(z - ZOOM_STEP, ZOOM_MIN);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }

  function handleReset() {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  // Drag (solo cuando zoom > 1)
  function handleMouseDown(e: React.MouseEvent) {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  if (!isOpen) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <button className="lightbox-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div
          className="lightbox-image-container"
          onMouseDown={handleMouseDown}
          style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className="lightbox-image"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.2s ease",
            }}
            draggable={false}
          />
        </div>

        <div className="lightbox-controls">
          <button
            className="lightbox-btn"
            onClick={handleZoomOut}
            disabled={zoom <= ZOOM_MIN}
            aria-label="Reducir zoom"
          >
            −
          </button>
          <span className="lightbox-zoom-label">{Math.round(zoom * 100)}%</span>
          <button
            className="lightbox-btn"
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_MAX}
            aria-label="Ampliar zoom"
          >
            +
          </button>
          <button
            className="lightbox-btn lightbox-btn-reset"
            onClick={handleReset}
            disabled={zoom === 1 && position.x === 0 && position.y === 0}
            aria-label="Restablecer"
          >
            ⟲
          </button>
        </div>
      </div>
    </div>
  );
}

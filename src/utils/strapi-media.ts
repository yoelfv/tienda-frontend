// src/utils/strapi-media.ts
//
// Utilidades de media y Cloudinary. Solo se importan desde el servidor
// (frontmatter de Astro, `api.ts`, componentes) — no desde el <script>
// isomórfico del Layout, para no cargar esta lógica en el cliente.

import { STRAPI_URL } from "./strapi-core";

// ============================================
// 🖼️ MEDIA
// ============================================

const PLACEHOLDER = "https://placehold.co/400x400?text=Sin+Imagen";

type StrapiMediaObject = {
  url?: unknown;
  data?: {
    attributes?: {
      url?: unknown;
    };
  };
};

function extractUrl(input: unknown): string | null {
  if (!input) return null;
  if (typeof input === "string") return input;
  if (typeof input === "object") {
    const o = input as StrapiMediaObject;
    if (typeof o.url === "string") return o.url;
    if (typeof o.data?.attributes?.url === "string") return o.data.attributes.url;
  }
  return null;
}

/**
 * Convierte una URL de Strapi (relativa o absoluta) en URL usable.
 * Acepta también objetos tipo `{ url }` o `{ data: { attributes: { url } } }`
 * (formatos habituales de Strapi v4).
 *
 * Si no hay URL, devuelve un placeholder remoto.
 * Si necesitas distinguir "no hay URL" de "hay URL", usa `getStrapiMediaOrNull`.
 */
export function getStrapiMedia(input: unknown): string {
  return getStrapiMediaOrNull(input) ?? PLACEHOLDER;
}

/**
 * Igual que `getStrapiMedia`, pero devuelve `null` cuando no hay URL.
 * Útil cuando el componente quiere decidir qué renderizar (emoji, icono, etc.)
 * en lugar de cargar un placeholder remoto.
 */
export function getStrapiMediaOrNull(input: unknown): string | null {
  const url = extractUrl(input);
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (!STRAPI_URL) return null;
  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// ============================================
// ⚡ CLOUDINARY OPTIMIZE
// ============================================

/**
 * Si la URL es de Cloudinary (contiene `/upload/`), inyecta transformaciones
 * para servir la imagen en el formato y tamaño adecuados.
 * Si no lo es, devuelve la URL tal cual.
 */
export function optimizeCloudinary(
  url: string,
  width = 240,
  quality: "auto" | "auto:eco" | "auto:good" = "auto:eco"
): string {
  if (!url) return "";
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_${quality},w_${width},c_fill/`);
  }
  return url;
}

/**
 * Optimización específica para el lightbox de imágenes (pantalla completa).
 *
 * Diferencias con `optimizeCloudinary`:
 * - `w_auto:100:1600` → ancho del dispositivo (2x para Retina), con límite 1600px.
 * - `c_limit`         → no agranda imágenes más allá de su tamaño original.
 * - `q_auto:good`     → calidad alta pero optimizada.
 *
 * Pensada para imágenes que se ven grandes y se inspeccionan de cerca.
 */
export function optimizeCloudinaryLightbox(url: string): string {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/w_auto:100:1600,c_limit,f_auto,q_auto:good/");
}

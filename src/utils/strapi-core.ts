// src/utils/strapi-core.ts
//
// Núcleo compartido cliente + servidor.
// Solo contiene lógica pura: URL base y parser de rich text.
// NO importa nada de media/Cloudinary, para que el bundle cliente
// no arrastre código que solo se usa en build/SSR.
//
// ⚠️ Solo se lee PUBLIC_STRAPI_URL. No hay fallback a otras variables
//    ni a URLs hardcodeadas.

// ============================================
// 🔧 CONFIG BASE
// ============================================

const RAW_URL = (import.meta.env.PUBLIC_STRAPI_URL as string | undefined)?.trim() || "";

export const STRAPI_URL = RAW_URL.replace(/\/$/, ""); // sin barra final
export const API_URL = STRAPI_URL ? `${STRAPI_URL}/api` : "";

export function getApiUrl(): string {
  if (!API_URL) {
    throw new Error("PUBLIC_STRAPI_URL no está definida");
  }
  return API_URL;
}

// ============================================
// 🧠 RICH TEXT PARSER
// ============================================

export type RichTextChild = { text?: string };
export type RichTextBlock = { children?: RichTextChild[] };

/**
 * Convierte los bloques de rich text de Strapi (formato JSON de
 * `@strapi/blocks-react-renderer`) en un string plano.
 *
 * Cada bloque se une con `\n`; los hijos de un bloque se concatenan sin
 * separador (respetando cómo Strapi representa el texto inline).
 */
export function parseRichText(blocks: RichTextBlock[] | null | undefined): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => block.children?.map((child) => child.text ?? "").join("") || "")
    .join("\n");
}

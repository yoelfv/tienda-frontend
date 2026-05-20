import type { Product } from "../types/product";
import type {
  StrapiProduct,
  StrapiCategory,
  StrapiDescriptionBlock,
  StrapiDescriptionChild,
  StrapiConfig,
} from "../types/strapi";

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL?.trim() || "";
const API_URL = STRAPI_URL ? `${STRAPI_URL}/api` : "";

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error("PUBLIC_STRAPI_URL no está definida");
  }
  return API_URL;
}

export function getStrapiMedia(
  url: string | null | undefined,
): string {
  if (!url) {
    return "https://placehold.co/400x400?text=Sin+Imagen";
  }

  if (url.startsWith("http")) {
    return url;
  }

  if (!STRAPI_URL) {
    return "https://placehold.co/400x400?text=Sin+Imagen";
  }

  return `${STRAPI_URL}${url}`;
}

// ============================================
// 🧠 HELPERS (clean parsing layer)
// ============================================

function parseRichText(
  blocks: StrapiDescriptionBlock[] | null | undefined,
): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) =>
      block.children
        ?.map((child: StrapiDescriptionChild) => child.text)
        .join("") || "",
    )
    .join("\n");
}

function normalizeProduct(product: StrapiProduct): Product {
  return {
    id: product.id,
    name: product.nombre,
    price: product.precio,
    available: product.disponible,
    description: parseRichText(product.descripcion),
    image: product.imagen?.url
      ? { url: product.imagen.url }
      : null,
    category: product.categoria
      ? {
          id: product.categoria.id,
          name: product.categoria.nombre,
          slug: product.categoria.slug,
          image: null,
        }
      : null,
  };
}

// ============================================
// 📦 PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${getApiUrl()}/products?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error API products:", res.status, errorText);
    throw new Error(`Error ${res.status}: failed to fetch products`);
  }

  const data = await res.json();

  const products: StrapiProduct[] = data.data || [];

  return products.map(normalizeProduct);
}

// ============================================
// ⚙️ CONFIG
// ============================================

export async function getConfig(): Promise<StrapiConfig> {
  const res = await fetch(`${getApiUrl()}/configuracion`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error API config:", res.status, errorText);
    throw new Error(`Error ${res.status}: failed to fetch config`);
  }

  const data = await res.json();

  return data.data || {};
}

// ============================================
// 🗂️ CATEGORIES
// ============================================

function normalizeCategory(cat: StrapiCategory) {
  const name = cat.nombre ?? "Sin nombre";

  const slug =
    cat.slug ??
    name.toLowerCase().replace(/\s+/g, "-");

  const imageUrl = cat.imagen?.url ?? null;

  return {
    id: cat.id,
    name,
    slug,
    image: imageUrl ? { url: imageUrl } : null,
  };
}

export async function getCategories() {
  const res = await fetch(`${getApiUrl()}/categorias?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error API categories:", res.status, errorText);
    throw new Error(`Error ${res.status}: failed to fetch categories`);
  }

  const response = await res.json();

  const categories: StrapiCategory[] = response.data || [];

  return categories
    .map(normalizeCategory)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}
import type { Product, ProductPage } from "@/types/product";
import type {
  StrapiProduct,
  StrapiCategory,
  StrapiDescriptionBlock,
  StrapiDescriptionChild,
  StrapiConfig,
} from "@/types/strapi";

import type { Category } from "@/types/category";

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL?.trim() || "";
const API_URL = STRAPI_URL ? `${STRAPI_URL}/api` : "";

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error("PUBLIC_STRAPI_URL no está definida");
  }
  return API_URL;
}

// ============================================
// 🧠 MEDIA HELPER
// ============================================

export function getStrapiMedia(url: string | null | undefined): string {
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
// 🧠 PARSER
// ============================================

function parseRichText(blocks: StrapiDescriptionBlock[] | null | undefined): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map(
      (block) => block.children?.map((child: StrapiDescriptionChild) => child.text).join("") || ""
    )
    .join("\n");
}

// ============================================
// 📦 PRODUCT NORMALIZER
// ============================================

function normalizeProduct(product: StrapiProduct): Product {
  const parsedPrice = Number(product.precio);

  return {
    id: product.id,
    name: product.nombre?.trim() || "Producto sin nombre",
    price: Number.isNaN(parsedPrice) ? 0 : parsedPrice,
    available: product.disponible ?? false,
    saleUnit: product.saleUnit ?? "unit",
    description: parseRichText(product.descripcion),
    image: product.imagen?.url ? { url: product.imagen.url } : null,
    category: product.categoria
      ? {
          id: product.categoria.id,
          name: product.categoria.nombre?.trim() || "Sin categoría",
          slug: product.categoria.slug || "sin-categoria",
          image: product.categoria.imagen?.url ? { url: product.categoria.imagen.url } : null,
        }
      : null,
  };
}

// ============================================
// 📦 PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const allProducts: StrapiProduct[] = [];
  let page = 1;
  let pageCount = 1;
  const pageSize = 100;

  while (page <= pageCount) {
    const url = `${getApiUrl()}/products?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=nombre:asc&populate=*`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error API products:", res.status, errorText);
      throw new Error(`Error ${res.status}: failed to fetch products`);
    }

    const data = await res.json();
    const products: StrapiProduct[] = data.data || [];

    allProducts.push(...products);

    // Leer meta.pagination.pageCount
    const meta = data.meta;
    if (meta?.pagination?.pageCount) {
      pageCount = meta.pagination.pageCount;
    } else {
      pageCount = 1;
    }

    page += 1;
  }

  return allProducts.map(normalizeProduct);
}

export async function getProductsByCategory(
  slug: string,
  page = 1,
  pageSize = 10
): Promise<ProductPage> {
  const url =
    `${getApiUrl()}/products` +
    `?filters[categoria][slug][$eq]=${slug}` +
    `&sort=nombre:asc` +
    `&pagination[page]=${page}` +
    `&pagination[pageSize]=${pageSize}` +
    `&populate=*`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error API products:", res.status, errorText);
    throw new Error(`Error ${res.status}: failed to fetch products`);
  }

  const data = await res.json();

  const products: StrapiProduct[] = data.data || [];

  const pagination = data.meta.pagination;

  return {
    products: products.map(normalizeProduct),
    page: pagination.page,
    hasMore: pagination.page < pagination.pageCount,
  };
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

function normalizeCategory(cat: StrapiCategory): Category {
  const name = cat.nombre ?? "Sin nombre";

  const slug = cat.slug ?? name.toLowerCase().replace(/\s+/g, "-");

  return {
    id: cat.id,
    name,
    slug,
    image: cat.imagen?.url ? { url: cat.imagen.url } : null,
  };
}

export async function getCategories(): Promise<Category[]> {
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

  return categories.map(normalizeCategory).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

import type { Product, ProductPage } from "@/types/product";
import type { StrapiProduct, StrapiCategory, StrapiConfig } from "@/types/strapi";
import type { Category } from "@/types/category";

import { getApiUrl, parseRichText } from "@/utils/strapi-core";

// ============================================
// 🔧 PAGINATION CONFIG
// ============================================

const PAGE_SIZE = 100;
const MAX_PAGES = 200;
const REQUEST_TIMEOUT_MS = 15_000;

// ============================================
// 🔌 FETCH HELPER
// ============================================

/**
 * Hace un fetch a la API de Strapi con timeout y validación de `res.ok`.
 * No valida la forma de la respuesta: eso lo hace el callback `validate`,
 * que recibe el JSON ya parseado (como `unknown`) y devuelve `T` o lanza.
 *
 * `context` se usa solo para los logs de error, para poder distinguir
 * qué llamada falló cuando hay varias en vuelo.
 */
async function strapiFetch<T>(
  path: string,
  validate: (json: unknown) => T,
  context: string
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let data: unknown;
  try {
    const res = await fetch(`${getApiUrl()}${path}`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[${context}] Error API (status ${res.status}):`, errorText);
      throw new Error(`Error ${res.status}: failed to fetch ${context}`);
    }

    data = await res.json();
  } finally {
    clearTimeout(timeoutId);
  }

  return validate(data);
}

/**
 * Valida que la respuesta tenga forma `{ data: ... }` y devuelve `data`.
 * Lanza con log contextual si no la tiene.
 */
function expectDataField(json: unknown, context: string): unknown {
  const data = (json as { data?: unknown })?.data;
  if (data === undefined || data === null) {
    console.error(`[${context}] Respuesta sin campo 'data':`, {
      jsonType: typeof json,
      jsonKeys: json && typeof json === "object" ? Object.keys(json) : null,
    });
    throw new Error(`Respuesta inesperada de ${context}: falta 'data'`);
  }
  return data;
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

  while (true) {
    if (page > MAX_PAGES) {
      console.warn(
        `[getProducts] Se alcanzó MAX_PAGES=${MAX_PAGES}. ` +
          `Se devuelven ${allProducts.length} productos (posible truncamiento).`
      );
      break;
    }

    const path =
      `/products` +
      `?pagination[page]=${page}` +
      `&pagination[pageSize]=${PAGE_SIZE}` +
      `&sort=nombre:asc` +
      `&populate=*`;

    const products = await strapiFetch(
      path,
      (json) => {
        const data = expectDataField(json, `products (page ${page})`);
        if (!Array.isArray(data)) {
          console.error(`[getProducts] 'data' no es array en página ${page}:`, {
            dataType: typeof data,
          });
          throw new Error(`Respuesta inesperada de /products en página ${page}`);
        }
        return data as StrapiProduct[];
      },
      `products (page ${page})`
    );

    allProducts.push(...products);

    if (products.length < PAGE_SIZE) break;
    page += 1;
  }

  return allProducts.map(normalizeProduct);
}

export async function getProductsByCategory(
  slug: string,
  page = 1,
  pageSize = 10
): Promise<ProductPage> {
  const path =
    `/products` +
    `?filters[categoria][slug][$eq]=${slug}` +
    `&sort=nombre:asc` +
    `&pagination[page]=${page}` +
    `&pagination[pageSize]=${pageSize}` +
    `&populate=*`;

  const json = await strapiFetch(path, (raw) => raw, `products (category=${slug}, page=${page})`);

  const products = expectDataField(json, `products (category=${slug}, page=${page})`);

  if (!Array.isArray(products)) {
    console.error("[getProductsByCategory] 'data' no es array:", {
      slug,
      page,
      dataType: typeof products,
    });
    throw new Error(`Respuesta inesperada de /products (category=${slug}, page=${page})`);
  }

  const pagination = (
    json as {
      meta?: { pagination?: { page?: number; pageCount?: number } };
    }
  )?.meta?.pagination;

  const currentPage = pagination?.page ?? page;
  const pageCount = pagination?.pageCount ?? currentPage;

  return {
    products: (products as StrapiProduct[]).map(normalizeProduct),
    page: currentPage,
    hasMore: currentPage < pageCount,
  };
}

// ============================================
// ⚙️ CONFIG
// ============================================

export async function getConfig(): Promise<StrapiConfig> {
  return strapiFetch(
    `/configuracion`,
    (json) => {
      const config = expectDataField(json, "configuracion");
      if (typeof config !== "object" || Array.isArray(config)) {
        console.error("[getConfig] 'data' no es objeto:", {
          dataType: typeof config,
        });
        throw new Error("Respuesta inesperada de /configuracion");
      }
      return config as StrapiConfig;
    },
    "configuracion"
  );
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
  const categories = await strapiFetch(
    `/categorias?populate=*`,
    (json) => {
      const data = expectDataField(json, "categorias");
      if (!Array.isArray(data)) {
        console.error("[getCategories] 'data' no es array:", {
          dataType: typeof data,
        });
        throw new Error("Respuesta inesperada de /categorias");
      }
      return data as StrapiCategory[];
    },
    "categorias"
  );

  return categories.map(normalizeCategory).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

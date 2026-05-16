const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL?.trim() || "";
const API_URL = STRAPI_URL ? `${STRAPI_URL}/api` : "";

function getApiUrl() {
  if (!API_URL) {
    throw new Error("PUBLIC_STRAPI_URL no está definida");
  }
  return API_URL;
}

export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return "https://placehold.co/400x400?text=Sin+Imagen";
  if (url.startsWith("http")) return url;
  if (!STRAPI_URL) return "https://placehold.co/400x400?text=Sin+Imagen";
  return `${STRAPI_URL}${url}`;
}

// ============================================
// 📦 INTERFACES
// ============================================

export interface ProductImage {
  url: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  available: boolean;
  description: string;
  image: ProductImage | null;
  category: any | null;
}

export interface CategoryImage {
  url: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: CategoryImage | null;
}

export interface Config {
  id?: number;
  whatsapp_phone?: string;
  telefono_whatsapp?: string;
  base_message?: string;
  mensaje_base?: string;
  [key: string]: any;
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

  return (data.data || []).map((product: any) => {
    let descriptionText = "";

    if (product.descripcion && Array.isArray(product.descripcion)) {
      descriptionText = product.descripcion
        .map((block: any) => block.children?.map((child: any) => child.text).join(""))
        .join("\n");
    }

    return {
      id: product.id,
      name: product.nombre,
      price: product.precio,
      available: product.disponible,
      description: descriptionText,
      image: product.imagen?.url ? { url: product.imagen.url } : null,
      category: product.categoria || null,
    };
  });
}

// ============================================
// ⚙️ CONFIG
// ============================================

export async function getConfig(): Promise<Config> {
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
  const categoriesData = response.data || [];

  return categoriesData
    .map((cat: any) => {
      const name = cat.nombre || cat.attributes?.nombre || "Sin nombre";

      const slug = cat.slug || cat.attributes?.slug || name.toLowerCase().replace(/\s+/g, "-");

      let imageUrl = null;

      if (cat.imagen?.url) {
        imageUrl = cat.imagen.url;
      } else if (cat.imagen?.data?.attributes?.url) {
        imageUrl = cat.imagen.data.attributes.url;
      } else if (cat.attributes?.imagen?.data?.attributes?.url) {
        imageUrl = cat.attributes.imagen.data.attributes.url;
      }

      return {
        id: cat.id,
        name,
        slug,
        image: imageUrl ? { url: imageUrl } : null,
      };
    })
    .sort((a: Category, b: Category) => a.name.localeCompare(b.name, "es"));
}

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

// 📦 PRODUCTOS
export async function getProductos() {
  const res = await fetch(`${getApiUrl()}/products?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error API products:", res.status, errorText);
    throw new Error(`Error ${res.status}: fallo al obtener productos`);
  }

  const data = await res.json();

  return (data.data || []).map((producto: any) => {
    let descripcionTexto = "";

    if (producto.descripcion && Array.isArray(producto.descripcion)) {
      descripcionTexto = producto.descripcion
        .map((block: any) =>
          block.children?.map((child: any) => child.text).join("")
        )
        .join("\n");
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      disponible: producto.disponible,
      descripcion: descripcionTexto,
      imagen: producto.imagen?.url ? { url: producto.imagen.url } : null,
      categoria: producto.categoria || null,
    };
  });
}

// ⚙️ CONFIG
export async function getConfiguracion() {
  const res = await fetch(`${getApiUrl()}/configuracion`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error API configuración:", res.status, errorText);
    throw new Error(`Error ${res.status}: fallo al obtener configuración`);
  }

  const data = await res.json();
  return data.data || {};
}

// 🗂️ CATEGORÍAS
export async function getCategorias() {
  const res = await fetch(`${getApiUrl()}/categorias?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error API categorías:", res.status, errorText);
    throw new Error(`Error ${res.status}: fallo al obtener categorías`);
  }

  const response = await res.json();
  const categoriasData = response.data || [];

  return categoriasData
    .map((cat: any) => {
      const nombre =
        cat.nombre || cat.attributes?.nombre || "Sin nombre";

      const slug =
        cat.slug ||
        cat.attributes?.slug ||
        nombre.toLowerCase().replace(/\s+/g, "-");

      let imagenUrl = null;

      if (cat.imagen?.url) {
        imagenUrl = cat.imagen.url;
      } else if (cat.imagen?.data?.attributes?.url) {
        imagenUrl = cat.imagen.data.attributes.url;
      } else if (cat.attributes?.imagen?.data?.attributes?.url) {
        imagenUrl = cat.attributes.imagen.data.attributes.url;
      }

      return {
        id: cat.id,
        nombre,
        slug,
        imagen: imagenUrl ? { url: imagenUrl } : null,
      };
    })
    .sort((a: any, b: any) =>
      a.nombre.localeCompare(b.nombre, "es")
    );
}
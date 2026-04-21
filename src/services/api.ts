//const API_URL = "http://localhost:1337/api";
const API_URL = import.meta.env.STRAPI_URL 
  ? `${import.meta.env.STRAPI_URL}/api`
  : "http://localhost:1337/api";

export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) {
    console.warn("URL de imagen no válida:", url);
    return "https://placehold.co/400x400?text=Sin+Imagen"; // Placeholder
  }
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.STRAPI_URL || "http://localhost:1337";
  return `${baseUrl}${url}`;
}

export async function crearPedido(pedido) {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: pedido
    })
  });

  if (!res.ok) {
    throw new Error("Error al guardar pedido");
  }

  return await res.json();
}

export async function getProductos() {
  try {
    const res = await fetch(`${API_URL}/products?populate=*`);

    if (!res.ok) {
      throw new Error("Error en la API");
    }

    const data = await res.json();

    return (data.data || []).map(producto => ({
      ...producto,
      imagen: producto.imagen?.url 
        ? { url: producto.imagen.url }
        : null,

    }));
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

export async function getPedidos() {
  const res = await fetch(`${API_URL}/pedidos?sort=createdAt:desc`);

  if (!res.ok) {
    throw new Error("Error cargando pedidos");
  }

  const data = await res.json();
  return data.data || [];
}

export async function getConfiguracion() {
  const res = await fetch(`${API_URL}/configuracion`);

  if (!res.ok) {
    throw new Error("Error al obtener configuración");
  }

  const data = await res.json();

  return data.data;
}
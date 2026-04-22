// 🔥 Base centralizada
const BASE_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
const API_URL = `${BASE_URL}/api`;

// 🖼️ Imágenes
export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) {
    return "https://placehold.co/400x400?text=Sin+Imagen";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${BASE_URL}${url}`;
}

// 🧾 Crear pedido
export async function crearPedido(pedido: any) {
  try {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: pedido })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error backend:", errorText);
      throw new Error(`Error ${res.status}: No se pudo guardar el pedido`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error en crearPedido:", error);
    throw error;
  }
}

// 📦 Productos
export async function getProductos() {
  try {
    const res = await fetch(`${API_URL}/products?populate=*`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: fallo al obtener productos`);
    }

    const data = await res.json();

    return (data.data || []).map((producto: any) => ({
      ...producto,
      imagen: producto.imagen?.url
        ? { url: producto.imagen.url }
        : null
    }));

  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

// 📋 Pedidos
export async function getPedidos() {
  try {
    const res = await fetch(`${API_URL}/pedidos?sort=createdAt:desc`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: fallo al obtener pedidos`);
    }

    const data = await res.json();
    return data.data || [];

  } catch (error) {
    console.error("Error cargando pedidos:", error);
    return [];
  }
}

// ⚙️ Configuración
export async function getConfiguracion() {
  try {
    const res = await fetch(`${API_URL}/configuracion`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: fallo al obtener configuración`);
    }

    const data = await res.json();

    return data.data || {};

  } catch (error) {
    console.error("Error cargando configuración:", error);
    return {};
  }
}
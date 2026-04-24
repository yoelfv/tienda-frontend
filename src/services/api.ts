const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

if (!STRAPI_URL) {
  throw new Error("PUBLIC_STRAPI_URL no está definida");
}

const API_URL = `${STRAPI_URL}/api`;

export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) {
    return "https://placehold.co/400x400?text=Sin+Imagen";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}

export async function crearPedido(pedido: any) {
  try {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: pedido }),
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

export async function getProductos() {
  try {
    const res = await fetch(`${API_URL}/products?populate=*`, {
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
      };
    });
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

export async function getPedidos() {
  try {
    const res = await fetch(`${API_URL}/pedidos?sort=createdAt:desc`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error API pedidos:", res.status, errorText);
      throw new Error(`Error ${res.status}: fallo al obtener pedidos`);
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error cargando pedidos:", error);
    return [];
  }
}

export async function getConfiguracion() {
  try {
    const res = await fetch(`${API_URL}/configuracion`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error API configuración:", res.status, errorText);
      throw new Error(`Error ${res.status}: fallo al obtener configuración`);
    }

    const data = await res.json();
    return data.data || {};
  } catch (error) {
    console.error("Error cargando configuración:", error);
    return {};
  }
}
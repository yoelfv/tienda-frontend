export interface StrapiImage {
  url: string;
}

/**
 * Rich text de Strapi (estructura mínima segura)
 */
export interface StrapiDescriptionChild {
  text: string;
}

export interface StrapiDescriptionBlock {
  children?: StrapiDescriptionChild[];
}

/**
 * 🧠 Producto crudo de Strapi (API layer)
 */
export interface StrapiProduct {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
  descripcion?: StrapiDescriptionBlock[] | null;

  imagen: {
    url: string;
  } | null;

  categoria: StrapiCategory | null;
}

/**
 * 🗂️ Categoría Strapi
 */
export interface StrapiCategory {
  id: number;
  nombre: string;
  slug: string;

  imagen?: {
    url: string;
  } | null;
}

/**
 * ⚙️ Configuración Strapi
 */
export interface StrapiConfig {
  id?: number;
  whatsapp_phone?: string;
  telefono_whatsapp?: string;
  base_message?: string;
  mensaje_base?: string;
}

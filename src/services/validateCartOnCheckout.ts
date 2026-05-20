import { getProducts } from "./api";
import type { Product, ProductImage } from "../types/product";

export interface CartItem {
  id: number;
  name?: string;
  nombre?: string;
  price: number;
  quantity: number;
  image?: ProductImage | null;
}

export interface MissingProduct {
  id: number;
  name: string;
}

export interface ValidationResult {
  isValid: boolean;
  missingProducts: MissingProduct[];
}

export async function validateCartOnCheckout(cart: CartItem[]): Promise<ValidationResult> {
  if (!cart || cart.length === 0) {
    return { isValid: true, missingProducts: [] };
  }

  try {
    const currentProducts: Product[] = await getProducts();
    const existingIds = new Set(currentProducts.map((p) => p.id));

    const missingProducts: MissingProduct[] = cart
      .filter((item) => !existingIds.has(item.id))
      .map((item) => ({
        id: item.id,
        name: item.name || item.nombre || "Producto sin nombre",
      }));

    return {
      isValid: missingProducts.length === 0,
      missingProducts,
    };
  } catch (error) {
    console.error("Error validating cart:", error);
    return { isValid: true, missingProducts: [] };
  }
}

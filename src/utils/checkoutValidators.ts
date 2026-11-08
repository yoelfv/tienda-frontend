import type { CartItem } from "@/types/product";
import type { CheckoutFormData } from "@/types/checkout";

/**
 * Valida que un teléfono sea "razonablemente" válido.
 * - Permite: +, dígitos, espacios, guiones, paréntesis.
 * - Requiere: entre 6 y 15 dígitos reales (ignorando los símbolos).
 */
export function validatePhone(phone: string): boolean {
  if (!phone.trim()) return false;

  // 1. Contar solo los dígitos
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6 || digits.length > 15) return false;

  // 2. Verificar que no haya caracteres extraños (solo permite +, números, espacios, (), -)
  const validCharactersRegex = /^\+?[\d\s\-()]+$/;
  if (!validCharactersRegex.test(phone)) return false;

  return true;
}

export function validateCheckout(formData: CheckoutFormData, cart: CartItem[]): string | null {
  if (cart.length === 0) {
    return "Tu carrito está vacío";
  }

  if (
    !formData.senderName?.trim() ||
    !formData.senderPhone?.trim() ||
    !formData.recipientName?.trim() ||
    !formData.recipientPhone?.trim() ||
    !formData.address?.trim()
  ) {
    return "Por favor completa todos los campos obligatorios";
  }

  if (!validatePhone(formData.senderPhone)) {
    return "El teléfono de quien envía debe tener entre 6 y 15 dígitos.";
  }

  if (!validatePhone(formData.recipientPhone)) {
    return "El teléfono de quien recibe debe tener entre 6 y 15 dígitos.";
  }

  return null;
}

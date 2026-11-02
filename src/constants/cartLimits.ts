/**
 * Límites de cantidad por producto en el carrito.
 *
 * - Productos por unidad: máximo 20 unidades.
 * - Productos por peso: máximo 50 libras.
 *
 * Estos límites se usan tanto en `AddToCart` (grid) como en `cart.ts`
 * (controles del carrito), para que ambos sean consistentes.
 */

export const CART_LIMITS = {
  unit: {
    min: 1,
    max: 20,
    label: "unidades",
  },
  weight: {
    min: 0.5,
    max: 50,
    label: "libras",
  },
} as const;

export type SaleUnit = keyof typeof CART_LIMITS;

export function getCartLimit(saleUnit: SaleUnit) {
  return CART_LIMITS[saleUnit];
}

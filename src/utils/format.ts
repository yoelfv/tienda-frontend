/**
 * Formateo de números y precios.
 *
 * Toda la tienda usa formato `en-US` (punto decimal, coma de miles).
 * Si en el futuro hay que cambiar el formato, se hace aquí.
 */

/**
 * Formatea un número con 2 decimales fijos.
 * Ejemplo: `1234.56` → `"1,234.56"`
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formatea un número como precio en USD (con símbolo `$`).
 * Ejemplo: `1234.56` → `"$1,234.56"`
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

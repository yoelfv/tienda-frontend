import type { CartItem } from "@/types/product";
import type { CheckoutFormData } from "@/types/checkout";
import type { Config } from "@/types/config";

const formatPrice = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export function buildWhatsAppMessage(
  formData: CheckoutFormData,
  cart: CartItem[],
  total: number,
  config: Config
): string {
  const baseMessage = config?.base_message || config?.mensaje_base || "Nuevo pedido:";

  let message = `${baseMessage}\n\n`;

  message += `👤 DATOS DE QUIEN ENVÍA:\n`;
  message += `📛 Nombre: ${formData.senderName}\n`;
  message += `📞 Teléfono: ${formData.senderPhone}\n\n`;

  message += `📦 DATOS DE ENTREGA:\n`;
  message += `📛 Nombre: ${formData.recipientName}\n`;
  message += `📞 Teléfono: ${formData.recipientPhone}\n`;
  message += `📍 Dirección: ${formData.address}\n\n`;

  message += `🛒 PRODUCTOS:\n`;

  cart.forEach((item) => {
    message += `• ${item.name} x${item.quantity} = $${formatPrice(item.price * item.quantity)}\n`;
  });

  message += `💵 Total: $${formatPrice(total)}\n\n`;

  const note = formData.note?.trim();

  if (note) {
    message += `📝 Nota: ${note}\n`;
  }

  return encodeURIComponent(message);
}

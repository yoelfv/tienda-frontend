export const buildWhatsAppMessage = (formData, cart, total, config) => {
  const baseMessage = config?.mensaje_base || "Nuevo pedido:";

  let message = `${baseMessage}\n\n`;

  message += `👤 DATOS DE QUIEN ENVÍA:\n`;
  message += `📛 Nombre: ${formData.nombre_envia}\n`;
  message += `📞 Teléfono: ${formData.telefono_envia}\n\n`;

  message += `📦 DATOS DE ENTREGA:\n`;
  message += `📛 Nombre: ${formData.nombre_recibe}\n`;
  message += `📞 Teléfono: ${formData.telefono_recibe}\n`;
  message += `📍 Dirección: ${formData.direccion}\n\n`;

  message += `🛒 PRODUCTOS:\n`;
  cart.forEach(p => {
    message += `• ${p.nombre} x${p.quantity} = $${p.precio * p.quantity}\n`;
  });

  message += `💵 Total: $${total}\n\n`;

  const nota = formData.nota?.trim();

  if (nota) {
    message += `📝 Nota: ${nota}\n`;
  }

  return encodeURIComponent(message);
};
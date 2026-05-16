export const validatePhone = (phone) => {
  const cleaned = phone.replace(/[\s-]/g, "");

  const phoneRegex = /^(\+?\d{1,3})?[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;

  return phoneRegex.test(cleaned) && cleaned.length >= 8;
};

export const validateCheckout = (formData, cart) => {
  if (cart.length === 0) {
    return "Tu carrito está vacío";
  }

  if (
    !formData.senderName ||
    !formData.senderPhone ||
    !formData.recipientName ||
    !formData.recipientPhone ||
    !formData.address
  ) {
    return "Por favor completa todos los campos obligatorios";
  }

  if (!validatePhone(formData.senderPhone)) {
    return "El número de teléfono de quien envía no es válido";
  }

  if (!validatePhone(formData.recipientPhone)) {
    return "El número de teléfono de quien recibe no es válido";
  }

  return null;
};

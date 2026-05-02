// src/utils/checkoutValidators.js

export const validatePhone = (phone) => {
  const limpio = phone.replace(/[\s\-]/g, "");

  const regexTelefono = /^(\+?\d{1,3})?[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;

  return regexTelefono.test(limpio) && limpio.length >= 8;
};

export const validateCheckout = (formData, cart) => {
  if (cart.length === 0) {
    return "Tu carrito está vacío";
  }

  if (
    !formData.nombre_envia ||
    !formData.telefono_envia ||
    !formData.nombre_recibe ||
    !formData.telefono_recibe ||
    !formData.direccion
  ) {
    return "Por favor completa todos los campos obligatorios";
  }

  if (!validatePhone(formData.telefono_envia)) {
    return "El número de teléfono de quien envía no es válido";
  }

  if (!validatePhone(formData.telefono_recibe)) {
    return "El número de teléfono de quien recibe no es válido";
  }

  return null;
};
import { useState } from "react";
import type { ChangeEvent } from "react";

import { getCart, clearCart, saveCart } from "@/store/cart";
import { getConfig } from "@/services/api";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

import { validateCheckout } from "@/utils/checkoutValidators";
import { buildWhatsAppMessage } from "@/utils/buildWhatsAppMessage";
import { validateCartOnCheckout } from "@/services/validateCartOnCheckout";

import OrderSummary from "./checkout/OrderSummary";
import SenderForm from "./checkout/SenderForm";
import DeliveryForm from "./checkout/DeliveryForm";

type PhoneErrors = {
  senderPhone: string;
  recipientPhone: string;
};

export default function CheckoutForm() {
  const cart = getCart();
  const { formData, updateField } = useCheckoutForm();

  const [errors, setErrors] = useState<PhoneErrors>({
    senderPhone: "",
    recipientPhone: "",
  });

  // Nuevo estado para errores globales (en lugar de alert)
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(e);

    // Limpiar el error global cuando el usuario vuelve a escribir
    if (globalError) setGlobalError("");

    // Validación en vivo solo para los teléfonos
    if (name === "senderPhone" || name === "recipientPhone") {
      // Si el campo está vacío, borramos el error (el usuario está empezando a escribir o borró)
      if (value.trim() === "") {
        setErrors((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      // Solo mostramos error si ya hay demasiados dígitos (más de 15)
      // para evitar que el usuario siga escribiendo sin límite.
      const digits = value.replace(/\D/g, "");
      if (digits.length > 15) {
        setErrors((prev) => ({
          ...prev,
          [name]: "El número es demasiado largo (máximo 15 dígitos).",
        }));
      } else {
        // Si está dentro del límite, no mostramos error mientras escribe
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const submitOrder = async () => {
    if (isLoading) return;
    setGlobalError("");

    // 1. Validar campos requeridos y formato de teléfono
    const errorMsg = validateCheckout(formData, cart);
    if (errorMsg) {
      setGlobalError(errorMsg);
      return;
    }

    // 2. Validar carrito contra el backend
    const { isValid, missingProducts } = await validateCartOnCheckout(cart);

    if (!isValid) {
      const productNames = missingProducts.map((p) => `• ${p.name}`).join("\n");
      const userConfirmed = window.confirm(
        `⚠️ Los siguientes productos ya no están disponibles:\n\n${productNames}\n\n¿Deseas continuar sin estos productos?`
      );

      if (userConfirmed) {
        const validCart = cart.filter((item) => !missingProducts.some((mp) => mp.id === item.id));
        saveCart(validCart);
        window.location.reload();
      }
      return;
    }

    setIsLoading(true);

    try {
      const config = await getConfig();
      const targetPhone = config?.whatsapp_phone || config?.telefono_whatsapp || "0000000000";
      const message = buildWhatsAppMessage(formData, cart, total, config);
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${message}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      clearCart();
      window.location.href = "/order-success";
    } catch (error) {
      console.error(error);
      setGlobalError("Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <button className="btn-back" onClick={() => (window.location.href = "/")}>
        ← Volver a la tienda
      </button>

      <OrderSummary cart={cart} total={total} />

      <SenderForm formData={formData} handleChange={handleChange} errorPhone={errors.senderPhone} />

      <DeliveryForm
        formData={formData}
        handleChange={handleChange}
        errorPhone={errors.recipientPhone}
      />

      {/* Mostrar error global si existe */}
      {globalError && (
        <div
          style={{
            color: "#dc2626",
            backgroundColor: "#fef2f2",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #fecaca",
          }}
        >
          {globalError}
        </div>
      )}

      <button className="btn-primary" onClick={submitOrder} disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar pedido por WhatsApp"}
      </button>
    </div>
  );
}

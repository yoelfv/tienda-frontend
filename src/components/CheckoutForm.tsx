import { useState } from "react";
import type { ChangeEvent } from "react";

import { getCart, clearCart, saveCart } from "@/store/cart";
import { getConfig } from "@/services/api";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

import { validatePhone, validateCheckout } from "@/utils/checkoutValidators";
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

  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    updateField(e);

    if (name === "senderName" || name === "senderPhone") {
      if (name === "senderPhone") {
        if (value.length > 0 && !validatePhone(value)) {
          setErrors((prev) => ({
            ...prev,
            senderPhone: "❌ Ingresa un número de teléfono válido",
          }));
        } else {
          setErrors((prev) => ({ ...prev, senderPhone: "" }));
        }
      }
    }

    if (name === "recipientName" || name === "recipientPhone") {
      if (name === "recipientPhone") {
        if (value.length > 0 && !validatePhone(value)) {
          setErrors((prev) => ({
            ...prev,
            recipientPhone: "❌ Ingresa un número de teléfono válido",
          }));
        } else {
          setErrors((prev) => ({ ...prev, recipientPhone: "" }));
        }
      }
    }
  };

  const submitOrder = async () => {
    if (isLoading) return;

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

    const error = validateCheckout(formData, cart);

    if (error) {
      alert(error);
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
      alert("Error al enviar pedido");
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

      <button className="btn-primary" onClick={submitOrder} disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar pedido por WhatsApp"}
      </button>
    </div>
  );
}

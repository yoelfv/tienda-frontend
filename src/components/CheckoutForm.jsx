import { useState, useEffect } from "react";
import { getCart } from "../store/cart";
import { getConfiguracion } from "../services/api";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { validatePhone, validateCheckout } from "../utils/checkoutValidators";
import { buildWhatsAppMessage } from "../utils/buildWhatsAppMessage";
import OrderSummary from "./checkout/OrderSummary";
import SenderForm from "./checkout/SenderForm";
import DeliveryForm from "./checkout/DeliveryForm";

export default function CheckoutForm() {
  const [cart, setCart] = useState([]);
  const { formData, updateField } = useCheckoutForm();

  const [errors, setErrors] = useState({
    senderPhone: "",
    recipientPhone: ""
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    updateField(e);

    if (name === "senderPhone") {
      if (value.length > 0 && !validatePhone(value)) {
        setErrors(prev => ({
          ...prev,
          senderPhone: "❌ Ingresa un número de teléfono válido"
        }));
      } else {
        setErrors(prev => ({ ...prev, senderPhone: "" }));
      }
    }

    if (name === "recipientPhone") {
      if (value.length > 0 && !validatePhone(value)) {
        setErrors(prev => ({
          ...prev,
          recipientPhone: "❌ Ingresa un número de teléfono válido"
        }));
      } else {
        setErrors(prev => ({ ...prev, recipientPhone: "" }));
      }
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const submitOrder = async () => {
    if (isLoading) return;

    const error = validateCheckout(formData, cart);

    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);

    try {
      const config = await getConfiguracion();
      const targetPhone = config?.whatsapp_phone || config?.telefono_whatsapp || "0000000000";
      const baseMessage = config?.base_message || config?.mensaje_base || "Nuevo pedido:";

      const message = buildWhatsAppMessage(formData, cart, total, config);

      const whatsappUrl = `https://wa.me/${targetPhone}?text=${message}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
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
      <button
        className="btn-back"
        onClick={() => window.location.href = "/"}
      >
        ← Volver a la tienda
      </button>

      <OrderSummary cart={cart} total={total} />

      <SenderForm
        formData={formData}
        handleChange={handleChange}
        errors={errors}
      />

      <DeliveryForm
        formData={formData}
        handleChange={handleChange}
        errors={errors}
      />

      <button
        className="btn-primary"
        onClick={submitOrder}
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar pedido por WhatsApp"}
      </button>
    </div>
  );
}
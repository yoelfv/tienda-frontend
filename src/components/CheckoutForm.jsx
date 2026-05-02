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

  // 📋 Estado para errores de validación
  const [errors, setErrors] = useState({
    telefono_envia: "",
    telefono_recibe: ""
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );

  // 🔄 Validar teléfono en tiempo real mientras escribe
  const handleChange = (e) => {
  const { name, value } = e.target;

  // 👉 actualizar estado global del hook
  updateField(e);

  // 👉 validaciones (se quedan igual)
  if (name === "telefono_envia") {
    if (value.length > 0 && !validatePhone(value)) {
      setErrors(prev => ({
        ...prev,
        telefono_envia: "❌ Ingresa un número de teléfono válido"
      }));
    } else {
      setErrors(prev => ({ ...prev, telefono_envia: "" }));
    }
  }

  if (name === "telefono_recibe") {
    if (value.length > 0 && !validatePhone(value)) {
      setErrors(prev => ({
        ...prev,
        telefono_recibe: "❌ Ingresa un número de teléfono válido"
      }));
    } else {
      setErrors(prev => ({ ...prev, telefono_recibe: "" }));
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
      const targetPhone = config?.telefono_whatsapp || "0000000000";
      const baseMessage = config?.mensaje_base || "Nuevo pedido:";

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

      {/* 🛒 RESUMEN */}
      <OrderSummary cart={cart} total={total} />

      {/* 👤 DATOS QUIEN ENVÍA */}
      <SenderForm
        formData={formData}
        handleChange={handleChange}
        errors={errors}
      />

      {/* 📦 DATOS ENTREGA */}
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
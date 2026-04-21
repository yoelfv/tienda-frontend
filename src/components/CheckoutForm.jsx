import { useState, useEffect } from "react";
import { getCart } from "../store/cart";
import { crearPedido } from "../services/api";
import { getConfiguracion } from "../services/api";

export default function CheckoutForm() {
  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    nombre_envia: "",
    telefono_envia: "",
    nombre_recibe: "",
    telefono_recibe: "",
    direccion: "",
    nota: ""
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const enviarPedido = async () => {
    if (!form.nombre_envia || !form.telefono_envia || !form.nombre_recibe || !form.telefono_recibe || !form.direccion) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      // 🟣 Guardar en Strapi
      await crearPedido({
        ...form,
        productos: cart,
        total
      });

      // 🟢 Crear mensaje WhatsApp

      const config = await getConfiguracion();

      const telefonoDestino = config?.telefono_whatsapp || "0000000000";
      const mensajeBase = config?.mensaje_base || "Nuevo pedido:";
      //const costoEnvio = config?.costo_envio || 0;

      let mensaje = `${mensajeBase}\n\n`;

      cart.forEach(p => {
        mensaje += `• ${p.nombre} x${p.quantity} = $${p.precio * p.quantity}\n`;
      });

      mensaje += `\n💰 Subtotal: $${total}\n`;
      //mensaje += `🚚 Envío: $${costoEnvio}\n`;
      mensaje += `💵 Total: $${total + costoEnvio}\n\n`;

      if (form.nota) {
        mensaje += `📝 Nota: ${form.nota}\n`;
      }

      const url = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(mensaje)}`;

      window.open(url, "_blank");

      // 🧹 limpiar carrito
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // 🔁 redirigir
      window.location.href = "/pedido-exitoso";

    } catch (error) {
      console.error(error);
      alert("Error al enviar pedido");
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
      <div className="checkout-section">
        <h3>Resumen del pedido</h3>

        {cart.map(item => (
          <div key={item.id} className="resumen-item">
            <span>{item.nombre} x{item.quantity}</span>
            <span>${item.precio * item.quantity}</span>
          </div>
        ))}

        <h3>Total: ${total}</h3>
      </div>

      {/* 👤 DATOS QUIEN ENVÍA */}
      <div className="checkout-section">
        <h3>Tus datos</h3>

        <input name="nombre_envia" placeholder="Nombre de quien envía" onChange={handleChange} />
        <input name="telefono_envia" placeholder="Teléfono  de quien envía" onChange={handleChange} />
      </div>

      {/* 📦 DATOS ENTREGA */}
      <div className="checkout-section">
        <h3>Datos de entrega</h3>

        <input name="nombre_recibe" placeholder="Nombre y apellidos de quien recibe" onChange={handleChange} />
        <input name="telefono_recibe" placeholder="Teléfono  de quien recibe" onChange={handleChange} />
        <input name="direccion" placeholder="Dirección de entrega" onChange={handleChange} />
        <textarea name="nota" placeholder="Nota adicional (opcional)" onChange={handleChange}></textarea>
      </div>

      <button className="btn-primary" onClick={enviarPedido}>
        Enviar pedido por WhatsApp
      </button>
    </div>
  );
}
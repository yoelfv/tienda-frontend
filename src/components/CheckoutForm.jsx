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

  const [loading, setLoading] = useState(false);

const enviarPedido = async () => {
  if (loading) return;

  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  if (
    !form.nombre_envia ||
    !form.telefono_envia ||
    !form.nombre_recibe ||
    !form.telefono_recibe ||
    !form.direccion
  ) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  setLoading(true);

  try {
    // 🔧 1. Obtener configuración PRIMERO
    const config = await getConfiguracion();

    const telefonoDestino = config?.telefono_whatsapp || "0000000000";
    const mensajeBase = config?.mensaje_base || "Nuevo pedido:";
    const costoEnvio = config?.costo_envio || 0;

    // 🟣 2. Guardar pedido
    await crearPedido({
      ...form,
      productos: cart,
      total: total
    });

// 🟢 3. Crear mensaje
let mensaje = `${mensajeBase}\n\n`;

// 👤 Datos de quien envía
mensaje += `👤 DATOS DE QUIEN ENVÍA:\n`;
mensaje += `📛 Nombre: ${form.nombre_envia}\n`;
mensaje += `📞 Teléfono: ${form.telefono_envia}\n\n`;

// 📦 Datos de entrega
mensaje += `📦 DATOS DE ENTREGA:\n`;
mensaje += `📛 Nombre: ${form.nombre_recibe}\n`;
mensaje += `📞 Teléfono: ${form.telefono_recibe}\n`;
mensaje += `📍 Dirección: ${form.direccion}\n\n`;

// 🛒 Productos
mensaje += `🛒 PRODUCTOS:\n`;
cart.forEach(p => {
  mensaje += `• ${p.nombre} x${p.quantity} = $${p.precio * p.quantity}\n`;
});

// 💰 Totales
mensaje += `💵 Total: $${total}\n\n`;

// 📝 Nota (si existe)
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
  } finally {
    setLoading(false);
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

        <input
          name="nombre_envia"
          value={form.nombre_envia}
          onChange={handleChange}
          placeholder="Nombre de quien envía"
         />
        <input
         name="telefono_envia" 
         value={form.telefono_envia}
         onChange={handleChange}
         placeholder="Teléfono  de quien envía" 
        />
      </div>

      {/* 📦 DATOS ENTREGA */}
      <div className="checkout-section">
        <h3>Datos de entrega</h3>

        <input
         name="nombre_recibe" 
         value={form.nombre_recibe}
         onChange={handleChange}
         placeholder="Nombre y apellidos de quien recibe" 
        />
        <input
         name="telefono_recibe" 
         value={form.telefono_recibe}
         onChange={handleChange}
         placeholder="Teléfono  de quien recibe" 
        />
        <input
         name="direccion" 
         value={form.direccion}
         onChange={handleChange}
         placeholder="Dirección de entrega" 
        />
        <textarea
         name="nota"
         value={form.nota}
         onChange={handleChange}
         placeholder="Nota adicional (opcional)"
        ></textarea>
      </div>

      <button
        className="btn-primary"
        onClick={enviarPedido}
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar pedido por WhatsApp"}
      </button>
    </div>
  );
}
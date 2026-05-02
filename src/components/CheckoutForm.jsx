import { useState, useEffect } from "react";
import { getCart } from "../store/cart";
import { getConfiguracion } from "../services/api";

// 🧠 Función para validar número de teléfono
const validarTelefono = (telefono) => {
  // Eliminar espacios y guiones para validar
  const limpio = telefono.replace(/[\s\-]/g, "");
  
  // Regex: acepta formatos como +5355555555, 55555555, +1(555)555-5555
  const regexTelefono = /^(\+?\d{1,3})?[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;
  
  return regexTelefono.test(limpio) && limpio.length >= 8;
};

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

  // 📋 Estado para errores de validación
  const [errores, setErrores] = useState({
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

    setForm({
      ...form,
      [name]: value
    });

    // Validar teléfonos en tiempo real
    if (name === "telefono_envia") {
      if (value.length > 0 && !validarTelefono(value)) {
        setErrores(prev => ({
          ...prev,
          telefono_envia: "❌ Ingresa un número de teléfono válido"
        }));
      } else {
        setErrores(prev => ({ ...prev, telefono_envia: "" }));
      }
    }

    if (name === "telefono_recibe") {
      if (value.length > 0 && !validarTelefono(value)) {
        setErrores(prev => ({
          ...prev,
          telefono_recibe: "❌ Ingresa un número de teléfono válido"
        }));
      } else {
        setErrores(prev => ({ ...prev, telefono_recibe: "" }));
      }
    }
  };

  const [loading, setLoading] = useState(false);

  const enviarPedido = async () => {
    if (loading) return;

    // ✅ Validación completa antes de enviar
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

    // 🔢 Validar teléfonos
    if (!validarTelefono(form.telefono_envia)) {
      alert("El número de teléfono de quien envía no es válido");
      return;
    }

    if (!validarTelefono(form.telefono_recibe)) {
      alert("El número de teléfono de quien recibe no es válido");
      return;
    }

    setLoading(true);

    try {
      const config = await getConfiguracion();
      const telefonoDestino = config?.telefono_whatsapp || "0000000000";
      const mensajeBase = config?.mensaje_base || "Nuevo pedido:";


      // 🟢 Crear mensaje
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

      mensaje += `\n💰 Subtotal: $${total}\n`;
      mensaje += `💵 Total: $${total}\n\n`;

      if (form.nota) {
        mensaje += `📝 Nota: ${form.nota}\n`;
      }

      const url = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      window.location.href = "/order-success";

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
          placeholder="Nombre de quien envía *"
        />
        <input
          name="telefono_envia"
          value={form.telefono_envia}
          onChange={handleChange}
          placeholder="Teléfono de quien envía *"
          className={errores.telefono_envia ? "input-error" : ""}
        />
        {errores.telefono_envia && (
          <span className="error-message">{errores.telefono_envia}</span>
        )}
      </div>

      {/* 📦 DATOS ENTREGA */}
      <div className="checkout-section">
        <h3>Datos de entrega</h3>
        <input
          name="nombre_recibe"
          value={form.nombre_recibe}
          onChange={handleChange}
          placeholder="Nombre y apellidos de quien recibe *"
        />
        <input
          name="telefono_recibe"
          value={form.telefono_recibe}
          onChange={handleChange}
          placeholder="Teléfono de quien recibe *"
          className={errores.telefono_recibe ? "input-error" : ""}
        />
        {errores.telefono_recibe && (
          <span className="error-message">{errores.telefono_recibe}</span>
        )}
        <input
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          placeholder="Dirección de entrega *"
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
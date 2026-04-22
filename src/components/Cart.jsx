import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity } from "../store/cart";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // 🔄 Actualizar carrito
  const updateCart = () => {
    const storedCart = getCart();
    setCart(Array.isArray(storedCart) ? storedCart : []);
  };

  useEffect(() => {
    updateCart();

    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  // 💰 Formatear precio
  const formatPrice = (value) => {
    return new Intl.NumberFormat("es-ES").format(value);
  };

  // 💰 Total
  const total = cart.reduce((sum, item) => {
    return sum + item.precio * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Carrito</h2>

      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">

              <p><strong>{item.nombre}</strong></p>

              {/* 🔢 Cantidad */}
              <div className="qty-controls">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => updateQuantity(item.id, 1)}
                  disabled={item.quantity >= 10}
                >
                  +
                </button>
              </div>

              <p>Precio unitario: ${formatPrice(item.precio)}</p>
              <p>Subtotal: ${formatPrice(item.precio * item.quantity)}</p>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Eliminar
              </button>
            </div>
          ))}

          <h3>Total: ${formatPrice(total)}</h3>
        </>
      )}
    </div>
  );
}
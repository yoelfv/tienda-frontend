import { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../store/cart";
import { updateQuantity } from "../store/cart";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const updateCart = () => {
      const storedCart = getCart();
      setCart(storedCart);
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const total = cart.reduce((sum, item) => {
    return sum + item.precio * item.quantity;
  }, 0);

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem" }}>
      <h2>🛒 Carrito</h2>

      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.id}
              style={{
                borderBottom: "1px solid #eee",
                marginBottom: "1rem",
                paddingBottom: "0.5rem"
              }}
            >
              <p><strong>{item.nombre}</strong></p>
              <div className="qty-controls">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
  
                <span>{item.quantity}</span>
  
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <p>Precio unitario: ${item.precio}</p>
              <p>Subtotal: ${item.precio * item.quantity}</p>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Eliminar
              </button>
            </div>
          ))}

          <h3>Total: ${total}</h3>
        </>
      )}
    </div>
  );
}
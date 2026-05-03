import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity } from "../store/cart";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const updateCart = () => {
    const storedCart = getCart();
    setCart(Array.isArray(storedCart) ? storedCart : []);
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("storage", updateCart);
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const formatPrice = (value) => new Intl.NumberFormat("es-ES").format(value);

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* 🔘 BOTÓN FLOTANTE DEL CARRITO */}
      <button
        className={`cart-fab ${totalItems > 0 ? "has-items" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        🛒
        {totalItems > 0 && <span className="cart-fab-badge">{totalItems}</span>}
      </button>

      {/* 🛒 PANEL LATERAL */}
      <div className={`cart-panel ${isOpen ? "open" : ""}`}>
        <div className="cart-panel-header">
          <h2>🛒 Carrito</h2>
          <button className="cart-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="cart-panel-body">
          {cart.length === 0 ? (
            <p className="cart-empty">El carrito está vacío</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  
                  <div className="cart-item-top">
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.nombre}</p>
                      <p className="cart-item-price">
                        ${formatPrice(item.precio)}
                      </p>
                    </div>
                  </div>

                  <div className="qty-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= 10}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-subtotal">
                    Subtotal: ${formatPrice(item.precio * item.quantity)}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <div className="cart-footer">
                <h3>Total: ${formatPrice(total)}</h3>
                <button
                  className="btn-primary"
                  onClick={() => window.location.href = "/checkout"}
                >
                  Finalizar compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
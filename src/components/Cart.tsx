import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity } from "@/store/cart";
import type { CartItem } from "@/types/product";
import { getCartLimit } from "@/constants/cartLimits";

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = getCart();

    return Array.isArray(storedCart) ? storedCart : [];
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updateCart = (): void => {
    const storedCart = getCart();

    setCart(Array.isArray(storedCart) ? storedCart : []);
  };

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const formatPrice = (value: number): string =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const distinctCount = cart.length;

  return (
    <>
      <button
        className={`cart-fab ${distinctCount > 0 ? "has-items" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        🛒
        {distinctCount > 0 && (
          <span className="cart-fab-badge">{distinctCount > 99 ? "99+" : distinctCount}</span>
        )}
      </button>

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
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-top">
                    <div className="cart-item-info">
                      <p className="cart-item-name">
                        {item.name}
                        {item.saleUnit === "weight" ? " (libras)" : ""}
                      </p>

                      <p className="cart-item-price">${formatPrice(item.price)}</p>
                    </div>
                  </div>

                  <div className="qty-controls">
                    {(() => {
                      const limit = getCartLimit(item.saleUnit);
                      const step = item.saleUnit === "weight" ? 0.5 : 1;

                      return (
                        <>
                          <button
                            onClick={() => updateQuantity(item.id, -step)}
                            disabled={item.quantity <= limit.min}
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                            {item.saleUnit === "weight" ? " lb" : ""}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, step)}
                            disabled={item.quantity >= limit.max}
                          >
                            +
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  <p className="cart-item-subtotal">
                    Subtotal: ${formatPrice(item.price * item.quantity)}
                  </p>

                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    Eliminar
                  </button>
                </div>
              ))}

              <div className="cart-footer">
                <h3>Total: ${formatPrice(total)}</h3>

                <button
                  className="btn-primary"
                  onClick={() => (window.location.href = "/checkout")}
                >
                  Finalizar compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

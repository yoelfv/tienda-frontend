import { useEffect, useState } from "react";
import { getCart } from "../store/cart";

export default function CartCount() {
  const [count, setCount] = useState(() => {
    const cart = getCart();
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  });

  const updateCount = () => {
    const cart = getCart();

    if (!Array.isArray(cart)) {
      setCount(0);
      return;
    }

    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    setCount(totalItems);
  };

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <a href="/checkout" className="cart-link">
      🛒
      <span className={`cart-badge ${count > 0 ? "active" : ""}`}>{count}</span>
    </a>
  );
}
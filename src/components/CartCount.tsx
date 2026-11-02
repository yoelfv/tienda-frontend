import { useCallback, useEffect, useState } from "react";
import { getCart } from "@/store/cart";

export default function CartCount() {
  // Contar productos distintos (no sumar cantidades)
  const getCount = (): number => {
    const cart = getCart();

    if (!Array.isArray(cart)) return 0;

    return cart.length;
  };

  const [count, setCount] = useState<number>(getCount);

  const updateCount = useCallback((): void => {
    setCount(getCount());
  }, []);

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, [updateCount]);

  // Si hay más de 99 productos distintos, mostrar "99+"
  const displayCount = count > 99 ? "99+" : count;

  return (
    <a href="/checkout" className="cart-link">
      🛒
      <span className={`cart-badge ${count > 0 ? "active" : ""}`}>{displayCount}</span>
    </a>
  );
}

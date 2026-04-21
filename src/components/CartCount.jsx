import { useEffect, useState } from "react";
import { getCart } from "../store/cart";

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();

      const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCount(totalItems);
    };

    updateCount();

    window.addEventListener("cartUpdated", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  return (
    <a href="/checkout">
      🛒 Carrito ({count})
    </a>
  );
}
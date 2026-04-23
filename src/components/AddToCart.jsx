import { useState } from "react";
import { addToCart, getCart } from "../store/cart";

export default function AddToCart({ product }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // 🚫 si no disponible, no hacer nada
    if (!product?.disponible) return;

    if (!product || !product.id) {
      console.warn("Producto inválido:", product);
      return;
    }

    // 🔍 verificar límite
    const cart = getCart();
    const existing = cart.find(p => p.id === product.id);

    if (existing && existing.quantity >= 10) {
      alert("Has alcanzado el máximo de 10 unidades para este producto");
      return;
    }

    addToCart(product);

    // ✨ feedback visual
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      className={`btn ${added ? "added" : ""}`}
      onClick={handleAdd}
      disabled={!product?.disponible}
    >
      {!product?.disponible
        ? "Agotado"
        : added
        ? "✔ Añadido"
        : "Añadir al carrito"}
    </button>
  );
}
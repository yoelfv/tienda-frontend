import { useState } from "react";
import { addToCart, getCart } from "@/store/cart";
import type { Product } from "@/types/product";

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const [added, setAdded] = useState<boolean>(false);

  const handleAdd = (): void => {
    if (!product?.available) return;

    if (!product || !product.id) {
      console.warn("Invalid product:", product);
      return;
    }

    const cart = getCart();

    const existing = cart.find((item) => item.id === product.id);

    if (existing && existing.quantity >= 10) {
      alert("Has alcanzado el máximo de 10 unidades para este producto");
      return;
    }

    addToCart(product);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      className={`btn ${added ? "added" : ""}`}
      onClick={handleAdd}
      disabled={!product?.available}
    >
      {!product?.available
        ? "Agotado"
        : added
        ? "✔ Añadido"
        : "Añadir al carrito"}
    </button>
  );
}
import { useState } from "react";
import { addToCart, getCart } from "@/store/cart";
import { getCartLimit } from "@/constants/cartLimits";
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
    const limit = getCartLimit(product.saleUnit);

    if (existing && existing.quantity >= limit.max) {
      alert(`Has alcanzado el máximo de ${limit.max} ${limit.label} para este producto`);
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
      {!product?.available ? "Agotado" : added ? "✔ Añadido" : "Añadir al carrito"}
    </button>
  );
}

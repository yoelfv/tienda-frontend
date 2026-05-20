import type { CartItem, Product } from "@/types/product";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    return Array.isArray(cart) ? (cart as CartItem[]) : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  notifyCartChange();
}

export function addToCart(product: Product): void {
  if (!product || !product.id) {
    console.warn("Invalid product:", product);
    return;
  }

  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  let updatedCart: CartItem[];

  if (existing) {
    updatedCart = cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    updatedCart = [
      ...cart,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    ];
  }

  saveCart(updatedCart);
}

export function removeFromCart(productId: number): void {
  const cart = getCart();

  const updatedCart = cart.filter((item) => item.id !== productId);

  saveCart(updatedCart);
}

export function updateQuantity(productId: number, amount: number): void {
  const cart = getCart();

  const updatedCart = cart
    .map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;

        if (newQuantity <= 0) return null;
        if (newQuantity > 10) return item;

        return { ...item, quantity: newQuantity };
      }

      return item;
    })
    .filter((item): item is CartItem => item !== null);

  saveCart(updatedCart);
}

export function clearCart(): void {
  saveCart([]);
}

function notifyCartChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("cartUpdated"));
  window.dispatchEvent(new Event("storage"));
}

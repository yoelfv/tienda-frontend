import type { CartItem, Product } from "@/types/product";

import {
  getDailyData,
  saveDailyData,
} from "@/utils/storage";

import { STORAGE_KEYS } from "@/constants/storageKeys";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return (
      getDailyData<CartItem[]>(
        STORAGE_KEYS.CART
      ) ?? []
    );
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  saveDailyData(
    STORAGE_KEYS.CART,
    cart
  );

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
        saleUnit: product.saleUnit,
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
        const isWeight = item.saleUnit === "weight";
        const newQuantity = item.quantity + amount;

        // Límites según el tipo de producto
        const minQuantity = isWeight ? 0.5 : 1;
        const maxQuantity = isWeight ? 50 : 10;

        if (newQuantity < minQuantity) return null;
        if (newQuantity > maxQuantity) return item;

        // Redondear a 2 decimales para pesos (evitar 1.5000000001)
        const rounded = isWeight
          ? Math.round(newQuantity * 100) / 100
          : newQuantity;

        return { ...item, quantity: rounded };
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

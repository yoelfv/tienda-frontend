export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);

  // 👇 ESTA LÍNEA ES CLAVE
  window.dispatchEvent(new Event("cartUpdated"));
}

export function removeFromCart(productId) {
  const cart = getCart();

  const updatedCart = cart.filter(p => p.id !== productId);

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // 🔔 notificar cambios
  window.dispatchEvent(new Event("cartUpdated"));
}

export function updateQuantity(productId, amount) {
  const cart = getCart();

  const updatedCart = cart.map(item => {
    if (item.id === productId) {
      const newQuantity = item.quantity + amount;

      // eliminar si llega a 0
      if (newQuantity <= 0) return null;

      return { ...item, quantity: newQuantity };
    }
    return item;
  }).filter(Boolean); // elimina null

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  window.dispatchEvent(new Event("cartUpdated"));
}
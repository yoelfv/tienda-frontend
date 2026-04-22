// 🧠 Obtener carrito de forma segura
export function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.error("Error leyendo carrito:", error);
    return [];
  }
}

// 💾 Guardar carrito + emitir evento
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));

  // 🔔 Notificar cambios globalmente
  window.dispatchEvent(new CustomEvent("cartUpdated", {
    detail: updatedCart
  }));
}

// ➕ Añadir producto
export function addToCart(product) {
  if (!product || !product.id) {
    console.warn("Producto inválido:", product);
    return;
  }

  const cart = getCart();

  const existing = cart.find(p => p.id === product.id);

  let updatedCart;

  if (existing) {
    updatedCart = cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...cart, { ...product, quantity: 1 }];
  }

  saveCart(updatedCart);
  notifyCartChange();
}

// ❌ Eliminar producto
export function removeFromCart(productId) {
  const cart = getCart();

  const updatedCart = cart.filter(p => p.id !== productId);

  saveCart(updatedCart);
  notifyCartChange();
}

// 🔢 Actualizar cantidad
export function updateQuantity(productId, amount) {
  const cart = getCart();

  const updatedCart = cart
    .map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;

        // ❌ eliminar si llega a 0
        if (newQuantity <= 0) return null;

        // 🚫 límite máximo
        if (newQuantity > 10) return item;

        return { ...item, quantity: newQuantity };
      }
      return item;
    })
    .filter(Boolean);

  saveCart(updatedCart);
  notifyCartChange();
}

// 🧹 Vaciar carrito (extra útil)
export function clearCart() {
  saveCart([]);
  notifyCartChange();
}

function notifyCartChange() {
   window.dispatchEvent(new Event("cartUpdated"));

   window.dispatchEvent(new Event("storage"));
}
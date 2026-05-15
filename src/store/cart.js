export function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));

  window.dispatchEvent(new Event("cartUpdated"));
}

export function addToCart(product) {
  if (!product || !product.id) {
    console.warn("Invalid product:", product);
    return;
  }

  const cart = getCart();

  const existing = cart.find(item => item.id === product.id);

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

export function removeFromCart(productId) {
  const cart = getCart();

  const updatedCart = cart.filter(item => item.id !== productId);

  saveCart(updatedCart);
  notifyCartChange();
}

export function updateQuantity(productId, amount) {
  const cart = getCart();

  const updatedCart = cart
    .map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;

        if (newQuantity <= 0) return null;

        if (newQuantity > 10) return item;

        return { ...item, quantity: newQuantity };
      }
      return item;
    })
    .filter(Boolean);

  saveCart(updatedCart);
  notifyCartChange();
}

export function clearCart() {
  saveCart([]);
  notifyCartChange();
}

function notifyCartChange() {
  window.dispatchEvent(new Event("cartUpdated"));
  window.dispatchEvent(new Event("storage"));
}
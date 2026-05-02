export default function OrderSummary({ cart, total }) {
  return (
    <div className="checkout-section">
      <h3>Resumen del pedido</h3>

      {cart.map(item => (
        <div key={item.id} className="resumen-item">
          <span>{item.nombre} x{item.quantity}</span>
          <span>${item.precio * item.quantity}</span>
        </div>
      ))}

      <h3>Total: ${total}</h3>
    </div>
  );
}
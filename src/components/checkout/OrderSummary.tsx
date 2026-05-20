import type { CartItem } from "@/types/product";

type OrderSummaryProps = {
  cart: CartItem[];
  total: number;
};

export default function OrderSummary({ cart, total }: OrderSummaryProps) {
  return (
    <div className="checkout-section">
      <h3>Resumen del pedido</h3>

      {cart.map((item) => (
        <div key={item.id} className="resumen-item">
          <span>
            {item.name} x{item.quantity}
          </span>

          <span>${item.price * item.quantity}</span>
        </div>
      ))}

      <h3>Total: ${total}</h3>
    </div>
  );
}

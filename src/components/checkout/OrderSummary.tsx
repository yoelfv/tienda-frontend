import type { CartItem } from "@/types/product";

type OrderSummaryProps = {
  cart: CartItem[];
  total: number;
};

const formatPrice = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function OrderSummary({ cart, total }: OrderSummaryProps) {
  return (
    <div className="checkout-section">
      <h3>Resumen del pedido</h3>

      {cart.map((item) => (
        <div key={item.id} className="resumen-item">
          <span>
            {item.name} x{item.quantity}
          </span>

          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      ))}

      <h3>Total: ${formatPrice(total)}</h3>
    </div>
  );
}

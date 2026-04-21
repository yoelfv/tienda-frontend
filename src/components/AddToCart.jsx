import { addToCart } from "../store/cart";

export default function AddToCart({ product }) {
  return (
    <button className="btn" onClick={() => addToCart(product)}>
      Añadir
    </button>
  );
}
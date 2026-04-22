import { useEffect, useState } from "react";
import { getPedidos } from "../services/api";

export default function PedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 💰 formateo
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-ES").format(value);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Error cargando pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="pedidos-container">
      {pedidos.length === 0 ? (
        <p>No hay pedidos</p>
      ) : (
        pedidos.map(p => (
          <div key={p.id} className="pedido-card">

            <h3>Pedido #{p.id}</h3>

            <div className="pedido-section">
              <p><strong>Envía:</strong> {p.nombre_envia}</p>
              <p><strong>Tel:</strong> {p.telefono_envia}</p>
            </div>

            <div className="pedido-section">
              <p><strong>Recibe:</strong> {p.nombre_recibe}</p>
              <p><strong>Tel:</strong> {p.telefono_recibe}</p>
            </div>

            <div className="pedido-section">
              <p><strong>Dirección:</strong> {p.direccion}</p>
              <p><strong>Nota:</strong> {p.nota || "Ninguna"}</p>
            </div>

            <h4>Productos:</h4>
            <ul>
              {(p.productos || []).map((prod, i) => (
                <li key={i}>
                  {prod.nombre} x{prod.quantity}
                </li>
              ))}
            </ul>

            <h3>Total: ${formatPrice(p.total)}</h3>
          </div>
        ))
      )}
    </div>
  );
}
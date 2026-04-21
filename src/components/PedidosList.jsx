import { useEffect, useState } from "react";
import { getPedidos } from "../services/api";

export default function PedidosList() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    getPedidos().then(setPedidos);
  }, []);

  return (
    <div>
      {pedidos.length === 0 ? (
        <p>No hay pedidos</p>
      ) : (
        pedidos.map(p => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "1rem",
              padding: "1rem"
            }}
          >
            <h3>Pedido #{p.id}</h3>

            <p><strong>Envía:</strong> {p.nombre_envia}</p>
            <p><strong>Tel:</strong> {p.telefono_envia}</p>

            <p><strong>Recibe:</strong> {p.nombre_recibe}</p>
            <p><strong>Tel:</strong> {p.telefono_recibe}</p>

            <p><strong>Dirección:</strong> {p.direccion}</p>
            <p><strong>Nota:</strong> {p.nota || "Ninguna"}</p>

            <h4>Productos:</h4>
            <ul>
              {p.productos.map((prod, i) => (
                <li key={i}>
                  {prod.nombre} x{prod.quantity}
                </li>
              ))}
            </ul>

            <h3>Total: ${p.total}</h3>
          </div>
        ))
      )}
    </div>
  );
}
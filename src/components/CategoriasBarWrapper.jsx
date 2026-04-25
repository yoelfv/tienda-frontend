import { useEffect, useState } from "react";
import { getCategorias } from "../services/api";
import CategoriasBar from "./CategoriasBar";

export default function CategoriasBarWrapper({ categoriaActiva, onSelect }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch(console.error);
  }, []);

  return (
    <div className="categorias-barra">
      <CategoriasBar
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelect={onSelect}
      />
    </div>
  );
}
import { useState } from "react";

export function useCheckoutForm() {
  const [formData, setFormData] = useState({
    nombre_envia: "",
    telefono_envia: "",
    nombre_recibe: "",
    telefono_recibe: "",
    direccion: "",
    nota: ""
  });

  const updateField = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value ?? ""
   }));
  };

  return {
    formData,
    updateField
  };
}
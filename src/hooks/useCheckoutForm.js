import { useState } from "react";

export function useCheckoutForm() {
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    address: "",
    note: ""
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
import { useState } from "react";
import type { ChangeEvent } from "react";
import type { CheckoutFormData } from "@/types/checkout";

type FormField = keyof CheckoutFormData;

export function useCheckoutForm() {
  const [formData, setFormData] = useState<CheckoutFormData>({
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    address: "",
    note: "",
  });

  const updateField = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    const fieldName = name as FormField;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value ?? "",
    }));
  };

  return {
    formData,
    updateField,
  };
}

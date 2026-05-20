import type { ChangeEvent } from "react";

import InputField from "../ui/InputField";
import type { CheckoutFormData } from "../../types/checkout";

type SenderFormProps = {
  formData: CheckoutFormData;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  errors: {
    senderPhone: string;
    recipientPhone: string;
  };
};

export default function SenderForm({
  formData,
  handleChange,
  errors,
}: SenderFormProps) {
  return (
    <div className="checkout-section">
      <h3>Tus datos</h3>

      <InputField
        name="senderName"
        value={formData.senderName}
        onChange={handleChange}
        placeholder="Nombre de quien envía *"
      />

      <InputField
        name="senderPhone"
        value={formData.senderPhone}
        onChange={handleChange}
        placeholder="Teléfono de quien envía *"
        error={errors.senderPhone}
      />
    </div>
  );
}
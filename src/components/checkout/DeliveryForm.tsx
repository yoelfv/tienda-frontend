import type { ChangeEvent } from "react";

import InputField from "@/components/ui/InputField";
import type { CheckoutFormData } from "@/types/checkout";

type DeliveryFormProps = {
  formData: CheckoutFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errorPhone?: string;
};

export default function DeliveryForm({ formData, handleChange, errorPhone }: DeliveryFormProps) {
  return (
    <div className="checkout-section">
      <h3>Datos de entrega</h3>

      <InputField
        name="recipientName"
        value={formData.recipientName}
        onChange={handleChange}
        placeholder="Nombre y apellidos de quien recibe *"
      />

      <InputField
        name="recipientPhone"
        value={formData.recipientPhone}
        onChange={handleChange}
        placeholder="Teléfono de quien recibe *"
        error={errorPhone}
      />

      <InputField
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Dirección de entrega *"
      />

      <InputField
        as="textarea"
        name="note"
        value={formData.note}
        onChange={handleChange}
        placeholder="Nota adicional (opcional)"
      />
    </div>
  );
}

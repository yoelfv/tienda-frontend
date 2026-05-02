import InputField from "../ui/InputField";

export default function SenderForm({
  formData,
  handleChange,
  errors
}) {
  return (
    <div className="checkout-section">
      <h3>Tus datos</h3>
      <InputField
        name="nombre_envia"
        value={formData.nombre_envia}
        onChange={handleChange}
        placeholder="Nombre de quien envía *"
      />
      <InputField
        name="telefono_envia"
        value={formData.telefono_envia}
        onChange={handleChange}
        placeholder="Teléfono de quien envía *"
        error={errors.telefono_envia}
      />
    </div>
  );
}
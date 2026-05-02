import InputField from "../ui/InputField";

export default function DeliveryForm({
  formData,
  handleChange,
  errors
}) {
  return (
    <div className="checkout-section">
      <h3>Datos de entrega</h3>
      <InputField
        name="nombre_recibe"
        value={formData.nombre_recibe}
        onChange={handleChange}
        placeholder="Nombre y apellidos de quien recibe *"
      />
      <InputField
        name="telefono_recibe"
        value={formData.telefono_recibe}
        onChange={handleChange}
        placeholder="Teléfono de quien recibe *"
        error={errors.telefono_recibe}
      />
      <InputField
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        placeholder="Dirección de entrega *"
      />
      <InputField
        as="textarea"
        name="nota"
        value={formData.nota}
        onChange={handleChange}
        placeholder="Nota adicional (opcional)"
      />
    </div>
  );
}
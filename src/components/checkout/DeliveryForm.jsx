export default function DeliveryForm({
  formData,
  handleChange,
  errors
}) {
  return (
    <div className="checkout-section">
      <h3>Datos de entrega</h3>

      <input
        name="nombre_recibe"
        value={formData.nombre_recibe}
        onChange={handleChange}
        placeholder="Nombre y apellidos de quien recibe *"
      />

      <input
        name="telefono_recibe"
        value={formData.telefono_recibe}
        onChange={handleChange}
        placeholder="Teléfono de quien recibe *"
        className={errors.telefono_recibe ? "input-error" : ""}
      />

      {errors.telefono_recibe && (
        <span className="error-message">
          {errors.telefono_recibe}
        </span>
      )}

      <input
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        placeholder="Dirección de entrega *"
      />

      <textarea
        name="nota"
        value={formData.nota}
        onChange={handleChange}
        placeholder="Nota adicional (opcional)"
      />
    </div>
  );
}
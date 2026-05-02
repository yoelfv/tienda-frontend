export default function SenderForm({
  formData,
  handleChange,
  errors
}) {
  return (
    <div className="checkout-section">
      <h3>Tus datos</h3>

      <input
        name="nombre_envia"
        value={formData.nombre_envia}
        onChange={handleChange}
        placeholder="Nombre de quien envía *"
      />

      <input
        name="telefono_envia"
        value={formData.telefono_envia}
        onChange={handleChange}
        placeholder="Teléfono de quien envía *"
        className={errors.telefono_envia ? "input-error" : ""}
      />

      {errors.telefono_envia && (
        <span className="error-message">
          {errors.telefono_envia}
        </span>
      )}
    </div>
  );
}
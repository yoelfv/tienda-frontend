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
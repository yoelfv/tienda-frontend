export default function InputField({ name, value, onChange, placeholder, error, as = "input" }) {
  const Component = as;

  return (
    <>
      <Component
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
      />

      {error && <span className="error-message">{error}</span>}
    </>
  );
}

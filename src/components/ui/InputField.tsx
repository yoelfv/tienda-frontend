import type { ChangeEvent } from "react";

interface InputFieldProps {
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  as?: "input" | "textarea";
}

export default function InputField({
  name,
  value,
  onChange,
  placeholder,
  error,
  as = "input",
}: InputFieldProps) {
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

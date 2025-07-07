import React from "react";

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  styles: any;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  styles,
}) => {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        required={required}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;

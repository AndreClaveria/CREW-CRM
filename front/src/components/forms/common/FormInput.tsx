// components/forms/common/IconInput.tsx
import { ChangeEvent } from "react";
import Image from "next/image";
import { authStyles } from "@/styles/pages/auth/authStyles";

interface IconInputProps {
  type: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const IconInput: React.FC<IconInputProps> = ({
  type,
  placeholder,
  icon,
  value,
  onChange,
  required,
}) => {
  return (
    <div style={authStyles.inputContainer}>
      <Image
        src={icon}
        alt={`${placeholder} Icon`}
        width={20}
        height={20}
        style={authStyles.logoInput}
      />
      <input
        type={type}
        placeholder={placeholder}
        style={authStyles.input}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default IconInput;

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export const PasswordField = ({
  name,
  label,
  value,
  onChange,
  error,
  errorMessage,
  required,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          tabIndex={-1}
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          dir="ltr"
          className={`w-full h-[42px] rounded p-2 outline-none transition 
            ${error ? "border border-red-600" : "border border-gray-300"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && errorMessage && (
        <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

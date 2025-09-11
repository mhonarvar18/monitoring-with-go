import React from "react";

interface ColorFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
}

const ColorField: React.FC<ColorFieldProps> = ({
  name,
  label,
  value,
  onChange,
  required,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[42px] w-full rounded border ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <span className="text-red-500 text-xs">رنگ را انتخاب کنید</span>
      )}
    </div>
  );
};

export default ColorField;

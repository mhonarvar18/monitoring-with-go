// src/components/form/fields/TextField.tsx
interface Props {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  /** true when this field has a validation error */
  error?: boolean;
  errorMessage?: string;
}

export function TextField({
  name,
  label,
  required,
  value,
  onChange,
  error,
  errorMessage,
}: Props) {
  return (
    <label className="flex flex-col gap-1" htmlFor={name}>
      <span>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className={`w-full h-[42px] rounded p-1 outline-none transition 
          ${error ? "border border-red-600" : "border border-gray-300"}`}
      />
      {error && errorMessage && (
        <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
      )}
    </label>
  );
}

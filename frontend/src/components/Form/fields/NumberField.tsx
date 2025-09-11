// src/components/form/fields/TextField.tsx
interface Props {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: number | "") => void;
  error?: boolean;
  sign?: "positive" | "negative" | "any";
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({
  name,
  label,
  required,
  value,
  onChange,
  error,
  sign = "any",
  min,
  max,
  step,
}: Props) {
  // determine actual min/max attributes
  const htmlMin =
    min != null
      ? min
      : sign === "positive"
      ? 0
      : sign === "negative"
      ? undefined
      : undefined;

  const htmlMax =
    max != null
      ? max
      : sign === "negative"
      ? 0
      : sign === "positive"
      ? undefined
      : undefined;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(""); // user cleared it
      return;
    }
    const num = Number(raw);
    if (isNaN(num)) return;
    if (sign === "positive" && num < 0) return;
    if (sign === "negative" && num > 0) return;
    onChange(num); // <—— send a number
  };

  return (
    <label className="flex flex-col gap-1">
      <span>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        name={name}
        type="number"
        value={value}
        min={htmlMin}
        max={htmlMax}
        step={step}
        onChange={handleInputChange}
        className={`w-full h-[42px] rounded p-2 outline-none transition ${
          error ? "border border-red-600" : "border border-gray-400"
        }`}
      />
      {error && (
        <span className="text-red-600 text-sm mt-1">این فیلد اجباری است</span>
      )}
    </label>
  );
}

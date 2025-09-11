import { ErrorMessage, Field } from "formik";

interface SelectFieldProps {
  label?: string;
  name: string;
  options: { label: string; value: number | string }[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = ({
  label = "انتخاب کنید",
  name,
  options,
  placeholder,
  onChange,
}: SelectFieldProps) => (
  <div className="w-full rtl">
    <label
      className="rtl font-medium text-[#828282] text-right text-sm 2xl:text-base"
      style={{ direction: "rtl" }}
      htmlFor={name}
    >
      {label}
    </label>
    <Field
      as="select"
      id={name}
      name={name}
      className="w-full p-2 border border-[#d4d8dd] rounded-md text-sm 2xl:text-base outline-none mt-2"
      style={{ direction: "rtl" }}
      onChange={onChange}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

export default SelectField
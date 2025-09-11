import { Field, ErrorMessage } from "formik";

interface UsernameFieldProps {
  className?: string;
  label?: string;
  placeholder?: string;
  name?: string;
}

const UsernameField = ({
  className = "",
  label = "نام کاربری",
  placeholder = "نام کاربری خود را وارد کنید",
  name = "username",
}: UsernameFieldProps) => (
  <div className="w-full rtl">
    <label
      className="rtl font-medium text-[#828282] text-right text-sm 2xl:text-base"
      style={{ direction: "rtl" }}
    >
      {label}
    </label>
    <Field
      name={name}
      className={`w-full p-2 border border-[#d4d8dd] rounded-md text-sm 2xl:text-base outline-none mt-2 ${className}`}
      style={{
        direction: "rtl",
      }}
      placeholder={placeholder}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default UsernameField;

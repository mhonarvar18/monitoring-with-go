import { Field, ErrorMessage, useField } from "formik";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface Props {
  label?: string;
  placeholder?: string;
  name?: string;
}

const PasswordField = ({
  label = "رمز عبور",
  placeholder = "رمز عبور خود را وارد نمایید",
  name = "password",
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [field] = useField(name!);

  return (
    <div className="w-full rtl">
      <label className="font-medium text-[#828282] text-sm 2xl:text-base block mb-2">
        {label}
      </label>
      <div
        className="flex items-center border border-[#d4d8dd] rounded-md px-2 py-2 2xl:py-3"
        style={{ direction: "rtl" }}
      >
        <input
          {...field}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="flex-1 text-sm 2xl:text-base outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="text-gray-500 pl-2"
        >
          {visible ? <RiEyeOffLine /> : <RiEyeLine />}
        </button>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default PasswordField;

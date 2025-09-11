import * as Yup from "yup";
import type { FormSchema } from "../components/Form/formSchema";

export const forgotPassSchema = [
  {
    name: "username",
    label: "نام کاربری خود را وارد کنید",
    type: "text",
    required: true,
    wrapperClassName: "col-span-1",
  },
  {
    name: "phoneNumber",
    label: "تلفن همراه خود را وارد کنید",
    type: "text",
    required: true,
    wrapperClassName: "col-span-1",
  },
  {
    name: "password",
    label: "رمز عبور جدید را وارد کنید",
    type: "password",
    required: true,
    wrapperClassName: "col-span-1",
  },
  {
    name: "confirmedPassword",
    label: "رمز عبور جدید را تایید کنید",
    type: "password",
    required: true,
    wrapperClassName: "col-span-1",
  },
] as FormSchema<any>;

export const forgotPassYupSchema = Yup.object().shape({
  password: Yup.string().required("رمز عبور الزامی است"),
  confirmedPassword: Yup.string()
    .oneOf([Yup.ref("password")], "رمز عبور و تکرار آن یکسان نیستند")
    .required("تکرار رمز عبور الزامی است"),
});

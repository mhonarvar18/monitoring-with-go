import * as Yup from "yup";
import Modal from "react-modal";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import UsernameField from "./UsernameField";
import PasswordField from "./PasswordField";
import { register } from "../authService";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { omit } from "../../../utils/omitValues";
import SelectField from "./SelectField";
import { errorStyle, successStyle } from "../../../types/stylesToast";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

interface Location {
  id: string | number;
  label: string;
  parentId: number;
  type: string;
}

const validationSchema = Yup.object().shape({
  fullname: Yup.string().required("لطفا نام کامل خود را وارد کنید"),
  nationalityCode: Yup.string().required("لطفا کد ملی خود را وارد کنید"),
  personalCode: Yup.string().required("لطفا کد کاربری خود را وارد کنید"),
  fatherName: Yup.string().required("لطفا نام پدر را وارد کنید"),
  phoneNumber: Yup.string().required("لطفا شماره تلفن همراه خود را وارد کنید"),
  username: Yup.string().required("لطفا نام کاربری خود را وارد کنید"),
  password: Yup.string().required("لطفا رمز عبور خود را وارد کنید"),
  locationId: Yup.string().required("شهر معتبر را انتخاب کنید"),
  address: Yup.string().required("لطفا آدرس خود را وارد کنید"),
  city: Yup.string().required("لطفا شهر را انتخاب کنید"),
  province: Yup.string().required("لطفا استان را انتخاب کنید"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "رمز عبور و تکرار آن مطابقت ندارند")
    .required("لطفا رمز عبور جدید خود را تایید کنید"),
});

const initialValues = {
  username: "",
  password: "",
  fullname: "",
  nationalityCode: "",
  personalCode: "",
  fatherName: "",
  phoneNumber: "",
  locationId: null as number | null,
  address: "",
  province: "",
  city: "",
  confirmPassword: "",
};

const RegisterForm = ({ isOpen, onClose }: Props) => {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(
    null
  );

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await api.post("/locations/type", {
          locationType: "STATE",
        });

        setProvinces(res.data.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("خطا در دریافت اطلاعات استان", { style: errorStyle });
      }
    };

    if (isOpen) {
      fetchProvinces();
      setCities([]);
      setSelectedProvince(null);
    }
  }, [isOpen]);

  const fetchCities = async (provinceId: string | number) => {
    try {
      const res = await api.get(`/locations/parent/${provinceId}`);
      setCities(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت اطلاعات شهرها", { style: errorStyle });
    }
  };

  // Sync cities on province change
  useEffect(() => {
    if (selectedProvince) {
      fetchCities(selectedProvince.id);
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  return (
    <Modal
      isOpen={!!isOpen}
      onRequestClose={onClose}
      className="bg-white py-6 px-4 rounded-lg w-[600px] shadow-lg flex justify-center items-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center backdrop-blur-[2px]"
    >
      <div className="w-full font-iransans">
        <h1 className="text-center text-xl">ثبت نام کاربر</h1>
        <div className="border-b border-black mt-2"></div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const cleanedValues = omit(values, [
              "province",
              "city",
              "confirmPassword",
            ]) as Omit<
              typeof values,
              "province" | "city" | "confirmPassword"
            > & { locationId: string | number };
            if (cleanedValues.locationId == null) {
              toast.error("شهر معتبر را انتخاب کنید", {
                style: errorStyle,
              });
              setSubmitting(false);
              return;
            }
            try {
              const response = await register(cleanedValues);
              toast.success(response.message || "ثبت نام با موفقیت انجام شد", {
                style: successStyle,
              });
              onClose?.();
            } catch (error: any) {
              const fieldErrors: Record<string, string> = {};

              if (Array.isArray(error?.message)) {
                for (const msg of error.message) {
                  if (msg.includes("نام کامل")) fieldErrors.fullname = msg;
                  else if (msg.includes("کد ملی"))
                    fieldErrors.nationalityCode = msg;
                  else if (msg.includes("کد پرسنلی"))
                    fieldErrors.personalCode = msg;
                  else if (msg.includes("پدر")) fieldErrors.fatherName = msg;
                  else if (msg.includes("تلفن")) fieldErrors.phoneNumber = msg;
                  else if (msg.includes("نام کاربری"))
                    fieldErrors.username = msg;
                  else if (msg.includes("رمز عبور") && !msg.includes("تکرار"))
                    fieldErrors.password = msg;
                  else if (msg.includes("تکرار"))
                    fieldErrors.confirmPassword = msg;
                  else if (msg.includes("آدرس")) fieldErrors.address = msg;
                  else if (msg.includes("استان")) fieldErrors.province = msg;
                  else if (msg.includes("شهر")) fieldErrors.city = msg;
                }

                setErrors(fieldErrors); // show mapped errors under fields
              } else {
                toast.error(error?.message || "خطا در ثبت نام", {
                  style: errorStyle,
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form
              className="w-full grid grid-cols-2 gap-1 mt-2"
              style={{ direction: "rtl" }}
              autoComplete="off"
            >
              {/* Trick autofill */}
              <input
                type="text"
                name="fake-username"
                autoComplete="username"
                style={{ display: "none" }}
              />
              <input
                type="password"
                name="fake-password"
                autoComplete="new-password"
                style={{ display: "none" }}
              />
              <UsernameField
                label="نام و نام خانوادگی"
                name="fullname"
                placeholder="نام و نام خانوادگی"
              />
              <UsernameField
                label="نام پدر"
                name="fatherName"
                placeholder="نام پدر"
              />
              <UsernameField
                label="کد ملی"
                name="nationalityCode"
                placeholder="کد ملی"
              />
              <UsernameField
                label="شماره همراه"
                name="phoneNumber"
                placeholder="شماره همراه"
              />
              <SelectField
                name="province"
                label="استان"
                options={provinces.map((p) => ({
                  label: p.label,
                  value: p.id,
                }))}
                placeholder="استان را انتخاب کنید"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selected =
                    provinces.find((p) => p.id === selectedId) || null;
                  setFieldValue("province", e.target.value);
                  setSelectedProvince(selected);
                  setFieldValue("city", "");
                  setFieldValue("locationId", "");
                }}
              />

              <SelectField
                name="city"
                label="شهر"
                options={cities.map((city) => ({
                  label: city.label,
                  value: city.id,
                }))}
                placeholder="شهر را انتخاب کنید"
                onChange={(e) => {
                  const cityId = e.target.value;
                  const selectedCity = cities.find((c) => c.id === cityId);
                  setFieldValue("city", e.target.value);
                  setFieldValue("locationId", selectedCity?.id || "");
                }}
              />

              <UsernameField
                label="نام کاربری"
                name="username"
                placeholder="نام کاربری"
              />
              <UsernameField
                label="کد کاربری"
                name="personalCode"
                placeholder="کد کاربری"
              />
              <PasswordField
                label="رمز عبور"
                name="password"
                placeholder="رمز عبور"
              />
              <PasswordField
                label="تکرار رمز عبور"
                name="confirmPassword"
                placeholder="تکرار رمز عبور"
              />

              <div className="col-span-2">
                <UsernameField label="آدرس" name="address" placeholder="آدرس" />
              </div>

              <div className="col-span-2 flex justify-between mt-4 w-full gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded w-full"
                >
                  ثبت نام
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-red-500 text-red-500 rounded w-full"
                >
                  انصراف
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default RegisterForm;

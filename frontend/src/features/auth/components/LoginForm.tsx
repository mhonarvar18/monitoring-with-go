import { Formik, Form } from "formik";
import * as Yup from "yup";
import { login } from "../authService";
import { useNavigate } from "react-router";
import UsernameField from "./UsernameField";
import PasswordField from "./PasswordField";
import type { LoginFormValues } from "../types";
import Button from "../../../components/Button/Button";
import Indicator from "../../../components/indicatorSetter/indicatorSetter";
import { toast } from "react-hot-toast";
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import ForgotPassForm from "./ForgotPassForm";
import { errorStyle, successStyle } from "../../../types/stylesToast";
import { useUserStore } from "../../../store/useUserStore";
import { fetchUserInfo } from "../../../services/userInfo.service";
import { useUserPermissionStore } from "../../../store/useUserPermissionStore";
import { fetchUserAssignedPermissions } from "../../../services/permission.service";
import { useHeartbeat } from "../../../hooks/useHeartbeat";

const initialValues: LoginFormValues = {
  username: "",
  password: "",
};

interface LoginFormProps {
  dynamicRoute?: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required("نام کاربری الزامی است"),
  password: Yup.string().required("رمز عبور الزامی است"),
});

const LoginForm: React.FC<LoginFormProps> = ({ dynamicRoute }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<
    "register" | "forgotPass" | null
  >(null);
  const navigate = useNavigate();
  const setUserInfo = useUserStore((s) => s.setUserInfo);
  const setAssignedPermissions = useUserPermissionStore(
    (s) => s.setAssignedPermissions
  );
  const { mutate: sendHeartbeat } = useHeartbeat();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const userInfo = await login(values);
      toast.success("ورود با موفقیت انجام شد", {
        style: successStyle,
      });
      
      setUserInfo(userInfo);
      // NEW: fetch and store user permissions globally
      if (userInfo && userInfo.id) {
        const assignedPermissions = await fetchUserAssignedPermissions(
          userInfo.id
        );
        setAssignedPermissions(assignedPermissions);
      }
      sendHeartbeat(userInfo.id);
      navigate(`/${dynamicRoute}/dashboard/pazhonic`);
    } catch (err: any) {
      toast.error(err.message, {
        style: errorStyle,
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            className="w-full flex flex-col justify-center items-center"
            style={{ direction: "rtl" }}
          >
            <UsernameField />
            <br />
            <PasswordField />
            <div className="w-full flex flex-row-reverse gap-4 mt-6">
              <Button
                type="button"
                className="w-full py-3 border-[#09a1a4] text-[#09a1a4]"
                onClick={() => setIsRegisterModalOpen("register")}
              >
                ثبت نام
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full border py-3 border-[#09a1a4] bg-btns text-white hover:bg-transparent hover:text-[#09a1a4] transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Indicator size={16} color="black" type="dots" />
                  </>
                ) : (
                  <>ورود</>
                )}
              </Button>
            </div>
            <div
              onClick={() => setIsRegisterModalOpen("forgotPass")}
              className="w-fit flex justify-center items-center text-xs mt-2 text-right text-[#09a1a4] cursor-pointer hover:border-b border-blue"
            >
              <span className="text-base">فراموشی رمز عبور</span>
            </div>
          </Form>
        )}
      </Formik>
      {isRegisterModalOpen === "register" && (
        <RegisterForm
          isOpen={true}
          onClose={() => setIsRegisterModalOpen(null)}
        />
      )}
      {isRegisterModalOpen === "forgotPass" && (
        <ForgotPassForm
          isOpen={true}
          onClose={() => setIsRegisterModalOpen(null)}
        />
      )}
    </>
  );
};

export default LoginForm;

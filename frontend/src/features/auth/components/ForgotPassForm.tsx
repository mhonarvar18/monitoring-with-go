import Modal from "react-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import FormModal from "../../../components/Modals/FormModal";
import {
  forgotPassSchema,
  forgotPassYupSchema,
} from "../../../formSchema/forgotPassSchema";
import { useResetPassword } from "../../../hooks/useResetPassword";
import type { AxiosError } from "axios";
import { errorStyle, successStyle } from "../../../types/stylesToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPassForm = ({ isOpen, onClose }: Props) => {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { resetPassword } = useResetPassword({
    onSuccess: () => {
      toast.success("success", { style: successStyle });
      setServerErrors({});
      onClose(); // CLOSE ONLY ON SUCCESS
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string[] | string }>;
      const messages = err.response?.data?.message ?? [];
      const fieldErrors: Record<string, string> = {};
      const unhandledMessages: string[] = [];

      for (const msg of messages) {
        if (msg.includes("نام کاربری")) {
          fieldErrors.username = fieldErrors.username
            ? `${fieldErrors.username}\n${msg}`
            : msg;
        } else if (msg.includes("رمز عبور")) {
          fieldErrors.password = fieldErrors.password
            ? `${fieldErrors.password}\n${msg}`
            : msg;
        } else if (msg.includes("شماره تلفن")) {
          fieldErrors.phoneNumber = fieldErrors.phoneNumber
            ? `${fieldErrors.phoneNumber}\n${msg}`
            : msg;
        } else {
          unhandledMessages.push(msg); // collect general errors
        }
      }

      if (unhandledMessages.length > 0) {
        toast.error(unhandledMessages.join(""), { style: errorStyle }); // show as single toast
      }

      setServerErrors(fieldErrors); //  pass field-specific errors to your form
    },
  });

  const handleSubmit = async (data) => {
    const { confirmedPassword: _, ...payload } = data;
    await resetPassword(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white py-6 px-4 rounded-lg w-[500px] shadow-lg flex justify-center items-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center backdrop-blur-[2px]"
    >
      <FormModal
        isOpen={true}
        onRequestClose={onClose}
        title="بازیابی رمز عبور"
        schema={forgotPassSchema}
        initialData={null}
        validationSchema={forgotPassYupSchema}
        onSubmit={handleSubmit}
        serverErrors={serverErrors}
      />
    </Modal>
  );
};

export default ForgotPassForm;

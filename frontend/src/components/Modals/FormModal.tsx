import ReactModal from "react-modal";
import type { FormSchema } from "../Form/formSchema";
import { DynamicForm } from "../Form/DynamicForm";
import { useState, useEffect } from "react";
import * as Yup from "yup";

ReactModal.setAppElement("#root");

export interface FormModalProps<T> {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  schema: FormSchema<T>;
  initialData?: T;
  onSubmit: (data: T) => Promise<void> | void;
  validationSchema?: Yup.ObjectSchema<any>;
  serverErrors?: Record<string, string>;
}

function FormModal<T>({
  isOpen,
  onRequestClose,
  title,
  schema,
  initialData,
  onSubmit,
  validationSchema,
  serverErrors = {},
}: FormModalProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  
  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    // setSubmittedSuccessfully(false);
    try {
      const result = onSubmit(data);
      if (result instanceof Promise) {
        await result;
      }
      // setSubmittedSuccessfully(true); // Flag success
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }

  };

  //  Close modal only after successful submit & no serverErrors
  // useEffect(() => {
  //   if (submittedSuccessfully && Object.keys(serverErrors).length === 0) {
  //     onRequestClose();
  //   }
  // }, [submittedSuccessfully, serverErrors, onRequestClose]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      className="bg-white rounded-[15px] py-5 px-3 w-[30%] h-auto font-[iransans] rtl"
    >
      <div className="w-full text-right flex justify-between items-center mb-4">
        <h2 className="w-full text-xl font-semibold text-right">{title}</h2>
      </div>

      <DynamicForm<T>
        schema={schema}
        item={initialData}
        onSubmit={handleSubmit}
        onCancel={onRequestClose}
        validationSchema={validationSchema}
        serverErrors={serverErrors}
        isSubmitting = {isSubmitting}
      />
    </ReactModal>
  );
}

export default FormModal;

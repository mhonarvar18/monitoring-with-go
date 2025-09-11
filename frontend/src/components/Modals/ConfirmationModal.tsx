import type { ReactNode } from "react";
import ReactModal from "react-modal";
import Button from "../Button";

ReactModal.setAppElement("#root");

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "تأیید عملیات",
  message = "آیا مطمئن هستید؟",
  confirmLabel = "تأیید",
  cancelLabel = "انصراف",
  danger = false,
}) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onCancel}
    contentLabel={title}
    overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    className="bg-white rounded-[15px] py-6 px-3 w-[28%] h-auto font-[iransans]"
    shouldCloseOnOverlayClick
  >
    <div className="flex flex-col gap-4" dir="rtl">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="text-base">{message}</div>
      <div className="flex justify-end gap-2">
        <Button
          className={`w-1/2 px-4 py-3 rounded border ${
            danger
              ? "bg-red-600 text-white"
              : "bg-btns text-white hover:border-[#09a1a4]  hover:bg-transparent hover:text-[#09a1a4] transition-all"
          }`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button
          className="w-1/2 px-4 py-3 rounded border border-[#09a1a4] "
          onClick={onCancel}
        >
          <span className="text-[#09a1a4]">{cancelLabel}</span>
        </Button>
      </div>
    </div>
  </ReactModal>
);

export default ConfirmationModal;

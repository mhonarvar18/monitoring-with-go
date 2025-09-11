import Modal from "react-modal";
import RegisterForm from "../../../features/auth/components/RegisterForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function RegisterModal({ isOpen, onClose }: Props) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white py-6 px-4 rounded-lg w-[600px] shadow-lg flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center backdrop-blur-[2px]"
      >
        <RegisterForm />
      </Modal>
    </>
  );
}

export default RegisterModal;

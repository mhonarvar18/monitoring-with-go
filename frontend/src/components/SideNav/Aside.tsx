import { FiX } from "react-icons/fi";
import PazhLogo from "../../assets/icons/PazhLogo";
import PazhLogoTypo from "../../assets/icons/PazhLogoTypo";
import { GrPowerShutdown } from "react-icons/gr";
import RenderNavItems from "./RenderNavItems";
import Button from "../Button";
import { logout } from "../../features/auth/authService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";
const Aside = ({
  isMobile,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { message } = await logout();
      toast.success(message, {
       style: successStyle
      });
    } catch (err: any) {
      toast.error(err.message, {
         style: errorStyle
      });
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <aside
      className={`bg-white py-4 h-full overflow-y-auto w-full font-[iransans] flex flex-col justify-between items-center gap-[4%] ${
        isMobile
          ? "fixed inset-y-0 right-0 z-50 transform transition-transform"
          : "h-full border-l"
      }`}
    >
      {isMobile && (
        <div className="flex justify-end mb-4">
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
      )}
      <div className="w-full flex justify-center items-center gap-2 px-6">
        <div className="w-fit flex flex-col justify-center items-end gap-2">
          <span className="text-right">
            <PazhLogoTypo />
          </span>
          <span>سامانه هوشمند تجمیع آلارم</span>
        </div>
        <PazhLogo />
      </div>
      <nav className="w-full h-full text-right px-4">
        <RenderNavItems />
      </nav>
      <div className="w-full h-fit flex flex-col justify-start items-center gap-[5%]">
        <Button
          className="w-full flex justify-end items-center bg-btn-logout py-3 px-6 gap-2 border-0 rounded-none"
          onClick={handleLogout}
        >
          <span className="text-[#F2485D]">خروج از حساب</span>
          <span>
            <GrPowerShutdown size={20} color="#F2485D" />
          </span>
        </Button>
        <div className=""></div>
      </div>
    </aside>
  );
};

export default Aside;

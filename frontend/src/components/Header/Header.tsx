import { FiMenu } from "react-icons/fi";
import NotificationButton from "../NotificationButton";
import FullScreenButton from "../FullScreenButton";
import HeaderClock from "../HeaderClock";
import { useUserStore } from "../../store/useUserStore";
import AvatarMenu from "../AvatarMenu/AvatarMenu";
import { motion } from "framer-motion";
import KeshavarziLogo from "../../assets/images/kesh.png";
import SepahLogo from "../../assets/images/sepah.png";
import TosseeLogo from "../../assets/images/Tosseh.svg";
import IranzaminLogo from "../../assets/images/IranZamin.png";

interface HeaderProps {
  bank?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ bank, onMenuClick }) => {
  const fullname = useUserStore((state) => state.userInfo?.fullname);

  let logoSrc = IranzaminLogo;
  let bankName = "بانک ایران زمین";

  if (bank === "keshavarzi") {
    logoSrc = KeshavarziLogo;
    bankName = "بانک کشاورزی";
  } else if (bank === "sepah") {
    logoSrc = SepahLogo;
    bankName = "بانک سپه";
  } else if (bank === "tossee") {
    logoSrc = TosseeLogo;
    bankName = "بانک توسعه تعاون";
  }

  return (
    <>
      <header className="bg-white flex items-center justify-between h-full font-[iransans]">
        <div
          className="w-full h-full pl-4 flex justify-start items-center gap-2 text-sm text-gray-700 bg-header-left"
          style={{
            borderRadius: "0px 100px 0px 0px",
          }}
        >
          <div className="flex flex-row-reverse justify-center items-center gap-1">
            <AvatarMenu />
          </div>
          <div className="flex items-center justify-center gap-4">
            <NotificationButton />
            <FullScreenButton />
            <HeaderClock />
          </div>
        </div>
        <div
          className="w-full pr-4 h-full flex justify-end items-center gap-6 bg-header-right"
          style={{
            borderRadius: "0px 0px 0px 100px",
          }}
        >
          <div className="h-full flex flex-row-reverse justify-start items-center gap-2">
            <motion.img
              src={logoSrc}
              alt={bankName}
              width={40}
              height={40}
              animate={{
                rotateY: [0, 360],
                scale: [1, 1.05, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut",
              }}
            />
            <span className="font-semibold">{bankName}</span>
          </div>
          <button className="xl:hidden" onClick={onMenuClick}>
            <FiMenu size={24} />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;

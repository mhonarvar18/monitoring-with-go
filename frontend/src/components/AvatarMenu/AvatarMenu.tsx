import { useState, useRef, useEffect } from "react";
import userAvatar from "../../assets/images/user.avif"; // یا هر عکسی
import { useUserStore } from "../../store/useUserStore";
import { IoMdExit } from "react-icons/io";
import { logout } from "../../features/auth/authService";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";
import { useNavigate } from "react-router";

const AvatarMenu: React.FC = () => {
  const navigate = useNavigate()
  const { userInfo, clearUserInfo } = useUserStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = userInfo?.avatarUrl || userAvatar; // fallback
  const fullname = userInfo?.fullname || "بدون نام";
  const image = `${import.meta.env.VITE_API_URL}${avatarUrl}`;

  const handleLogout = async () => {
    try {
      const { message } = await logout();
      toast.success(message, {
        style: successStyle,
      });
      clearUserInfo()
    } catch (err: any) {
      toast.error(err.message, {
        style: errorStyle,
      });
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="relative" ref={menuRef} dir="rtl">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded-full transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="پروفایل کاربر"
      >
        <img
          src={image}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
        <span className="font-bold text-base">{fullname}</span>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl rounded-xl z-50 border border-gray-200 animate-dropdown"
          style={{ fontFamily: "iransans" }}
        >
          <div className="p-4 flex h-full items-center gap-2 border-b">
            <img
              src={image}
              alt="avatar"
              className="min-w-14 min-h-14 max-w-14 max-h-14 rounded-full object-cover border border-gray-200"
            />
            <div className="w-full flex flex-col justify-between items-start gap-2">
              <div className="flex justify-start items-center gap-1">
                <span>نام: </span>
                <span className="">{fullname}</span>
              </div>
              <div className="flex justify-start items-center gap-1">
                <span>نام کاربری: </span>
                <span>{userInfo?.username}</span>
              </div>
            </div>
          </div>
          <ul className="py-2">
            <li
              className="px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-1 text-sm cursor-pointer"
              onClick={handleLogout}
            >
              <IoMdExit /> خروج
            </li>
          </ul>
        </div>
      )}

      {/* Animation for dropdown */}
      <style>{`
        .animate-dropdown {
          animation: scaleIn 0.2s ease-out forwards;
          transform-origin: top right;
        }
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AvatarMenu;

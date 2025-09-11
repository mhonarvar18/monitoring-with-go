import { MdExitToApp, MdEdit } from "react-icons/md";
import type { UserInfo } from "../../../services/userInfo.service";
import ProfileImage from "../../../assets/images/profile-one.jfif";
import DefaultAvatar from "../../../assets/images/user.avif";
import Button from "../../Button";
import { GrPowerShutdown } from "react-icons/gr";
import { logout } from "../../../features/auth/authService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { toPersianDigits } from "../../../utils/numberConvert";
import { errorStyle, successStyle } from "../../../types/stylesToast";

interface Props {
  user: UserInfo;
  onEditAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
  avatarVersion: any;
}

export function ProfileHeader({ user, onEditAvatar, avatarVersion }: Props) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { message } = await logout();
      toast.success(message, {
        style: successStyle,
      });
    } catch (err: any) {
      toast.error(err.message, {
        style: errorStyle,
      });
    } finally {
      navigate("/", { replace: true });
    }
  };

  const avatarSrc = user.avatarUrl
    ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}?v=${avatarVersion}`
    : DefaultAvatar;

  return (
    <div className="w-full rounded-3xl h-auto pb-8 bg-gradient-to-br from-white via-white to-slate-50 shadow border border-slate-100/50 backdrop-blur-sm">
      {/* Header Background with Overlay */}
      <div className="relative w-full h-[120px] overflow-hidden">
        <img
          src={ProfileImage}
          alt=""
          className="w-full h-full object-cover rounded-tr-3xl rounded-tl-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-tr-3xl rounded-tl-3xl"></div>
      </div>

      {/* Avatar Section */}
      <div className="relative flex justify-start px-8 -mt-16">
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-white to-slate-50 p-1 shadow-xl border-4 border-white">
            <div className="w-full h-full rounded-[20px] overflow-hidden bg-slate-100">
              <img
                src={avatarSrc}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <input
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/*"
            onChange={onEditAvatar}
          />

          {/* Edit Button with Modern Hover Effects */}
          <div
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-white group-hover:from-purple-600 group-hover:to-pink-600"
            onClick={() => {
              document.getElementById("profile-upload")?.click();
            }}
          >
            <MdEdit size={18} className="text-white" />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-8 mt-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          {/* User Info */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-start items-center gap-2">
              <div className="flex justify-start items-start gap-2">
                <div className="w-[10vw] bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/50 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium text-nowrap">
                      نام کاربری
                    </span>
                    <span className="font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg text-nowrap">
                      {user.username}
                    </span>
                  </div>
                </div>
                <div className="w-[10vw] bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/50 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">
                      نوع کاربری
                    </span>
                    <span className="font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg">
                    {user.type === "OWNER"
                      ? "مالک"
                      : user.type === "SUPER_ADMIN"
                      ? "اپراتور ارشد"
                      : user.type === "ADMIN"
                      ? "اپراتور"
                      : user.type === "USER"
                      ? "کاربر"
                      : ""}
                  </span>
                  </div>
                </div>
                <div className="w-[12vw] bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/50 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-nowrap text-slate-500 font-medium">
                      کد پرسنلی
                    </span>
                    <span className="font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg">
                      {toPersianDigits(user.personalCode)}
                    </span>
                  </div>
                </div>
                <div className="w-[12vw] bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/50 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-nowrap text-slate-500 font-medium">
                      آی پی
                    </span>
                    <span className="font-mono font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg">
                      {user.ip}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <Button
              className="group relative overflow-hidden border-2 border-red-200 hover:border-red-300 px-6 py-4 text-nowrap flex justify-center items-center gap-3 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              onClick={handleLogout}
            >
              <span className="text-red-600 font-medium group-hover:text-red-700 transition-colors">
                خروج از حساب
              </span>
              <GrPowerShutdown
                color="#DC2626"
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

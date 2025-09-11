import { useUserInfo } from "../../hooks/useUserInfo";
import { ProfileHeader } from "../../components/ProfileComponents/ProfileHeader/ProfileHeader";
import { ProfileDetails } from "../../components/ProfileComponents/ProfileDetail/ProfileDetail";
import LoadingSpinner from "../../components/LoadingSpinner";
import ProfileSetting from "../../components/ProfileComponents/ProfileSetting/ProfileSetting";
import { useUpdateUserInfo } from "../../hooks/useUserSetting";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { UserInfo } from "../../services/userInfo.service";
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { usePersonalSetting } from "../../hooks/usePersonalSetting";
import { errorStyle, successStyle } from "../../types/stylesToast";

const Profile: React.FC = () => {
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const { userInfo, loading, error, refetch } = useUserInfo(); // Get user info and refetch capability
  const setUserInfoInStore = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    if (userInfo) {
      setUserInfoInStore(userInfo); // sync to Zustand
    }
  }, [userInfo]);

  const { updateUserInfo } = useUpdateUserInfo({
    onSuccess: () => {
      // Refetch user info on successful update
      refetch();
      setAvatarVersion(Date.now()); // update version to bust cache
    },
    onError: (error: unknown) => {
      // Show detailed error if it's an Axios error
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message?.[0] || "خطایی رخ داده است", {
          style: errorStyle,
        });
      } else {
        // Fallback for unknown errors
        toast.error("خطای ناشناخته‌ای رخ داده است", { style: errorStyle });
      }
    },
  });

  const handleEditAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userInfo) return; // اضافه شد
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("هیچ فایلی انتخاب نشده است", { style: errorStyle });
      return;
    }

    const formData = new FormData();
    formData.append("nationalityCode", userInfo.nationalityCode);
    formData.append("file", file);

    updateUserInfo(userInfo.id, formData);
  };

  const handleFieldEdit = (field: Partial<UserInfo>) => {
    if (!userInfo) return;
    updateUserInfo(userInfo.id , field);
  };

  const { editPersonalSetting } = usePersonalSetting({
    onSuccess: () =>
      toast.success("تنظیمات با موفقیت ذخیره شد", { style: successStyle }),
    onError: (err) => {
      const msg = err.response?.data?.message;
      const errorMessage = Array.isArray(msg)
        ? msg.join("\n")
        : msg || "خطایی رخ داده است";
      toast.error(errorMessage, {
        style: errorStyle,
      });
    },
  });

  const handleEditPersoanlSetting = async (data) => {
    return editPersonalSetting(data);
  };

  if (loading)
    return (
      <p className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </p>
    );

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (!userInfo) return null;

  return (
    <>
      <div className="w-full h-auto overflow-y-auto font-[iransans]" dir="rtl">
        <div className="w-full h-full flex flex-col justify-start items-center px-4 lg:pt-5 2xl:pt-7 gap-2 pb-8">
          {/* Profile header with user avatar and name */}
          <ProfileHeader
            user={userInfo}
            onEditAvatar={(e) => handleEditAvatar(e)}
            avatarVersion={avatarVersion}
          />
          {/* User details section */}
          <div className="w-full bg-white rounded-2xl shadow">
            <ProfileDetails user={userInfo} onUpdate={handleFieldEdit} />
          </div>
          {/* Settings related to user events */}
          <ProfileSetting
            userId={userInfo.id}
            onEditPersonalSetting={handleEditPersoanlSetting}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;

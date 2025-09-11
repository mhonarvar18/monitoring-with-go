import { FaPlus } from "react-icons/fa6";
import Button from "../../Button";
import { useUserSettings } from "../../../hooks/useUserSettings";
import { SettingCard } from "./SettingCard";
import toast from "react-hot-toast";
import {
  useCreateNewEvent,
  useDeleteSettingCard,
  useEditEvent,
  type NewEvent,
} from "../../../hooks/userSettingActions";
import { useEffect, useState } from "react";
import EventSettingModal from "../../Modals/EventSettingModal";
import ConfirmationModal from "../../Modals/ConfirmationModal";
import {
  fetchPersonalSettings,
  type PersonalSettingPayload,
} from "../../../hooks/usePersonalSetting";
import { usePersonalSettingStore } from "../../../store/usePersonalSettingStore";
import type { UserSetting } from "../../../services/userSetting.service";
import { errorStyle, successStyle } from "../../../types/stylesToast";

interface Props {
  onEditPersonalSetting: (data: PersonalSettingPayload) => void;
  userId: string | number;
}

const ProfileSetting = ({ onEditPersonalSetting, userId }: Props) => {
  // Fetch user settings along with loading/error state and refetch method
  const { settings, loading, error, refetch } = useUserSettings();
  const [isModalOpen, setIsModalOpen] = useState<
    "create" | "edit" | "color" | "audio" | null
  >(null); // Modal state to determine which modal is currently open

  // State to hold the event being edited
  const [editEventCard, setEditEventCard] = useState<UserSetting | undefined>();

  // Controlled states for toggling color and sound settings
  const [colorEnabled, setColorEnabled] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const [pendingToggleKey, setPendingToggleKey] = useState<
    "color" | "audio" | null
  >(null); // Keeps track of which toggle (color or audio) is awaiting confirmation

  const setPersonalSettingInStore = usePersonalSettingStore(
    (state) => state.setPersonalSetting
  ); // Zustand store method to update personal settings locally

  useEffect(() => {
    // Function to load personal settings from API on component mount or when userId changes
    const loadSettings = async () => {
      try {
        // Fetch all personal settings for the current user
        const settings = await fetchPersonalSettings();
        // Iterate over each setting and update local state accordingly
        settings.forEach((setting) => {
          // Convert string value to boolean
          const value = setting.value === "true";
          // Update local state based on setting key
          if (setting.key === "color") setColorEnabled(value);
          if (setting.key === "audio") setSoundEnabled(value);

          // Optionally update Zustand store with the latest setting
          setPersonalSettingInStore(setting);
        });
      } catch (err) {
        // Log error if fetching settings fails
        console.error("Failed to fetch personal settings", err);
      }
    };
    loadSettings();
  }, [userId, fetchPersonalSettings, setPersonalSettingInStore]);

  // Delete event mutation with success and error handling
  const { deleteSetting } = useDeleteSettingCard({
    onSuccess: async () => {
      toast.success("رویداد با موفقیت حذف شد", {
        style: successStyle,
      });
      await refetch();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message, { style: errorStyle });
    },
  });

  // Create event mutation with success and error handling
  const { createNewEvent } = useCreateNewEvent({
    onSuccess: async () => {
      toast.success("تنظیمات شما با موفقیت ثبت شد", {
        style: successStyle,
      });
      await refetch();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message, { style: errorStyle });
    },
  });

  // Edit event mutation with success and error handling
  const { editEvent } = useEditEvent({
    onSuccess: async () => {
      toast.success("تنظیمات کاربر با موفقیت به‌روزرسانی شد", {
        style: successStyle,
      });
      await refetch();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message, { style: errorStyle });
    },
  });

  // Handler for creating new event settings
  const handleCreateNewEvent = async (formData: NewEvent) => {
    await createNewEvent(formData);
    setIsModalOpen(null);
  };

  // Handler for editing existing event settings
  const handleEdit = async (formData: NewEvent, id?: string | number) => {
    if (id == null) {
      console.error("No event ID provided to editEvent");
      return;
    }
    // Now TS knows `id` is a number, not undefined
    await editEvent(formData, id);
    setIsModalOpen(null);
  };

  // Handler for deleting an event setting
  const handleDelete = (id: string) => {
    deleteSetting(id);
  };

  // Triggered when user attempts to toggle color or audio checkbox
  // Opens a confirmation modal
  const onToggleAttempt = (key: "color" | "audio") => {
    setPendingToggleKey(key);
    setIsModalOpen(key);
  };

  // Called when user confirms toggle change in modal
  const onConfirmToggle = async () => {
    if (!pendingToggleKey) return;

    const currentlyEnabled =
      pendingToggleKey === "color" ? colorEnabled : soundEnabled;
    const newValue = !currentlyEnabled;

    const payload: PersonalSettingPayload = {
      key: pendingToggleKey,
      userId,
      value: newValue ? "true" : "false",
    };

    try {
      await onEditPersonalSetting(payload);

      setPersonalSettingInStore(payload);

      if (pendingToggleKey === "color") setColorEnabled(newValue);
      else if (pendingToggleKey === "audio") setSoundEnabled(newValue);
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalOpen(null);
      setPendingToggleKey(null);
    }
  };

  // Cancel toggle confirmation modal
  const onCancelToggle = () => {
    setIsModalOpen(null);
    setPendingToggleKey(null);
  };

  return (
    <div className="w-full space-y-8">
      {/* Section for color and sound toggles on Iran map */}
      <div className="w-full bg-gradient-to-br from-white via-white to-slate-50 rounded-3xl shadow-xl border border-slate-200/50 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
            تنظیمات رنگ و صدا در صفحه نقشه ایران
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Color toggle card */}
          <div className="relative group bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-8 border-2 border-emerald-100/50 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold text-slate-800">
                      چشمک زدن بر اساس رویداد
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    فعال‌سازی نمایش بصری برای رویدادهای تایید نشده در نقشه
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
                      colorEnabled
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {colorEnabled ? "فعال" : "غیرفعال"}
                  </span>
                </div>

                <div
                  className="relative cursor-pointer group/switch"
                  onClick={() => onToggleAttempt("color")}
                >
                  <div
                    className={`w-20 h-10 rounded-full transition-all duration-500 shadow-inner ${
                      colorEnabled
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-emerald-200"
                        : "bg-gradient-to-r from-slate-300 to-slate-400 shadow-slate-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-500 flex items-center justify-center transform group-hover/switch:scale-110 ${
                        colorEnabled ? "translate-x-10" : "translate-x-0"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          colorEnabled ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio toggle card */}
          <div className="relative group bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-8 border-2 border-blue-100/50 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold text-slate-800">
                      پخش صدا بر اساس رویداد
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    فعال‌سازی هشدار صوتی برای رویدادهای تایید نشده
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
                      soundEnabled
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {soundEnabled ? "فعال" : "غیرفعال"}
                  </span>
                </div>

                <div
                  className="relative cursor-pointer group/switch"
                  onClick={() => onToggleAttempt("audio")}
                >
                  <div
                    className={`w-20 h-10 rounded-full transition-all duration-500 shadow-inner ${
                      soundEnabled
                        ? "bg-gradient-to-r from-blue-400 to-indigo-500 shadow-blue-200"
                        : "bg-gradient-to-r from-slate-300 to-slate-400 shadow-slate-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-500 flex items-center justify-center transform group-hover/switch:scale-110 ${
                        soundEnabled ? "translate-x-10" : "translate-x-0"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          soundEnabled ? "bg-blue-500" : "bg-slate-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section for event color and sound settings */}
      <div className="w-full bg-gradient-to-br from-white via-white to-slate-50 rounded-3xl shadow-xl border border-slate-200/50 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
              تنظیمات رنگ و صدا رویداد ها
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
          </div>
          <Button
            onClick={() => setIsModalOpen("create")}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-4 rounded-2xl border-0 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="font-medium">ثبت رویداد جدید</span>
            <FaPlus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </Button>
        </div>

        {/* Display settings grid if loaded without error */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {settings.map((s) => (
              <SettingCard
                key={s.id}
                setting={s}
                onEdit={() => {
                  setEditEventCard(s);
                  setIsModalOpen("edit");
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">
                خطا در بارگذاری تنظیمات
              </p>
              <p className="text-red-500 text-sm mt-2">
                لطفاً دوباره تلاش کنید
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && settings.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-slate-600 font-medium mb-2">
                هیچ رویدادی یافت نشد
              </p>
              <p className="text-slate-500 text-sm">
                برای شروع، رویداد جدیدی ایجاد کنید
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for creating new event */}
      {isModalOpen === "create" && (
        <EventSettingModal
          isOpen={true}
          onClose={() => setIsModalOpen(null)}
          onSubmit={handleCreateNewEvent}
        />
      )}

      {/* Modal for editing event */}
      {isModalOpen === "edit" && (
        <EventSettingModal
          isOpen={true}
          onClose={() => setIsModalOpen(null)}
          onSubmit={handleEdit}
          isEdit={true}
          settings={editEventCard}
        />
      )}

      {/* Confirmation modal for toggling color or audio */}
      {(isModalOpen === "color" || isModalOpen === "audio") && (
        <ConfirmationModal
          isOpen={true}
          onCancel={onCancelToggle}
          onConfirm={onConfirmToggle}
          title="آیا مطمئن هستید؟"
          message="آیا مطمئن هستید که می‌خواهید این تغییرات را اعمال کنید؟"
        />
      )}
    </div>
  );
};

export default ProfileSetting;

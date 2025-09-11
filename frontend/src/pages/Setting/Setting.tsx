import React, { useEffect, useState } from "react";
import SupportSettingsCard from "./SupportSettingsCard";
import { useAppSettings } from "../../hooks/useAppSettings";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";

type SupportCard = {
  id: number;
  title: string;
  value: string;
};
type AppSetting = { id: number; key: string; value: string };

const Setting: React.FC = () => {
  // States for different settings
  const [supportCards, setSupportCards] = useState<SupportCard[]>([]);
  const [settingDescription, setSettingDescription] = useState("");
  const { updateAppSettings, fetchAppSettings } = useAppSettings();
  const [checkDuration, setCheckDuration] = useState("");
  const [ipValidationEnabled, setIpValidationEnabled] = useState(false);
  const [ipSetting, setIpSetting] = useState<AppSetting | null>(null);
  const [heartbeat, setHeartbeat] = useState<AppSetting | null>(null);
  const [supportInfo, setSupportInfo] = useState<AppSetting | null>(null);

  // Fetch and initialize settings on data load
  useEffect(() => {
    const settings = fetchAppSettings.data?.data?.data || [];

    const ip = settings.find((item) => item.key === "assignPermission");
    const hb = settings.find((item) => item.key === "heartbeat");
    const support = settings.find((item) => item.key === "supportInfo");

    setIpSetting(ip);
    setHeartbeat(hb);
    setSupportInfo(support);
    
    if (ip) setIpValidationEnabled(ip.value === "true");
    if (hb) setCheckDuration(hb.value);

    if (support) {
      try {
        const parsed = JSON.parse(support.value);
        const entries = Object.entries(parsed);
        if (entries.length > 0 && entries[0][0] === "توضیحات") {
          setSettingDescription(entries[0][1] as string);
        }
        const dynamicCards = entries.slice(1).map(([title, value], index) => ({
          id: index + 1,
          title,
          value: String(value ?? ""),
        }));
        setSupportCards(dynamicCards);
      } catch (e) {
        console.error("Failed to parse supportInfo JSON:", e);
      }
    }
  }, [fetchAppSettings.data]);

  // Create a single object from all support cards
  const generateSupportSettingsObject = () => {
    const result: Record<string, string> = {
      توضیحات: settingDescription, // include static توضیحات card
    };

    // Add all card key-values to the result object
    supportCards.forEach(({ title, value }) => {
      if (title && value) {
        result[title] = value;
      }
    });

    return result;
  };

  // Update specific card field by id
  const handleChange = (
    id: number,
    key: "title" | "value",
    newValue: string
  ) => {
    setSupportCards((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: newValue } : item))
    );
  };

  // Delete a card unless it's the last one
  const handleDelete = (id: number) => {
    setSupportCards((prev) => {
      if (prev.length === 0) return prev; // prevent deleting the last card
      return prev.filter((item) => item.id !== id);
    });
  };

  // Add a new empty setting card
  const handleAddSettingCard = () => {
    const newId = Math.max(0, ...supportCards.map((card) => card.id)) + 1;
    setSupportCards((prev) => [...prev, { id: newId, title: "", value: "" }]);
  };

  // Send updated supportInfo object
  const handleUpdateSupportSetting = () => {
    if (!supportInfo?.id) {
      toast.error("شناسه تنظیمات پشتیبانی یافت نشد", { style: errorStyle });
      return;
    }
    updateAppSettings.mutate(
      {
        settingId: supportInfo.id, // Now definitely number
        value: JSON.stringify(generateSupportSettingsObject()),
      },
      {
        onSuccess: () =>
          toast.success("تنظیمات با موفقیت بروزرسانی شد", {
            style: successStyle,
          }),
      }
    );
  };

  // Send updated check duration (heartbeat)
  const handleUpdateCheckDuration = () => {
    if (!heartbeat?.id) {
      toast.error("شناسه heartbeat یافت نشد", { style: errorStyle });
      return;
    }
    if (Number(checkDuration) < 2) {
      toast.error("مقدار نمیتواند از 2 کوچکتر باشد", { style: errorStyle });
    } else {
      updateAppSettings.mutate(
        {
          settingId: heartbeat.id,
          value: checkDuration,
        },
        {
          onSuccess: () =>
            toast.success("تنظیمات با موفقیت بروزرسانی شد", {
              style: successStyle,
            }),
        }
      );
    }
  };

  // Send updated IP validation toggle
  const handleToggleIpValidation = (checked: boolean) => {
    if (!ipSetting?.id) {
      toast.error("شناسه تنظیمات IP یافت نشد", { style: errorStyle });
      return;
    }
    setIpValidationEnabled(checked);
    updateAppSettings.mutate(
      {
        settingId: ipSetting.id,
        value: checked ? "true" : "false",
      },
      {
        onSuccess: () =>
          toast.success("تنظیمات با موفقیت بروزرسانی شد", {
            style: successStyle,
          }),
      }
    );
  };

  return (
    <div className="w-full h-full font-[iransans]" dir="rtl">
      <div className="w-full h-full pt-8 px-8">
        <div className="bg-gradient-to-br from-white via-white to-slate-50 rounded-3xl shadow-2xl border border-slate-200/50 p-8 flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                  تنظیمات سامانه
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-1"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            {/* System Settings Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🔧</span>
                </div>
                <h2 className="text-xl font-bold text-slate-700">
                  تنظیمات عمومی
                </h2>
              </div>

              {/* IP Validation Toggle */}
              <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-2xl p-6 border-2 border-emerald-100/50 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      اعتبارسنجی IP
                    </h3>
                    <p className="text-sm text-slate-500">
                      فعال‌سازی اعتبارسنجی IP برای ورود کاربران به سامانه
                    </p>
                  </div>
                  <div
                    className="relative cursor-pointer group/switch"
                    onClick={() =>
                      handleToggleIpValidation(!ipValidationEnabled)
                    }
                  >
                    <div
                      className={`w-16 h-8 rounded-full transition-all duration-500 shadow-inner ${
                        ipValidationEnabled
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-emerald-200"
                          : "bg-gradient-to-r from-slate-300 to-slate-400 shadow-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 flex items-center justify-center transform group-hover/switch:scale-110 ${
                          ipValidationEnabled
                            ? "translate-x-8"
                            : "translate-x-0"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            ipValidationEnabled
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heartbeat Input */}
              <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 rounded-2xl p-6 border-2 border-blue-100/50 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      مدت زمان چک کردن وضعیت کاربر (دقیقه)
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={checkDuration}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setCheckDuration(value);
                        }
                      }}
                      className="flex-1 p-4 border-2 border-blue-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-inner text-slate-700 placeholder-slate-400"
                      placeholder="مدت زمان به دقیقه"
                    />
                    <button
                      onClick={handleUpdateCheckDuration}
                      className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                    >
                      بروزرسانی
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Settings Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🛠️</span>
                </div>
                <h2 className="text-xl font-bold text-slate-700">
                  تنظیمات پشتیبانی
                </h2>
              </div>

              {/* Static info-only card */}
              <SupportSettingsCard
                isSetting={true}
                value={settingDescription}
                onValueChange={(val) => setSettingDescription(val)}
              />

              {/* Dynamic key-value cards */}
              <div className="space-y-4">
                {supportCards.map((card) => (
                  <SupportSettingsCard
                    key={card.id}
                    title={card.title}
                    value={card.value}
                    onTitleChange={(value) =>
                      handleChange(card.id, "title", value)
                    }
                    onValueChange={(value) =>
                      handleChange(card.id, "value", value)
                    }
                    onDeleteCard={() => handleDelete(card.id)}
                  />
                ))}
              </div>

              {/* Add Button */}
              <div className="flex justify-center items-center pt-4">
                <button
                  type="button"
                  onClick={handleAddSettingCard}
                  className="group flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                >
                  <span className="text-lg">اضافه کردن</span>
                  <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">
                    +
                  </span>
                </button>
              </div>

              {/* Submit Button for Support Info */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => handleUpdateSupportSetting()}
                  className="px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium text-lg"
                >
                  بروزرسانی تنظیمات پشتیبانی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;

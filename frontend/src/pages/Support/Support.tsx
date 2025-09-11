import { useEffect, useState } from "react";
import { fetchSupportInfo } from "../../services/readSetting.service";
import type { AppSetting, SupportInfo } from "../../services/readSetting.service";
import { toPersianDigits } from "../../utils/numberConvert";

const defaultSupportInfo: SupportInfo = {
  "شماره تماس دفتر تهران": "02186126349",
  "شماره تماس دفتر مشهد": "05137296162",
  "شماره فکس": "05137296162 داخلی 13",
  آدرس: "خراسان رضوی، مشهد، خیابان آبکوه، آبکوه 13، پلاک 3 زنگ 1",
  توضیحات: "در قسمت تنظیمات میتوانید شماره تماس، آدرس و توضیحات مناسب و موردنظر خود را وارد نمایید.",
};

interface SupportProps {
  darkMode?: boolean;
}

const Support: React.FC<SupportProps> = ({ darkMode }) => {
  const [supportInfo, setSupportInfo] = useState<SupportInfo>(defaultSupportInfo);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchSupportInfo();
        // Find the supportInfo setting
        const supportSetting = data.find((s: AppSetting) => s.key === "supportInfo");
        let info: SupportInfo;
        if (!supportSetting?.value) {
          info = { ...defaultSupportInfo };
        } else {
          try {
            const parsed = JSON.parse(supportSetting.value);
            const keys = Object.keys(parsed);
            const otherKeys = keys.filter((k) => k !== "توضیحات");
            const descRaw = parsed["توضیحات"];
            const desc = typeof descRaw === "string" ? descRaw.trim() : null;
            const hasDescKey = Object.prototype.hasOwnProperty.call(parsed, "توضیحات");

            if (
              otherKeys.length === 0 &&
              hasDescKey &&
              !desc
            ) {
              info = { ...defaultSupportInfo };
            } else if (otherKeys.length > 0) {
              info = { ...parsed };
              if (hasDescKey && !desc) {
                info["توضیحات"] = defaultSupportInfo["توضیحات"];
              }
            } else {
              info = { ...defaultSupportInfo, ...parsed };
            }
          } catch {
            info = { ...defaultSupportInfo };
          }
        }
        setSupportInfo(info);
      } catch (err) {
        setSupportInfo({ ...defaultSupportInfo });
        console.error("خطا در دریافت اطلاعات پشتیبانی", err);
      }
    })();
  }, []);

  const entries = Object.entries(supportInfo).filter(([label]) => label !== "توضیحات");
  const description = supportInfo?.["توضیحات"] || null;

  if (!entries.length) return null;

  // Get icon for each entry type
  const getIcon = (label: string) => {
    if (label.includes("تماس")) return "📞";
    if (label.includes("فکس")) return "📠";
    if (label.includes("آدرس")) return "📍";
    return "💬";
  };

  return (
    <div className="w-full h-full font-[iransans]" dir="rtl">
      <div className="w-full h-full lg:pt-2 lg:pb-2 3xl:pt-3 lg:px-4 2xl:px-4 flex flex-col justify-start items-center gap-8">
        
        {/* Contact Information Section */}
        <div className={`w-full p-8 flex flex-col justify-center items-start gap-8 rounded-3xl shadow-xl border transition-all duration-300 ${
          darkMode 
            ? "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700/50" 
            : "bg-gradient-to-br from-white via-white to-slate-50 border-slate-200/50 hover:shadow-2xl"
        }`}>
          
          {/* Header */}
          <div className="w-full flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                darkMode 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}>
                <span className="text-2xl">🛠️</span>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  پشتیبانی
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-1"></div>
              </div>
            </div>
          </div>

          {/* Contact Grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            {entries.map(([label, val]) => {
              const isNumeric = /^\d+$/.test(val ?? "");
              const display = isNumeric ? toPersianDigits(val ?? "") : val || "----";
              const icon = getIcon(label);
              
              return (
                <div 
                  key={label} 
                  className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    darkMode 
                      ? "bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-gray-600/50 hover:border-blue-500/50" 
                      : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200/50 hover:border-blue-300/50"
                  }`}
                >
                  {/* Background accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-slate-600"}`}>
                        {label}
                      </span>
                    </div>
                    
                    <div className={`text-lg font-semibold ltr ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {toPersianDigits(display)}
                    </div>
                    
                    {/* Decorative line */}
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-12 transition-all duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Section */}
        {description && (
          <div className={`w-full p-8 flex flex-col justify-center items-start gap-6 rounded-3xl shadow-xl border transition-all duration-300 ${
            darkMode 
              ? "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700/50" 
              : "bg-gradient-to-br from-white via-white to-slate-50 border-slate-200/50 hover:shadow-2xl"
          }`}>
            
            {/* Header */}
            <div className="w-full flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  darkMode 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600" 
                    : "bg-gradient-to-r from-emerald-500 to-teal-600"
                }`}>
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                    توضیحات
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-1"></div>
                </div>
              </div>
            </div>

            {/* Description Content */}
            <div className={`w-full p-6 rounded-2xl border-2 ${
              darkMode 
                ? "bg-gradient-to-r from-gray-700/30 to-gray-800/30 border-gray-600/30" 
                : "bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-emerald-200/30"
            }`}>
              <p className={`text-right leading-relaxed text-lg ${darkMode ? "text-gray-100" : "text-slate-700"}`}>
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
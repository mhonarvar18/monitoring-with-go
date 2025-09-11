import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useState, useEffect } from "react";
import {
  FiX,
  FiFilter,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiBell,
  FiCheck,
  FiRotateCcw,
} from "react-icons/fi";
import DateFilterDetail from "./Modals/components/DateFiltersDetail";
import BranchFiltersDetail from "./Modals/components/BranchFiltersDetail";
import ProvinceCityFiltersDetail from "./Modals/components/ProvinceFiltersDetail";
import AlarmFiltersDetail from "./Modals/components/AlarmFiltersDetail";
import type { FilterState } from "../hooks/EventHook/useFilters";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeFilters?: FilterState;
  setActiveFilters?: React.Dispatch<React.SetStateAction<FilterState>>;
}

const filterItems = [
  {
    key: "dateTime",
    title: "بازه زمانی",
    type: "date-range",
    component: DateFilterDetail,
    icon: FiCalendar,
    description: "انتخاب تاریخ و ساعت شروع و پایان",
  },
  {
    key: "alarmCategory",
    title: "نوع دسته بندی رویداد",
    type: "select",
    component: AlarmFiltersDetail,
    icon: FiBell,
    description: "فیلتر بر اساس دسته‌بندی رویداد",
  },
  {
    key: "branch",
    title: "شعبه",
    type: "search",
    component: BranchFiltersDetail,
    icon: FiMapPin,
    description: "جستجو و انتخاب شعبه مورد نظر",
  },
  {
    key: "location",
    title: "موقعیت مکانی",
    type: "select",
    component: ProvinceCityFiltersDetail,
    icon: FiMapPin,
    description: "انتخاب استان و شهر",
  },
];

export default function FilterEventDrawer({
  isOpen,
  onClose,
  activeFilters,
  setActiveFilters,
}: Props) {
  const [localFilters, setLocalFilters] = useState<FilterState>(
    activeFilters || {}
  );
  const [initialFilters, setInitialFilters] = useState<FilterState>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize filters when drawer opens
  useEffect(() => {
    if (isOpen) {
      const current = activeFilters || {};
      setLocalFilters(current);
      setInitialFilters(current);
    }
  }, [isOpen, activeFilters]);

  // Check for changes
  useEffect(() => {
    const changed =
      JSON.stringify(localFilters) !== JSON.stringify(initialFilters);
    setHasChanges(changed);
  }, [localFilters, initialFilters]);

  // Count active filters
  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) => value !== null && value !== undefined && value !== ""
  ).length;

  // Handle drawer close
  const handleDrawerClose = () => {
    onClose();
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      alarmCategoryId: null,
      branchId: null,
      locationId: null,
    };
    setLocalFilters(emptyFilters);
  };

  // Reset filters to initial state
  const resetFilters = () => {
    setLocalFilters(initialFilters);
  };

  // Apply filters
  const handleApplyFilter = () => {
    // Clean up the filters - remove null/undefined values
    const cleanedFilters = Object.entries(localFilters).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key as keyof FilterState] = value;
        }
        return acc;
      },
      {} as FilterState
    );

    if (setActiveFilters) {
      setActiveFilters(cleanedFilters);
    }

    setTimeout(() => {
      onClose();
    }, 0);
  };

  // Handle individual filter component changes
  const handleDateTimeChange = (value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      startDate: value.startDate,
      endDate: value.endDate,
      startTime: value.startTime,
      endTime: value.endTime,
    }));
  };

  const handleAlarmChange = (value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      alarmCategoryId: value.alarmCategoryId,
    }));
  };

  const handleBranchChange = (value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      branchId: value.branchId,
    }));
  };

  const handleLocationChange = (value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      locationId: value.locationId,
    }));
  };

  // Render filter component based on type
  const renderFilterComponent = (item: any) => {
    const Component = item.component;
    if (!Component) return null;

    let value: any = {};
    let onChange: (value: any) => void = () => {};

    switch (item.key) {
      case "dateTime":
        value = {
          startDate: localFilters.startDate,
          endDate: localFilters.endDate,
          startTime: localFilters.startTime,
          endTime: localFilters.endTime,
        };
        onChange = handleDateTimeChange;
        break;
      case "alarmCategory":
        value = { alarmCategoryId: localFilters.alarmCategoryId };
        onChange = handleAlarmChange;
        break;
      case "branch":
        value = { branchId: localFilters.branchId };
        onChange = handleBranchChange;
        break;
      case "location":
        value = { locationId: localFilters.locationId };
        onChange = handleLocationChange;
        break;
      default:
        return null;
    }

    return (
      <div className="w-full p-4">
        <Component value={value} onChange={onChange} />
      </div>
    );
  };

  // Get filter summary text
  const getFilterSummary = () => {
    const parts: string[] = []

    if (localFilters.startDate && localFilters.endDate) {
      parts.push("بازه زمانی");
    }
    if (localFilters.alarmCategoryId) {
      parts.push("دسته‌بندی");
    }
    if (localFilters.branchId) {
      parts.push("شعبه");
    }
    if (localFilters.locationId) {
      parts.push("موقعیت");
    }

    return parts.join(" • ");
  };

  return (
    <Drawer
      open={isOpen}
      onClose={handleDrawerClose}
      direction="left"
      style={{ width: "420px" }}
      className="font-iransans"
    >
      <div
        className="w-full h-full flex flex-col bg-gradient-to-b from-gray-50 to-white"
        dir="rtl"
      >
        {/* Modern Header */}
        <div className="relative bg-gradient-to-r from-[#09A1A4] to-[#07898c] text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FiFilter size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">فیلتر رویدادها</h2>
                <p className="text-white/80 text-sm mt-1">
                  {activeFiltersCount > 0
                    ? `${activeFiltersCount} فیلتر فعال: ${getFilterSummary()}`
                    : "انتخاب معیارهای فیلترینگ"}
                </p>
              </div>
            </div>

            <button
              onClick={handleDrawerClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200
                       hover:rotate-90 transform"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white/60 transition-all duration-500"
              style={{ width: activeFiltersCount > 0 ? "100%" : "0%" }}
            ></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Filter Stats & Quick Actions */}
          {activeFiltersCount > 0 && (
            <div
              className="m-4 p-4 bg-gradient-to-r from-[#09A1A4]/5 to-transparent 
                          border border-[#09A1A4]/20 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#09A1A4] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {activeFiltersCount} فیلتر فعال
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-blue-500 hover:text-blue-700 
                             px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-200
                             flex items-center gap-1"
                    title="بازگشت به حالت قبل"
                  >
                    <FiRotateCcw size={12} />
                    بازنشانی
                  </button>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-500 hover:text-red-700 
                             px-2 py-1 rounded hover:bg-red-50 transition-colors duration-200
                             flex items-center gap-1"
                  >
                    <FiTrash2 size={12} />
                    پاک کردن همه
                  </button>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="text-xs text-gray-600 bg-white/60 rounded-lg p-2">
                <span className="font-medium">فیلترهای انتخاب شده: </span>
                <span>{getFilterSummary()}</span>
              </div>
            </div>
          )}

          {/* Filter Items */}
          <div className="px-4 pb-4 space-y-4">
            {filterItems.map((item, index) => (
              <div
                key={item.key}
                className="bg-white rounded-xl shadow-sm border border-gray-100 
                         hover:shadow-lg hover:border-[#09A1A4]/20 transition-all duration-300
                         transform hover:scale-[1.01]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Filter Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                  <div className="p-2 bg-[#09A1A4]/10 rounded-lg">
                    <item.icon size={18} className="text-[#09A1A4]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {((item.key === "dateTime" &&
                    (localFilters.startDate ||
                      localFilters.endDate ||
                      localFilters.startTime ||
                      localFilters.endTime)) ||
                    (item.key === "alarmCategory" &&
                      localFilters.alarmCategoryId) ||
                    (item.key === "branch" && localFilters.branchId) ||
                    (item.key === "location" && localFilters.locationId)) && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      <FiCheck size={10} />
                      <span>فعال</span>
                    </div>
                  )}
                </div>

                {/* Filter Component */}
                <div className="bg-gradient-to-b from-gray-50/30 to-white">
                  {renderFilterComponent(item)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Action Buttons */}
        <div className="p-4 bg-white border-t border-gray-100 shadow-lg">
          <div className="flex gap-3 mb-3">
            {/* Apply Button */}
            <button
              className={`
                flex-1 relative overflow-hidden font-semibold py-3 px-4 rounded-xl 
                transition-all duration-300 transform hover:scale-[1.02]
                shadow-lg hover:shadow-xl group flex items-center justify-center gap-2
                ${
                  hasChanges || activeFiltersCount > 0
                    ? "bg-gradient-to-r from-[#09A1A4] to-[#07898c] hover:from-[#07898c] hover:to-[#065f61] text-white shadow-[#09A1A4]/20 hover:shadow-[#09A1A4]/30"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-gray-200/50"
                }
              `}
              onClick={handleApplyFilter}
              disabled={!hasChanges && activeFiltersCount === 0}
            >
              {/* Button shine effect */}
              {(hasChanges || activeFiltersCount > 0) && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                              transition-transform duration-700"
                ></div>
              )}

              <FiCheck size={16} className="relative z-10" />
              <span className="relative z-10">اعمال فیلترها</span>

              {activeFiltersCount > 0 && (
                <span className="relative z-10 bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Cancel Button */}
            <button
              className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 
                       hover:text-gray-700 font-semibold py-3 px-4 rounded-xl
                       transition-all duration-200 hover:bg-gray-50
                       flex items-center justify-center gap-2"
              onClick={handleDrawerClose}
            >
              <FiX size={16} />
              انصراف
            </button>
          </div>

          {/* Status indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            {hasChanges && (
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                تغییرات در انتظار اعمال
              </span>
            )}

            {activeFiltersCount > 0 && !hasChanges && (
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                {activeFiltersCount} فیلتر اعمال شده
              </span>
            )}

            {activeFiltersCount === 0 && !hasChanges && (
              <span className="flex items-center gap-1 text-gray-400">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                هیچ فیلتری انتخاب نشده
              </span>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

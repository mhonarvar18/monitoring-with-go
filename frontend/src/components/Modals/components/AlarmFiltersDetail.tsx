import React, { useState, useMemo } from "react";
import { useAlarmCategories } from "../../../hooks/useAlarmCategories";
import { FiBell, FiSearch, FiCheck, FiX, FiLoader } from "react-icons/fi";
import AlarmFilterAccordion from "../../AlarmFilterAccordion";

interface AlarmFilterValue {
  alarmCategoryId?: { id: string | number; label: string } | string | number | null;
}

interface Props {
  value: AlarmFilterValue;
  onChange: (value: AlarmFilterValue) => void;
}

const AlarmFiltersDetail: React.FC<Props> = ({ value, onChange }) => {
  const { data: categories, loading, error } = useAlarmCategories(1, 150);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get the current selected value (could be object or just ID)
  const selectedValue = value.alarmCategoryId;
  const selectedId = typeof selectedValue === 'object' && selectedValue !== null 
    ? selectedValue.id 
    : selectedValue;

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!searchTerm) return categories;
    
    return categories.filter(cat => 
      cat.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleSelect = (cat: any) => {
    if (selectedId === cat.id) {
      // Deselect
      onChange({ alarmCategoryId: null });
    } else {
      // Select - store full object for UI display
      onChange({ alarmCategoryId: { id: cat.id, label: cat.label } });
    }
  };

  const clearSelection = () => {
    onChange({ alarmCategoryId: null });
    setSearchTerm("");
  };

  // Get display label
  const selectedLabel = typeof selectedValue === 'object' && selectedValue !== null
    ? selectedValue.label
    : (categories?.find(cat => cat.id === selectedId)?.label || null);

  return (
    <div className="w-full">
      <AlarmFilterAccordion
        title="انتخاب دسته‌بندی رویداد"
        subtitle={selectedLabel || "هیچ دسته‌بندی انتخاب نشده"}
        icon={<FiBell size={18} className="text-[#09A1A4]" />}
        className="w-full"
        selectedCount={selectedId ? 1 : 0}
      >
        <div className="space-y-4">
          
          {/* Clear Button */}
          {selectedId && (
            <div className="flex justify-end">
              <button
                onClick={clearSelection}
                className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-1 border border-red-200"
              >
                <FiX size={12} />
                پاک کردن
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در دسته‌بندی‌ها..."
              className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 focus:border-[#09A1A4] rounded-lg outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Selected Category Summary */}
          {selectedLabel && (
            <div className="bg-gradient-to-r from-[#09A1A4]/10 to-transparent border border-[#09A1A4]/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#09A1A4] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">انتخاب شده:</span>
                <span className="text-sm text-[#09A1A4] font-semibold">{selectedLabel}</span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-gray-500">
                <FiLoader size={20} className="animate-spin" />
                <span className="text-sm">در حال بارگذاری دسته‌بندی‌ها...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <FiX size={16} />
                <span className="text-sm font-medium">خطا در بارگذاری</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Categories List */}
          {!loading && !error && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiBell size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchTerm ? "دسته‌بندی مورد نظر یافت نشد" : "هیچ دسته‌بندی موجود نیست"}
                  </p>
                </div>
              ) : (
                filteredCategories.map((cat, index) => {
                  const isSelected = selectedId === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#09A1A4]/30 transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <button
                        onClick={() => handleSelect(cat)}
                        className={`
                          w-full text-right px-4 py-3 transition-all duration-200 
                          flex items-center justify-between group
                          ${isSelected
                            ? "bg-gradient-to-r from-[#09A1A4] to-[#07898c] text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        <span className="font-medium">{cat.label}</span>
                        
                        {isSelected && (
                          <FiCheck size={16} className="text-white" />
                        )}
                        
                        {!isSelected && (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full group-hover:border-[#09A1A4] transition-colors duration-200"></div>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && filteredCategories.length > 0 && (
            <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
              {searchTerm ? (
                <span>{filteredCategories.length} مورد از {categories?.length || 0} دسته‌بندی</span>
              ) : (
                <span>{categories?.length || 0} دسته‌بندی موجود</span>
              )}
            </div>
          )}
        </div>
      </AlarmFilterAccordion>
    </div>
  );
};

export default AlarmFiltersDetail
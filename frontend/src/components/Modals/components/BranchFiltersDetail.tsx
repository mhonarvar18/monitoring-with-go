import React, { useState, useEffect } from "react";
import { useBranchSearch } from "../../../hooks/useBranchSearch";
import { FiMapPin, FiSearch, FiX, FiLoader, FiCheck } from "react-icons/fi";
import BranchFilterAccordion from "../../BranchFilterAccordion";
import { BsFillBuildingFill } from "react-icons/bs";

interface BranchFilterValue {
  branchId?: { id: string | number; name: string } | string | number | null;
}

interface Props {
  value: BranchFilterValue;
  onChange: (value: BranchFilterValue) => void;
}

const BranchFiltersDetail: React.FC<Props> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const { results, loading, error, search } = useBranchSearch();
  
  // Get the current selected value (could be object or just ID)
  const selectedValue = value.branchId;
  const selectedId = typeof selectedValue === 'object' && selectedValue !== null 
    ? selectedValue.id 
    : selectedValue;

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 1) {
        search(query);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [query, search]);

  const handleBranchSelect = (branch: any) => {
    if (selectedId === branch.id) {
      // Deselect
      onChange({ branchId: null });
    } else {
      // Select - store full object for UI display
      onChange({ branchId: { id: branch.id, name: branch.name } });
    }
  };

  const clearSelection = () => {
    onChange({ branchId: null });
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
  };

  // Get display name
  const selectedBranchName = typeof selectedValue === 'object' && selectedValue !== null
    ? selectedValue.name
    : (results.find(branch => branch.id === selectedId)?.name || null);

  return (
    <div className="w-full">
      <BranchFilterAccordion
        title="انتخاب شعبه"
        subtitle={selectedBranchName || "جستجو و انتخاب شعبه مورد نظر"}
        icon={<FiMapPin size={18} className="text-[#09A1A4]" />}
        className="w-full"
        selectedBranch={selectedBranchName}
        isSearching={loading}
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

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {loading ? (
                <FiLoader className="h-4 w-4 text-[#09A1A4] animate-spin" />
              ) : (
                <FiSearch className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام شعبه را جستجو کنید..."
              className="w-full pr-10 pl-10 py-3 border-2 border-gray-200 focus:border-[#09A1A4] rounded-lg outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
              </button>
            )}
          </div>

          {/* Search Helper Text */}
          {query.trim().length > 0 && query.trim().length <= 1 && (
            <div className="text-center py-4 text-gray-500">
              <FiSearch size={20} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">حداقل ۲ کاراکتر برای جستجو وارد کنید</p>
            </div>
          )}

          {/* Selected Branch Summary */}
          {selectedBranchName && (
            <div className="bg-gradient-to-r from-[#09A1A4]/10 to-transparent border border-[#09A1A4]/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#09A1A4] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">شعبه انتخاب شده:</span>
                <span className="text-sm text-[#09A1A4] font-semibold">{selectedBranchName}</span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center gap-3 text-gray-500">
                <FiLoader size={20} className="animate-spin text-[#09A1A4]" />
                <span className="text-sm">در حال جستجو...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <FiX size={16} />
                <span className="text-sm font-medium">خطا در جستجو</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && !error && query.trim().length > 1 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BsFillBuildingFill size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">هیچ شعبه‌ای یافت نشد</p>
                  <p className="text-xs mt-1">عبارت جستجو را تغییر دهید</p>
                </div>
              ) : (
                results.map((branch, index) => {
                  const isSelected = selectedId === branch.id;
                  return (
                    <div
                      key={branch.id}
                      className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#09A1A4]/30 transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <button
                        onClick={() => handleBranchSelect(branch)}
                        className={`
                          w-full text-right px-4 py-3 transition-all duration-200 
                          flex items-center justify-between group
                          ${isSelected
                            ? "bg-gradient-to-r from-[#09A1A4] to-[#07898c] text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-gray-100'}`}>
                            <BsFillBuildingFill size={14} className={isSelected ? 'text-white' : 'text-gray-500'} />
                          </div>
                          <span className="font-medium">{branch.name}</span>
                        </div>
                        
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

          {/* Initial State */}
          {!loading && !error && query.trim().length <= 1 && !selectedBranchName && (
            <div className="text-center py-8 text-gray-400">
              <FiSearch size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">برای یافتن شعبه جستجو کنید</p>
              <p className="text-xs mt-1">حداقل ۲ کاراکتر وارد کنید</p>
            </div>
          )}
        </div>
      </BranchFilterAccordion>
    </div>
  );
};

export default BranchFiltersDetail;
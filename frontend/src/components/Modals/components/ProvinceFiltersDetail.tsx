import React, { useState, useEffect } from "react";
import { useLocationsByType } from "../../../hooks/useLocationsByType";
import type { Location } from "../../../hooks/useLocationsByType";
import {
  FiMapPin,
  FiX,
  FiLoader,
  FiCheck,
  FiMap,
  FiNavigation,
} from "react-icons/fi";
import LocationFilterAccordion from "../../LocationFilterAccordion";

interface LocationFilterValue {
  locationId?: { id: string | number; label: string } | string | number | null;
}

interface Props {
  value: LocationFilterValue;
  onChange: (value: LocationFilterValue) => void;
}

const ProvinceCityFiltersDetail: React.FC<Props> = ({ value, onChange }) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<
    string | number | null
  >(null);
  const [selectedCityId, setSelectedCityId] = useState<string | number | null>(
    null
  );

  // Get the current selected value (could be object or just ID)
  const selectedValue = value.locationId;
  const selectedId =
    typeof selectedValue === "object" && selectedValue !== null
      ? selectedValue.id
      : selectedValue;

  // Provinces
  const {
    data: provinces,
    loading: loadingProvinces,
    error: errorProvinces,
  } = useLocationsByType("STATE");

  // Cities based on selected province
  const {
    data: cities,
    loading: loadingCities,
    error: errorCities,
  } = useLocationsByType("CITY", selectedProvinceId ?? undefined);

  // Initialize and sync with parent value
  useEffect(() => {
    if (!selectedId) {
      setSelectedProvinceId(null);
      setSelectedCityId(null);
      return;
    }

    // Check if selectedId is a city
    const city = cities?.find((c) => c.id === selectedId);
    if (city) {
      setSelectedProvinceId(city.parentId);
      setSelectedCityId(city.id);
      return;
    }

    // Check if selectedId is a province
    const province = provinces?.find((p) => p.id === selectedId);
    if (province) {
      setSelectedProvinceId(province.id);
      setSelectedCityId(null);
      return;
    }
  }, [selectedId, provinces, cities]);

  const handleSelectProvince = (province: Location) => {
    if (selectedProvinceId === province.id) {
      // Deselect province
      setSelectedProvinceId(null);
      setSelectedCityId(null);
      onChange({ locationId: null });
    } else {
      // Select province - store full object for UI display
      setSelectedProvinceId(province.id);
      setSelectedCityId(null);
      onChange({ locationId: { id: province.id, label: province.label } });
    }
  };

  const handleSelectCity = (city: Location) => {
    if (selectedCityId === city.id) {
      // Deselect city, keep province
      setSelectedCityId(null);
      const province = provinces?.find((p) => p.id === selectedProvinceId);
      onChange({
        locationId: province
          ? { id: province.id, label: province.label }
          : null,
      });
    } else {
      // Select city - store full object for UI display
      setSelectedCityId(city.id);
      onChange({ locationId: { id: city.id, label: city.label } });
    }
  };

  const clearSelection = () => {
    setSelectedProvinceId(null);
    setSelectedCityId(null);
    onChange({ locationId: null });
  };

  // Get display names
  const selectedProvince = provinces?.find((p) => p.id === selectedProvinceId);
  const selectedCity = cities?.find((c) => c.id === selectedCityId);

  const getSubtitle = () => {
    if (selectedCity && selectedProvince) {
      return `${selectedCity.label} - ${selectedProvince.label}`;
    } else if (selectedProvince) {
      return selectedProvince.label;
    }
    return "ابتدا استان و سپس شهر را انتخاب کنید";
  };

  // Get display label for selected location
  const selectedLocationLabel =
    typeof selectedValue === "object" && selectedValue !== null
      ? selectedValue.label
      : selectedCity?.label || selectedProvince?.label || null;

  return (
    <div className="w-full">
      <LocationFilterAccordion
        title="انتخاب موقعیت مکانی"
        subtitle={getSubtitle()}
        icon={<FiMapPin size={18} className="text-[#09A1A4]" />}
        className="w-full"
        selectedLocation={selectedLocationLabel}
        selectedProvince={selectedProvince?.label}
        selectedCity={selectedCity?.label}
        isLoading={loadingProvinces || loadingCities}
      >
        <div className="space-y-6">
          {/* Clear Button */}
          {(selectedProvinceId || selectedCityId) && (
            <div className="flex justify-end">
              <button
                onClick={clearSelection}
                className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-1 border border-red-200"
              >
                <FiX size={12} />
                پاک کردن همه
              </button>
            </div>
          )}

          {/* Selection Summary */}
          {(selectedProvince || selectedCity) && (
            <div className="bg-gradient-to-r from-[#09A1A4]/10 to-transparent border border-[#09A1A4]/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#09A1A4] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  موقعیت انتخاب شده:
                </span>
              </div>
              <div className="text-sm text-[#09A1A4] font-semibold">
                {selectedCity && selectedProvince ? (
                  <span>
                    {selectedCity.label} - {selectedProvince.label}
                  </span>
                ) : selectedProvince ? (
                  <span>{selectedProvince.label}</span>
                ) : null}
              </div>
            </div>
          )}

          {/* Provinces Section */}
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FiMap size={16} className="text-blue-600" />
                </div>
                <span className="font-semibold text-gray-800">
                  انتخاب استان
                </span>
                {selectedProvince && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    <FiCheck size={10} />
                    <span>انتخاب شده</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              {/* Loading Provinces */}
              {loadingProvinces && (
                <div className="flex items-center justify-center py-6">
                  <div className="flex items-center gap-3 text-gray-500">
                    <FiLoader
                      size={20}
                      className="animate-spin text-[#09A1A4]"
                    />
                    <span className="text-sm">در حال بارگذاری استان‌ها...</span>
                  </div>
                </div>
              )}

              {/* Error Provinces */}
              {errorProvinces && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <FiX size={16} />
                    <span className="text-sm font-medium">
                      خطا در بارگذاری استان‌ها
                    </span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{errorProvinces}</p>
                </div>
              )}

              {/* Provinces List */}
              {!loadingProvinces && !errorProvinces && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {provinces?.map((province, index) => {
                    const isSelected = selectedProvinceId === province.id;
                    return (
                      <div
                        key={province.id}
                        className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#09A1A4]/30 transition-all duration-200"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <button
                          onClick={() => handleSelectProvince(province)}
                          className={`
                            w-full text-right px-4 py-3 transition-all duration-200 
                            flex items-center justify-between group
                            ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-lg ${
                                isSelected ? "bg-white/20" : "bg-gray-100"
                              }`}
                            >
                              <FiMap
                                size={14}
                                className={
                                  isSelected ? "text-white" : "text-gray-500"
                                }
                              />
                            </div>
                            <span className="font-medium">
                              {province.label}
                            </span>
                          </div>

                          {isSelected ? (
                            <FiCheck size={16} className="text-white" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full group-hover:border-blue-500 transition-colors duration-200"></div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cities Section - Only show if province is selected */}
          {selectedProvinceId && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-white px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <FiNavigation size={16} className="text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-800">
                    انتخاب شهر
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    اختیاری
                  </span>
                  {selectedCity && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      <FiCheck size={10} />
                      <span>انتخاب شده</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                {/* Loading Cities */}
                {loadingCities && (
                  <div className="flex items-center justify-center py-6">
                    <div className="flex items-center gap-3 text-gray-500">
                      <FiLoader
                        size={20}
                        className="animate-spin text-[#09A1A4]"
                      />
                      <span className="text-sm">در حال بارگذاری شهرها...</span>
                    </div>
                  </div>
                )}

                {/* Error Cities */}
                {errorCities && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <FiX size={16} />
                      <span className="text-sm font-medium">
                        خطا در بارگذاری شهرها
                      </span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{errorCities}</p>
                  </div>
                )}

                {/* Cities List */}
                {!loadingCities && !errorCities && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cities?.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <FiNavigation
                          size={24}
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p className="text-sm">
                          هیچ شهری برای این استان یافت نشد
                        </p>
                      </div>
                    ) : (
                      cities?.map((city, index) => {
                        const isSelected = selectedCityId === city.id;
                        return (
                          <div
                            key={city.id}
                            className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#09A1A4]/30 transition-all duration-200"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <button
                              onClick={() => handleSelectCity(city)}
                              className={`
                                w-full text-right px-4 py-3 transition-all duration-200 
                                flex items-center justify-between group
                                ${
                                  isSelected
                                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-1.5 rounded-lg ${
                                    isSelected ? "bg-white/20" : "bg-gray-100"
                                  }`}
                                >
                                  <FiNavigation
                                    size={14}
                                    className={
                                      isSelected
                                        ? "text-white"
                                        : "text-gray-500"
                                    }
                                  />
                                </div>
                                <span className="font-medium">
                                  {city.label}
                                </span>
                              </div>

                              {isSelected ? (
                                <FiCheck size={16} className="text-white" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full group-hover:border-green-500 transition-colors duration-200"></div>
                              )}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Helper Text */}
          {!selectedProvinceId && (
            <div className="text-center py-6 text-gray-400">
              <FiMapPin size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">
                ابتدا استان مورد نظر را انتخاب کنید
              </p>
              <p className="text-xs mt-1">
                سپس می‌توانید شهر را نیز انتخاب کنید
              </p>
            </div>
          )}
        </div>
      </LocationFilterAccordion>
    </div>
  );
};

export default ProvinceCityFiltersDetail;

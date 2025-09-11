import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IranMap from "../../components/IranMap";
import ProvinceCitiesMap from "../../components/IranMap/provinceCitiesMap";
import AllunConfirmationAlarmBox from "../../components/AllunConfirmationAlarmBox/AllunConfirmationAlarmBox";
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import { useCountryEvents } from "../../hooks/useCountryEvents";
import { getAlarmColor, getAlarmIcon } from "../../utils/alarmHelpers";
import UnConfirmationModal from "../../components/Modals/UnConfirmationModal";
import { refreshMap } from "../../lib/socket";
import type { CityInfo } from "../../components/IranMap/provinceCitiesMap";

// Animation variants
const mapVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
} as const;

const slideVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
} as const;

const Map2: React.FC = () => {
  const token = localStorage.getItem("access_token") || "";
  const { data: provinceData, error } = useCountryEvents(token);

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | number | null>(
    null
  );

  // Modal state + what to pass
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAlarmLabel, setModalAlarmLabel] = useState<string | null>(null);
  const [modalAlarmCategoryId, setModalAlarmCategoryId] = useState<
    string | number | null
  >(null);
  const [viewProvinceDetail, setViewProvinceDetail] = useState(false);

  // Mock city data - replace with real data fetching
  const [cityData] = useState<Record<string, CityInfo>>({});

  const handleProvinceClick = (label: string) => {
    setSelectedLabel(label);
    setSelectedId(provinceData[label]?.id ?? null);
    setSelectedCityName(null);
    setSelectedCityId(null);
  };

  const handleProvinceDoubleClick = (label: string) => {
    setSelectedLabel(label);
    setSelectedId(provinceData[label]?.id ?? null);
    setSelectedCityName(null);
    setSelectedCityId(null);
    setViewProvinceDetail(true);
  };

  const handleCityClick = (cityName: string) => {
    setSelectedCityName(cityName);
    setSelectedCityId(`city_${cityName}_${Date.now()}`);
  };

  const handleCityDoubleClick = (cityName: string) => {
    console.log("Double clicked city:", cityName);
  };

  const handleBackToIranMap = () => {
    setViewProvinceDetail(false);
    setSelectedLabel(null);
    setSelectedId(null);
    setSelectedCityName(null);
    setSelectedCityId(null);
  };

  // Get selected province
  const selectedProvince = selectedId
    ? Object.values(provinceData).find((p) => p.id === selectedId)
    : null;

  // City data (no fake anymore)
  const selectedCityData = selectedCityName
    ? cityData[selectedCityName] ?? null
    : null;

  // Chart data (province-level or city-level if exists)
  const chartData =
    viewProvinceDetail && selectedCityData
      ? selectedCityData.alarm?.map((item) => ({
          name: item.label,
          value: item.count,
        })) || []
      : selectedProvince?.alarm?.map((item) => ({
          name: item.label,
          value: item.count,
        })) || [];

  // Alarm cards
  const alarmCards =
    viewProvinceDetail && selectedCityData
      ? selectedCityData.alarm?.filter((a) => a.count > 0) || []
      : selectedProvince?.alarm?.filter((a) => a.count > 0) || [];

  // Show stats condition
  const showStats = viewProvinceDetail
    ? (selectedCityData?.unConfirmAlarms ?? 0) > 0
    : (selectedProvince?.unConfirmAlarms ?? 0) > 1;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-200"
      >
        خطا: {error.message}
      </motion.div>
    );
  }

  return (
    <>
      <div className="w-full h-full font-[iransans] p-1">
        <div className="h-full grid grid-cols-4 grid-rows-5 gap-2" dir="rtl">
          {/* Modern Map section */}
          <motion.div
            layout
            className="col-span-2 row-span-5 bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          >
            {/* Header Section */}
            <motion.div
              layout
              className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200/50"
            >
              <div className="flex items-center justify-between p-4">
                <AnimatePresence mode="wait">
                  {viewProvinceDetail && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={handleBackToIranMap}
                      className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg
                        className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      بازگشت به نقشه ایران
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.div layout className="text-right">
                  <motion.h2
                    layout
                    className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                  >
                    {viewProvinceDetail && selectedLabel
                      ? `${selectedLabel}${
                          selectedCityName ? ` - ${selectedCityName}` : ""
                        }`
                      : selectedLabel || "نقشه ایران"}
                  </motion.h2>

                  <AnimatePresence>
                    {viewProvinceDetail && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-gray-500 mt-1"
                      >
                        نقشه ایران / {selectedLabel}{" "}
                        {selectedCityName && `/ ${selectedCityName}`}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {viewProvinceDetail && selectedLabel ? (
                <motion.div
                  key="province-map"
                  variants={mapVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="w-full h-full">
                    <ProvinceCitiesMap
                      provinceName={selectedLabel}
                      cityData={cityData} // Pass real city data here
                      handleClick={handleCityClick}
                      handleDoubleClick={handleCityDoubleClick}
                      textColor="#333"
                      width={1000}
                      height={500}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="iran-map"
                  variants={mapVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full flex items-center justify-center"
                >
                  <IranMap
                    provinceData={provinceData}
                    handleClick={handleProvinceClick}
                    textColor="#FFF"
                    handleDoubleClick={handleProvinceDoubleClick}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats section with animations */}
          <AnimatePresence>
            {showStats && (
              <>
                {/* Chart box */}
                <motion.div
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="col-span-2 row-span-2 col-start-3 bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="h-full p-4">
                    <AllunConfirmationAlarmBox
                      alarmData={chartData}
                      locationId={
                        viewProvinceDetail ? selectedCityId : selectedId
                      }
                    />
                  </div>
                </motion.div>

                {/* Alarm cards */}
                {alarmCards.map((alarm, index) => {
                  const col = index % 2 === 0 ? 3 : 4;
                  const row = Math.floor(index / 2) + 3;
                  const Icon = getAlarmIcon(alarm.label);

                  return (
                    <motion.div
                      key={alarm.id}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                      className={`col-span-1 row-span-1 col-start-${col} row-start-${row} bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300`}
                    >
                      <AlarmCard
                        label={alarm.label}
                        total={alarm.total}
                        unconfirmed={alarm.count}
                        color={getAlarmColor(alarm.label)}
                        icon={
                          <Icon size={20} color={getAlarmColor(alarm.label)} />
                        }
                        onClick={() => {
                          setModalAlarmLabel(alarm.label);
                          setModalAlarmCategoryId(alarm.id ?? null);
                          setModalOpen(true);
                        }}
                      />
                    </motion.div>
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <UnConfirmationModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            locationId={viewProvinceDetail ? selectedCityId : selectedId}
            alarmCategoryId={modalAlarmCategoryId}
            alarmLabel={modalAlarmLabel ?? undefined}
            success={() => refreshMap()}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Map2;

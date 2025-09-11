import { useState } from "react";
import IranMap from "../../components/IranMap";
import AllunConfirmationAlarmBox from "../../components/AllunConfirmationAlarmBox/AllunConfirmationAlarmBox";
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import { useCountryEvents } from "../../hooks/useCountryEvents";
import { getAlarmColor, getAlarmIcon } from "../../utils/alarmHelpers";
import UnConfirmationModal from "../../components/Modals/UnConfirmationModal";
import { refreshMap } from "../../lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import ProvinceCitiesMap, {
  type CityInfo,
} from "../../components/IranMap/provinceCitiesMap";
import { FaChevronRight } from "react-icons/fa6";

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

const Map: React.FC = () => {
  const token = localStorage.getItem("access_token") || "";
  const { data: provinceData, error } = useCountryEvents(token);
  console.log(`MapData: `, provinceData);
  const [cityData] = useState<Record<string, CityInfo>>({});
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [selectedCityLabel, setSelectedCityLable] = useState<string | null>(
    null
  );
  const [viewProvinceDetail, setViewProvinceDetail] = useState(false);

  // Modal state + what to pass
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAlarmLabel, setModalAlarmLabel] = useState<string | null>(null);
  const [modalAlarmCategoryId, setModalAlarmCategoryId] = useState<
    string | number | null
  >(null);

  const handleProvinceClick = (label: string) => {
    setSelectedLabel(label);
    setSelectedId(provinceData[label]?.id ?? null);
    console.log(`${provinceData[label]}:`, provinceData[label]);
  };

  const handleProvinceDoubleClick = (label: string) => {
    setSelectedLabel(label);
    setSelectedId(provinceData[label]?.id ?? null);
    setViewProvinceDetail(true);
    console.log(`${provinceData[label]}:`, provinceData[label]);
  };

  const handleBackToIranMap = () => {
    setSelectedLabel(null);
    setSelectedId(null);
    setSelectedCityLable(null)
    setViewProvinceDetail(false);
  };

  const handleCityClick = (cityName: string) => {
    setSelectedCityLable(cityName);
    setSelectedId(`city_${cityName}_${Date.now()}`);
  };

  const selectedProvince = selectedId
    ? Object.values(provinceData).find((p) => p.id === selectedId)
    : null;

  const chartData =
    selectedProvince?.alarm?.map((item) => ({
      name: item.label,
      value: item.count,
    })) || [];

  const alarmCards = selectedProvince?.alarm?.filter((a) => a.count > 0) || [];
  // console.log(`alarmCards:`, alarmCards);
  // console.log(`selectedProvince: `, selectedProvince);

  const showStats = selectedProvince?.unConfirmAlarms ?? 0 > 1;

  if (error) {
    return <div className="p-4 text-red-600">خطا: {error.message}</div>;
  }

  return (
    <>
      <div className="w-full h-full font-[iransans] p-1">
        <div
          className="h-full grid grid-cols-4 grid-rows-5 gap-2 border"
          dir="rtl"
        >
          {/* Map section */}
          <motion.div className="col-span-2 row-span-5 bg-white rounded-2xl shadow flex flex-col items-center justify-center py-6">
            <div className="w-full flex justify-between items-center px-4">
              <AnimatePresence mode="wait">
                {viewProvinceDetail && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={handleBackToIranMap}
                    className="flex justify-center items-center gap-1"
                  >
                    <FaChevronRight className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text"/>
                    <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">بازگشت به نقشه ایران</span>
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
                        selectedCityLabel ? ` - ${selectedCityLabel}` : ""
                      }`
                    : selectedLabel || "نقشه ایران"}
                </motion.h2>
              </motion.div>
            </div>
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

          {/* Alarm stats section */}
          {showStats ? (
            <>
              {/* Chart box */}
              <div className="col-span-2 row-span-2 col-start-3 grid grid-rows-[auto_auto_auto] gap-4 rounded-[15px] shadow h-full overflow-hidden">
                <div className="row-span-3 h-full">
                  <AllunConfirmationAlarmBox
                    alarmData={chartData}
                    locationId={selectedId}
                  />
                </div>
              </div>

              {/* Alarm cards */}
              {alarmCards.map((alarm, index) => {
                const col = index % 2 === 0 ? 3 : 4;
                const row = Math.floor(index / 2) + 3;
                const Icon = getAlarmIcon(alarm.label);

                return (
                  <div
                    key={alarm.id}
                    className={`col-span-1 row-span-1 col-start-${col} row-start-${row} bg-white rounded-[15px] shadow`}
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
                        // set what the modal needs
                        setModalAlarmLabel(alarm.label);
                        setModalAlarmCategoryId(alarm.id ?? null);
                        setModalOpen(true);
                      }}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {modalOpen && (
        <UnConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          locationId={selectedId}
          alarmCategoryId={modalAlarmCategoryId}
          alarmLabel={modalAlarmLabel ?? undefined}
          success={() => refreshMap()}
        />
      )}
    </>
  );
};

export default Map;

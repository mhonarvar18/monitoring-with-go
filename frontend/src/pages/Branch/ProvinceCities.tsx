// src/pages/ProvinceCities.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useBranchCities } from "../../hooks/useBranchCities";
import CityBranchesTable, { type CityBranchesTableHandle } from "./CityBranchesTable.tsx";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.tsx";
import { useMemo } from "react";
import type { BranchAll } from "../../types/BranchAll";

interface Props {
  provinceId: string | number;
  provinceLable: string;
  isVisible: boolean;
  selectedCityId: string | number | null;
  onCitySelect: (city: { id: string | number; label: string }) => void;
  onEdit: (branch: BranchAll) => void;
  cityBranchesRef?: any;
  onDelete: (branchId: string | number) => void;
  onExportDataChange?: (data: any[], columns: any[]) => void;
  cityBranchesTableRef?: React.RefObject<CityBranchesTableHandle | null>; // <-- THIS!
}

const gridVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const panelVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

const ProvinceCities: React.FC<Props> = ({
  provinceId,
  provinceLable,
  isVisible,
  selectedCityId,
  onCitySelect,
  onEdit,
  cityBranchesRef,
  onDelete,
  cityBranchesTableRef,
  onExportDataChange,
}) => {
  const { cities, loading, error } = useBranchCities(provinceId);

  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null;

  if (!isVisible) return null;
  if (loading)
    return (
      <p className="w-full h-full">
        <LoadingSpinner />
      </p>
    );
  if (error) return <p className="p-2 text-red-500">{error}</p>;
  if (!cities.length)
    return (
      <p className="w-fit mx-auto text-center text-base py-2 mt-1 bg-slate-200 rounded-xl px-2">
        شعبه‌ای برای <strong>{provinceLable}</strong> ثبت نشده است.
      </p>
    );

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {selectedCity == null ? (
          <motion.div
            key="cities-grid"
            variants={gridVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full p-2 flex flex-wrap justify-center items-center gap-10 h-full max-h-[76vh] overflow-y-auto"
          >
            {cities
              .filter((c) => c.id !== selectedCityId)
              .map((city) => (
                <button
                  key={city.id}
                  onClick={() =>
                    onCitySelect({ id: city.id, label: city.label })
                  }
                  className={`
                    ${
                      selectedCity
                        ? "w-[120px] h-[40px]"
                        : "w-[120px] h-[120px]"
                    }
                    flex items-center justify-center
                    border border-[#09a1a4] bg-[#86dddf46]
                    rounded-lg shadow hover:scale-105 transition-transform
                    text-gray-800
                  `}
                >
                  {city.label}
                </button>
              ))}
          </motion.div>
        ) : (
          <motion.div
            key="branches-panel"
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            <CityBranchesTable
              cityId={selectedCity.id}
              onEdit={onEdit}
              cityBranchesRef={cityBranchesRef}
              onDelete={onDelete}
              ref={cityBranchesTableRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProvinceCities;

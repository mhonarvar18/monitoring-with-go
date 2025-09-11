import React from "react";
import { useLocationsByType } from "../../../hooks/useLocationsByType";
import type { Location } from "../../../hooks/useLocationsByType";
interface Props {
  parentId: string | number | null; // Province ID
  value: { city: string | number | null };
  onChange: (val: { city: string | number | null }) => void;
}

const CityFiltersDetail: React.FC<Props> = ({ parentId, value, onChange }) => {
  // If no province selected, show a message
  console.log(`parentId: `, parentId)
  
  if (!parentId) {
    return (
      <div className="w-full py-2 text-gray-400">
        لطفا ابتدا استان را انتخاب کنید.
      </div>
    );
  }

  const { data, loading, error } = useLocationsByType("CITY", parentId);
  const safeValue = value || { city: null };

  const handleSelect = (id: string | number) => {
    if (safeValue.city === id) {
      onChange({ city: null }); // Deselect
    } else {
      onChange({ city: id }); // Select
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 items-stretch max-h-[36vh] overflow-y-auto">
      {loading && <div className="py-2">در حال بارگذاری...</div>}
      {error && <div className="text-red-500 py-2">{error}</div>}
      {!loading &&
        !error &&
        data.map((loc: Location) => (
          <button
            key={loc.id}
            onClick={() => handleSelect(loc.id)}
            className={`w-full text-right px-4 py-2 rounded border border-[#09A1A4] transition ${
              safeValue.city === loc.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
          >
            {loc.label}
          </button>
        ))}
      {!loading && !error && data.length === 0 && (
        <div className="text-gray-400 py-2">هیچ شهری یافت نشد.</div>
      )}
    </div>
  );
};

export default CityFiltersDetail;

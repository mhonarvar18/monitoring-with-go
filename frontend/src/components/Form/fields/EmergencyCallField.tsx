import React, { useEffect, useState } from "react";

function parseEmergencyJSONString(str) {
  try {
    const obj = str ? JSON.parse(str) : {};
    return [
      { key: Object.keys(obj)[0] || "", value: Object.values(obj)[0] || "" },
      { key: Object.keys(obj)[1] || "", value: Object.values(obj)[1] || "" },
    ];
  } catch {
    return [
      { key: "", value: "" },
      { key: "", value: "" },
    ];
  }
}

function buildEmergencyJSONString(arr) {
  const obj = {};
  arr.forEach(({ key, value }) => {
    if (key && key.trim().length > 0) obj[key] = value ?? "";
  });
  return JSON.stringify(obj);
}

const EmergencyCallField = ({ value, onChange, error, required }) => {
  // Only update local state if the parent value (the string) changes
  const [pairs, setPairs] = useState(() => parseEmergencyJSONString(value));

  useEffect(() => {
    // Sync only when value changes from parent, not on every render!
    setPairs(parseEmergencyJSONString(value));
  }, [value]);

  // On input change, update local state and immediately call onChange with new string
  const handleChange = (idx, field, val) => {
    setPairs((prevPairs) => {
      const nextPairs = prevPairs.map((pair, i) =>
        i === idx ? { ...pair, [field]: val } : pair
      );
      // Call parent's onChange with the new value
      onChange(buildEmergencyJSONString(nextPairs));
      return nextPairs;
    });
  };

  return (
    <div className="w-full flex flex-col gap-2" dir="rtl">
      {[0, 1].map((idx) => (
        <div key={idx} className="w-full flex justify-center items-center gap-1">
          <span className="min-w-32 text-gray-700 text-right">
            شماره اضطراری {idx + 1} :
          </span>
          <input
            className="w-full border rounded px-2 py-1 text-right outline-none border-gray-300"
            placeholder="عنوان"
            value={String(pairs[idx]?.key ?? "")}
            onChange={(e) => handleChange(idx, "key", e.target.value)}
          />
          <input
            className="w-full border rounded px-2 py-1 text-right outline-none border-gray-300"
            placeholder="شماره"
            value={String(pairs[idx]?.value ?? "")}
            onChange={(e) => handleChange(idx, "value", e.target.value)}
          />
        </div>
      ))}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default EmergencyCallField;

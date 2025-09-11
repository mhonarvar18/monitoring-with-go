import React, { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";

// Define Props: value is { from, to }, both strings like "14:35"
interface Props {
  value: { from: string | null; to: string | null };
  onChange: (val: { from: string | null; to: string | null }) => void;
}

const TimeFilterDetail: React.FC<Props> = ({ value, onChange }) => {
  // Initialize with value or null (as DateObject)
  const safeValue = value || { from: null, to: null };

  const [fromTime, setFromTime] = useState<DateObject | null>(
    safeValue.from
      ? new DateObject({
          date: safeValue.from,
          format: "HH:mm",
          calendar: gregorian,
        })
      : null
  );
  const [toTime, setToTime] = useState<DateObject | null>(
    safeValue.to
      ? new DateObject({
          date: safeValue.to,
          format: "HH:mm",
          calendar: gregorian,
        })
      : null
  );

  // Handle changes
  const handleFromChange = (date: DateObject | null) => {
    setFromTime(date);
    onChange({
      from: date ? date.format("HH:mm") : null, // Always 24h
      to: toTime ? toTime.format("HH:mm") : null,
    });
  };
  const handleToChange = (date: DateObject | null) => {
    setToTime(date);
    onChange({
      from: fromTime ? fromTime.format("HH:mm") : null,
      to: date ? date.format("HH:mm") : null,
    });
  };

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center gap-4">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <div className="w-full flex justify-between items-center gap-2">
          <p>از ساعت:</p>
          <DatePicker
            value={fromTime}
            onChange={handleFromChange}
            plugins={[<TimePicker hideSeconds />]}
            format="HH:mm"
            calendar={persian}
            locale={persian_fa}
            inputClass="w-full border rounded p-2"
            editable={false}
            disableDayPicker // Only time picker, no date
          />
        </div>
        <div className="w-full flex justify-between items-center gap-2">
          <p>تا ساعت:</p>
          <DatePicker
            value={toTime}
            onChange={handleToChange}
            plugins={[<TimePicker hideSeconds />]}
            format="HH:mm"
            calendar={persian}
            locale={persian_fa}
            inputClass="w-full border rounded p-2"
            editable={false}
            disableDayPicker
          />
        </div>
      </div>
      <div className="w-full text-center text-[16px] font-medium my-2">
        {(fromTime || toTime) && (
          <>
            از ساعت {fromTime?.format?.("HH:mm") || "---"} تا ساعت{" "}
            {toTime?.format?.("HH:mm") || "---"}
          </>
        )}
      </div>
    </div>
  );
};

export default TimeFilterDetail;

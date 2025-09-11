import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { FiCalendar, FiClock, FiArrowRight, FiX } from "react-icons/fi";
import DateFilterAccordion from "../../DateTimeFilterAccodrion/DateFilterAccordion";

interface DateFilterValue {
  startDate?: string | null; // "YYYY-MM-DD" (Gregorian)
  endDate?: string | null;
  startTime?: string | null; // "HH:mm"
  endTime?: string | null;
}

interface Props {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}

const BASE_DATE = "2024-01-01"; // for time-only DateObjects

const toISO = (d: DateObject | null) =>
  d ? d.convert(gregorian).format("YYYY-MM-DD") : null;

const toHHMM = (d: DateObject | null) => (d ? d.format("HH:mm") : null);

const parseISOToPersian = (iso?: string | null): DateObject | null =>
  iso
    ? new DateObject({
        date: iso,
        format: "YYYY-MM-DD",
        calendar: gregorian,
      }).convert(persian, persian_fa)
    : null;

const parseHHMMToDO = (hhmm?: string | null): DateObject | null =>
  hhmm
    ? new DateObject({
        date: `${BASE_DATE} ${hhmm}:00`,
        format: "YYYY-MM-DD HH:mm:ss",
        calendar: gregorian,
      })
    : null;

const DateFilterDetail: React.FC<Props> = ({ value, onChange }) => {
  const [fromDate, setFromDate] = useState<DateObject | null>(null);
  const [toDate, setToDate] = useState<DateObject | null>(null);
  const [fromTime, setFromTime] = useState<DateObject | null>(null);
  const [toTime, setToTime] = useState<DateObject | null>(null);

  // Prevent feedback loops when our own onChange triggers a props update
  const isInternalUpdate = useRef(false);

  // ----- Sync DOWN from props when they change externally -----
  useEffect(() => {
    if (isInternalUpdate.current) return;
    try {
      const nextFromDate = parseISOToPersian(value.startDate ?? null);
      const nextToDate = parseISOToPersian(value.endDate ?? null);
      const nextFromTime = parseHHMMToDO(value.startTime ?? null);
      const nextToTime = parseHHMMToDO(value.endTime ?? null);

      if (toISO(fromDate) !== toISO(nextFromDate)) setFromDate(nextFromDate);
      if (toISO(toDate) !== toISO(nextToDate)) setToDate(nextToDate);
      if (toHHMM(fromTime) !== toHHMM(nextFromTime)) setFromTime(nextFromTime);
      if (toHHMM(toTime) !== toHHMM(nextToTime)) setToTime(nextToTime);
    } catch (e) {
      console.error("Error syncing from props:", e);
      setFromDate(null);
      setToDate(null);
      setFromTime(null);
      setToTime(null);
    }
    const t = setTimeout(() => {
      isInternalUpdate.current = false;
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.startDate, value.endDate, value.startTime, value.endTime]);

  // Push UP to parent using the latest local state (never props)
  const pushChange = (patch: Partial<DateFilterValue> = {}) => {
    const newValue: DateFilterValue = {
      startDate: toISO(fromDate),
      endDate: toISO(toDate),
      startTime: toHHMM(fromTime),
      endTime: toHHMM(toTime),
      ...patch,
    };
    isInternalUpdate.current = true;
    onChange(newValue);
  };

  // ----- Handlers: set local state first, then pushChange -----
  const handleFromDateChange = (val: DateObject | null) => {
    setFromDate(val);
    const startISO = val ? val.convert(gregorian).format("YYYY-MM-DD") : null;
    const endISO = toDate ? toDate.convert(gregorian).format("YYYY-MM-DD") : null;

    if (startISO && endISO && new Date(endISO) < new Date(startISO)) {
      setToDate(null);
      pushChange({ startDate: startISO, endDate: null });
    } else {
      pushChange({ startDate: startISO });
    }
  };

  const handleToDateChange = (val: DateObject | null) => {
    setToDate(val);
    const endISO = val ? val.convert(gregorian).format("YYYY-MM-DD") : null;
    const startISO = fromDate ? fromDate.convert(gregorian).format("YYYY-MM-DD") : null;

    if (startISO && endISO && new Date(endISO) < new Date(startISO)) {
      pushChange({ endDate: null });
    } else {
      pushChange({ endDate: endISO });
    }
  };

  const handleFromTimeChange = (val: DateObject | null) => {
    setFromTime(val);
    pushChange({ startTime: val ? val.format("HH:mm") : null });
  };

  const handleToTimeChange = (val: DateObject | null) => {
    setToTime(val);
    const end = val ? val.format("HH:mm") : null;
    const start = fromTime ? fromTime.format("HH:mm") : null;
    pushChange({ endTime: start && end && end < start ? null : end });
  };

  const clearAll = () => {
    setFromDate(null);
    setToDate(null);
    setFromTime(null);
    setToTime(null);
    isInternalUpdate.current = true;
    onChange({ startDate: null, endDate: null, startTime: null, endTime: null });
  };

  const hasDateValues = !!(fromDate || toDate);
  const hasTimeValues = !!(fromTime || toTime);
  const hasAnyValues = hasDateValues || hasTimeValues;

  const subtitle = useMemo(() => {
    if (hasDateValues && hasTimeValues) {
      return `${fromDate?.format("YYYY/MM/DD") || "..."} ${fromTime?.format("HH:mm") || ""} تا ${toDate?.format("YYYY/MM/DD") || "..."} ${toTime?.format("HH:mm") || ""}`;
    } else if (hasDateValues) {
      return `${fromDate?.format("YYYY/MM/DD") || "..."} تا ${toDate?.format("YYYY/MM/DD") || "..."}`;
    } else if (hasTimeValues) {
      return `${fromTime?.format("HH:mm") || "..."} تا ${toTime?.format("HH:mm") || "..."}`;
    }
    return "تاریخ و زمان شروع و پایان را انتخاب کنید";
  }, [fromDate, toDate, fromTime, toTime, hasDateValues, hasTimeValues]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Clear All Button */}
      {hasAnyValues && (
        <div className="flex justify-end">
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-1 border border-red-200"
          >
            <FiX size={12} />
            پاک کردن همه
          </button>
        </div>
      )}

      {/* Date Range */}
      <DateFilterAccordion
        title="انتخاب بازه تاریخی"
        subtitle={subtitle}
        icon={<FiCalendar size={18} className="text-[#09A1A4]" />}
        className="w-full"
      >
        <div className="space-y-4">
          {/* From Date */}
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">از تاریخ</span>
              </div>
              <FiCalendar size={16} className="text-gray-400" />
            </div>
            <DatePicker
              value={fromDate}
              onChange={handleFromDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              inputClass="w-full border-2 border-gray-200 focus:border-[#09A1A4] rounded-lg p-3 outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-center font-medium"
              editable={false}
              placeholder="انتخاب تاریخ شروع"
              calendarPosition="bottom-center"
              // Important for date pickers: first click selects the date
              onOpenPickNewDate={false}
            />
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="p-2 bg-[#09A1A4]/10 rounded-full">
              <FiArrowRight size={16} className="text-[#09A1A4]" />
            </div>
          </div>

          {/* To Date */}
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">تا تاریخ</span>
              </div>
              <FiCalendar size={16} className="text-gray-400" />
            </div>
            <DatePicker
              value={toDate}
              onChange={handleToDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              inputClass="w-full border-2 border-gray-200 focus:border-[#09A1A4] rounded-lg p-3 outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-center font-medium"
              editable={false}
              placeholder="انتخاب تاریخ پایان"
              calendarPosition="bottom-center"
              minDate={fromDate || undefined}
              onOpenPickNewDate={false}
            />
          </div>
        </div>
      </DateFilterAccordion>

      {/* Time Range */}
      <DateFilterAccordion
        title="انتخاب بازه زمانی"
        subtitle={
          hasTimeValues
            ? `${fromTime?.format("HH:mm") || "..."} تا ${toTime?.format("HH:mm") || "..."}`
            : "ساعت شروع و پایان را انتخاب کنید"
        }
        icon={<FiClock size={18} className="text-[#09A1A4]" />}
        className="w-full"
      >
        <div className="space-y-4">
          {/* From Time */}
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">از ساعت</span>
              </div>
              <FiClock size={16} className="text-gray-400" />
            </div>
            <DatePicker
              value={fromTime}
              onChange={handleFromTimeChange}
              // Time-only behavior: let the picker create a new base value on open,
              // so the first click changes the time immediately.
              // Do NOT set onOpenPickNewDate={false} here.
              plugins={[<TimePicker hideSeconds key="fromTimePicker" />]}
              format="HH:mm"
              calendar={gregorian}
              // onlyTimePicker
              inputClass="w-full border-2 border-gray-200 focus:border-[#09A1A4] rounded-lg p-3 outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-center font-medium"
              editable={false}
              placeholder="انتخاب ساعت شروع"
            />
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="p-2 bg-[#09A1A4]/10 rounded-full">
              <FiArrowRight size={16} className="text-[#09A1A4]" />
            </div>
          </div>

          {/* To Time */}
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">تا ساعت</span>
              </div>
              <FiClock size={16} className="text-gray-400" />
            </div>
            <DatePicker
              value={toTime}
              onChange={handleToTimeChange}
              plugins={[<TimePicker hideSeconds key="toTimePicker" />]}
              format="HH:mm"
              calendar={gregorian}
              // onlyTimePicker
              inputClass="w-full border-2 border-gray-200 focus:border-[#09A1A4] rounded-lg p-3 outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-center font-medium"
              editable={false}
              placeholder="انتخاب ساعت پایان"
            />
          </div>
        </div>
      </DateFilterAccordion>

      {/* Summary */}
      {hasAnyValues && (
        <div className="bg-gradient-to-r from-[#09A1A4]/5 to-transparent border border-[#09A1A4]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#09A1A4] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">خلاصه انتخاب شده</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            {hasDateValues && (
              <div className="flex items-center gap-2">
                <FiCalendar size={12} />
                <span>
                  تاریخ: {fromDate?.format("YYYY/MM/DD") || "نامشخص"} تا{" "}
                  {toDate?.format("YYYY/MM/DD") || "نامشخص"}
                </span>
              </div>
            )}
            {hasTimeValues && (
              <div className="flex items-center gap-2">
                <FiClock size={12} />
                <span>
                  زمان: {fromTime?.format("HH:mm") || "نامشخص"} تا{" "}
                  {toTime?.format("HH:mm") || "نامشخص"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilterDetail;

import { FiCalendar, FiChevronDown } from "react-icons/fi";
import type { ActionLogsByDate } from "../../services/actionLog.service";
import TimelineItem, { formatPersianDate } from "./TimeLineItem";
import { toPersianDigits } from "../../utils/numberConvert";
import { useTranslation } from "react-i18next";
import React, { useMemo } from "react";

interface DateGroupProps {
  dateGroup: ActionLogsByDate;
  isLast: boolean;
  activeDate: string | null;
  onToggle: (date: string | null) => void;
}

/** Deeply remove any key whose name matches /id/i */
const deepOmitKeys = (value: any, shouldOmit: (k: string) => boolean): any => {
  if (Array.isArray(value))
    return value.map((v) => deepOmitKeys(v, shouldOmit));
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      if (shouldOmit(k)) continue;
      out[k] = deepOmitKeys(v, shouldOmit);
    }
    return out;
  }
  return value;
};

const omitIdsDeep = (v: any) =>
  deepOmitKeys(v, (k) => k !== "localId" && /id/i.test(k) || k === 'password');

/** Normalize changedFields for CREATED/DELETED/UPDATED shapes */
const sanitizeChangedFields = (action: string, cf: any) => {
  if (!cf || typeof cf !== "object") return cf;

  // CREATED / DELETED shape: { before?: {}, after?: {} }
  const hasBeforeAfter = "before" in cf || "after" in cf;
  if (hasBeforeAfter) {
    const out: any = {};
    if (cf.before !== undefined) out.before = omitIdsDeep(cf.before);
    if (cf.after !== undefined) out.after = omitIdsDeep(cf.after);
    return out;
  }

  // UPDATED shape: { fieldA: { before, after }, fieldB: { ... }, ... }
  const updatedOut: Record<string, any> = {};
  for (const [key, val] of Object.entries(cf)) {
    // drop entries whose key contains "id"
    if (/id/i.test(key)) continue;

    if (val && typeof val === "object") {
      const entry: any = {};
      if ("before" in val) entry.before = omitIdsDeep((val as any).before);
      if ("after" in val) entry.after = omitIdsDeep((val as any).after);
      if (Object.keys(entry).length > 0) updatedOut[key] = entry;
    } else {
      updatedOut[key] = val;
    }
  }
  return updatedOut;
};

const DateGroup: React.FC<DateGroupProps> = ({
  dateGroup,
  isLast,
  activeDate,
  onToggle,
}) => {
  const { t } = useTranslation();
  const countFa = toPersianDigits(dateGroup.count);
  const isOpen = activeDate === dateGroup.date;

  const handleToggle = () => {
    onToggle(isOpen ? null : dateGroup.date);
  };

  // Build normalized logs once per dateGroup change
  const normalizedLogs = useMemo(() => {
    return dateGroup.logs.map((log: any) => ({
      ...log,
      // Clean raw changedFields (used by UPDATED diff and any fallback)
      changedFields: sanitizeChangedFields(log.action, log.changedFields),

      // If you already pass i18n fields, clean them too (safe no-op if keys are Persian)
      changedFields_i18n: sanitizeChangedFields(
        log.action,
        log.changedFields_i18n
      ),
    }));
  }, [dateGroup.logs]);

  return (
    <div className="w-full relative">
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleToggle();
        }}
        aria-expanded={isOpen}
        className="w-full sticky top-0 z-20 bg-[#E1F3F4] text-gray-700 py-4 px-6 mb-2 rounded-lg shadow-lg border border-[#09a1a4] text-right"
      >
        <div className="w-full flex items-center gap-3">
          <div className="w-12 h-12 bg-[#09a1a4] text-black bg-opacity-20 rounded-full flex items-center justify-center">
            <FiCalendar size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {formatPersianDate(dateGroup.date)}
            </h2>
            <p className="text-gray-500 text-sm">{t("nLogs", { countFa })}</p>
          </div>

          <FiChevronDown
            className={`shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            size={20}
          />
        </div>
      </button>

      {/* Body: render only when open */}
      {isOpen && (
        <div className="w-full px-4">
          {normalizedLogs.map((log, index) => (
            <TimelineItem
              key={log.id}
              log={log}
              isLast={index === normalizedLogs.length - 1 && isLast}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DateGroup;

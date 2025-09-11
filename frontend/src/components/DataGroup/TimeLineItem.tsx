import {
  FiCheck,
  FiClock,
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import type { ActionLog } from "../../services/actionLog.service";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type ExtLog = ActionLog & {
  modelName?: string;
  actionLabel?: string;
  changedFields_i18n?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
};

interface TimelineItemProps {
  log: ExtLog;
  isLast: boolean;
}

// ---------------- helpers ----------------
const getActionConfig = (action: string) => {
  switch (action) {
    case "CREATED":
      return { icon: FiPlus, color: "text-green-600", bgColor: "bg-green-100" };
    case "UPDATED":
      return { icon: FiEdit3, color: "text-blue-600", bgColor: "bg-blue-100" };
    case "DELETED":
      return { icon: FiTrash2, color: "text-red-600", bgColor: "bg-red-100" };
    case "CONFIRMED":
      return {
        icon: FiCheck,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      };
    default:
      return { icon: FiEdit3, color: "text-gray-600", bgColor: "bg-gray-100" };
  }
};

export const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString);
  const weekday = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(
    date
  );
  const day = new Intl.DateTimeFormat("fa-IR", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(
    date
  );
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    date
  );
  return `${weekday} ${day} ${month} ${year}`;
};

export const formatPersianTime = (dateString: string) =>
  new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateString));

const fieldLabel = (t: any, model: string, key: string) =>
  t(`fields.${model}.${key}`, t(`fields.common.${key}`, key));

const enumValue = (t: any, model: string, key: string, value: any) => {
  const marker = t(`fields.${model}.${key}`, { defaultValue: "" });
  if (typeof marker === "string" && marker.startsWith("@enums.")) {
    const enumName = marker.replace("@enums.", "");
    return t(`enums.${enumName}.${String(value)}`, String(value));
  }
  return value;
};

// Helper function to check if value is not null/undefined/empty
const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (value === "" || value === "null" || value === "undefined") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "object" && Object.keys(value).length === 0)
    return false;
  return true;
};

// Helper function to filter out null/empty fields from an object
const filterNullFields = (
  fields: Record<string, any> | undefined
): Record<string, any> | null => {
  if (!fields) return null;

  const filtered = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => hasValue(value))
  );

  return Object.keys(filtered).length > 0 ? filtered : null;
};

const renderValue = (value: any) => {
  if (!hasValue(value)) return <span className="text-gray-400">—</span>;

  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-1">
        {value.filter(hasValue).map((v, i) => (
          <div key={i} className="text-gray-800 break-all">
            {String(v)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const filteredObject = filterNullFields(value);
    if (!filteredObject) return <span className="text-gray-400">—</span>;

    return (
      <div className="mt-1 ml-2 border rounded-lg bg-gray-50 p-2">
        {Object.entries(filteredObject).map(([k, v]) => (
          <div key={k} className="flex items-start gap-2 py-1">
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs shrink-0">
              {k}
            </span>
            <div className="text-gray-800 break-all">{String(v)}</div>
          </div>
        ))}
      </div>
    );
  }

  return String(value);
};

const renderFieldsBlock = (fields?: Record<string, any>) => {
  const filteredFields = filterNullFields(fields);
  if (!filteredFields) return null;

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(filteredFields).map(([faKey, val]) => (
        <div key={faKey} className="flex items-start gap-2">
          <span className="inline-block px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs shrink-0">
            {faKey}
          </span>
          <div className="text-gray-800 break-all">{renderValue(val)}</div>
        </div>
      ))}
    </div>
  );
};

// User Avatar Component
const UserAvatar = ({
  avatarUrl,
  fullName,
}: {
  avatarUrl: string | null;
  fullName: string;
}) => {
  if (avatarUrl) {
    return (
      <img
        src={`${
          avatarUrl ? `${import.meta.env.VITE_API_URL}${avatarUrl}` : ``
        }`}
        alt={fullName}
        className="w-8 h-8 rounded-full object-cover border border-gray-200"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextElementSibling?.classList.remove("hidden");
        }}
      />
    );
  }
  return (
    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
      <FiUser size={12} className="text-gray-500" />
    </div>
  );
};

const TimelineItem: React.FC<TimelineItemProps> = ({ log, isLast }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const actionConfig = getActionConfig(log.action);
  const ActionIcon = actionConfig.icon;

  const modelLabel = log.modelName ?? t(`models.${log.model}`, log.model);
  const actionLabel = log.actionLabel ?? t(`actions.${log.action}`, log.action);

  // Filter null fields from i18n data
  const beforeI18n = filterNullFields(log.changedFields_i18n?.before);
  const afterI18n = filterNullFields(log.changedFields_i18n?.after);

  const updatedEntries = Object.entries(log.changedFields || {})
    .filter(
      ([key, val]) =>
        !["createdAt", "updatedAt", "version"].includes(key) &&
        val &&
        typeof val === "object" &&
        ("before" in (val as any) || "after" in (val as any))
    )
    .map(([key, val]: [string, any]) => {
      const faKey = fieldLabel(t, log.model, key);
      const before =
        val?.before !== undefined
          ? enumValue(t, log.model, key, val.before)
          : undefined;
      const after =
        val?.after !== undefined
          ? enumValue(t, log.model, key, val.after)
          : undefined;
      return [faKey, { before, after }] as const;
    })
    // Filter out entries where both before and after are null/empty
    .filter(([_, change]) => hasValue(change.before) || hasValue(change.after));

  // keyboard toggle helper
  const onUserKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  // Check if there are any changes to display
  const hasChangesToShow =
    beforeI18n ||
    afterI18n ||
    updatedEntries.length > 0 ||
    log.action === "CONFIRMED";

  return (
    <div className="w-full relative flex gap-4 pb-6 max-w-full">
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`p-3 rounded-full ${actionConfig.bgColor} ${actionConfig.color} flex items-center justify-center border-2 border-white shadow-lg z-10`}
        >
          <ActionIcon size={20} />
        </div>
        {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow overflow-hidden">
        <div className="w-full min-w-0 flex items-start justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${actionConfig.bgColor} ${actionConfig.color} whitespace-nowrap`}
            >
              {actionLabel}
            </span>
            <span className="text-sm font-medium text-gray-700 truncate">
              {modelLabel}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0 whitespace-nowrap">
            <FiClock size={12} />
            <span>{formatPersianTime(log.createdAt)}</span>
          </div>
        </div>

        {/* User */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onUserKeyDown}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-2 mb-3 text-sm text-gray-600 min-w-0 cursor-pointer"
        >
          <span className="flex items-center gap-2 min-w-0">
            <UserAvatar
              avatarUrl={log.userInfo?.avatarUrl ?? null}
              fullName={log.userInfo?.fullName ?? ""}
            />
            <span className="truncate">{log.userInfo?.fullName}</span>
            {log.userInfo?.username && (
              <span className="text-gray-400 shrink-0">
                ({log.userInfo.username})
              </span>
            )}
          </span>
          <FiChevronDown
            className={`shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            size={18}
          />
        </button>

        {/* Changes — only when open and has changes */}
        {open && hasChangesToShow && (
          <div className="w-full space-y-3 min-w-0">
            {/* CREATED */}
            {log.action === "CREATED" && afterI18n && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-semibold text-emerald-800">
                    اطلاعات ایجاد شده
                  </span>
                </div>
                {renderFieldsBlock(afterI18n)}
              </div>
            )}

            {/* DELETED */}
            {log.action === "DELETED" && beforeI18n && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-semibold text-red-800">
                    اطلاعات حذف شده
                  </span>
                </div>
                {renderFieldsBlock(beforeI18n)}
              </div>
            )}

            {/* UPDATED */}
            {log.action === "UPDATED" && updatedEntries.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-semibold text-blue-800">
                    تغییرات اعمال شده
                  </span>
                </div>
                <div className="space-y-3">
                  {updatedEntries.slice(0, 6).map(([faKey, change]) => (
                    <div
                      key={faKey}
                      className="bg-white/60 rounded-md p-4 min-w-0"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                          {faKey}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 min-w-0">
                        {hasValue(change.before) && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                              <span className="text-xs font-medium text-red-600">
                                قبل از تغییر
                              </span>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 min-w-0">
                              <span className="text-sm text-red-700 break-all font-mono">
                                {renderValue(change.before)}
                              </span>
                            </div>
                          </div>
                        )}
                        {hasValue(change.after) && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                              <span className="text-xs font-medium text-emerald-600">
                                بعد از تغییر
                              </span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 min-w-0">
                              <span className="text-sm text-emerald-700 break-all font-mono">
                                {renderValue(change.after)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONFIRMED */}
            {log.action === "CONFIRMED" &&
              log.changedFields?.confermationStatus && (
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/60 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-semibold text-purple-800">
                      تغییر وضعیت تایید
                    </span>
                  </div>
                  <div className="bg-white/60 rounded-md p-4 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {hasValue(
                        log.changedFields.confermationStatus.before
                      ) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                            <span className="text-xs font-medium text-red-600">
                              وضعیت قبلی
                            </span>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
                            <span className="text-sm font-semibold text-red-700">
                              {String(
                                log.changedFields.confermationStatus.before
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                      {hasValue(log.changedFields.confermationStatus.after) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                            <span className="text-xs font-medium text-emerald-600">
                              وضعیت جدید
                            </span>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                            <span className="text-sm font-semibold text-emerald-700">
                              {String(
                                log.changedFields.confermationStatus.after
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;

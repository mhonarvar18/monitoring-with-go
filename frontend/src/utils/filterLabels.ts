import { unwrapAll } from "./unwrap";

interface LookupNames {
  branchName?: string;
  // اگر خواستی بقیه مقادیر رو هم اضافه کن (locationName و ...)
}

export function getFilterLabel(
  key: string,
  value: any,
  names?: LookupNames
): string {
  // اگر مقدار آبجکت بود و label یا name داشت، همان را برگردان
  if (value && typeof value === "object") {
    if (value.label) return value.label;
    if (value.name) return value.name;
    if (value.id !== undefined) return String(value.id);
  }

  // بازه تاریخ
  if (key === "dateRange" || key === "date") {
    const start = value?.from || value?.startDate || "---";
    const end = value?.to || value?.endDate || "---";
    return `از تاریخ ${start} تا تاریخ ${end}`;
  }

  // بازه ساعت
  if (key === "timeRange" || key === "time") {
    const start = value?.from || value?.startTime || "---";
    const end = value?.to || value?.endTime || "---";
    return `از ساعت ${start} تا ساعت ${end}`;
  }

  // شعبه (اگر مقدار name موجود نبود، fallback به branchName یا پیام)
  if (key === "branchId" || key === "branch") {
    if (typeof value === "string" && value) return value;
    if (names?.branchName) return names.branchName;
    return "در حال بارگذاری شعبه...";
  }

  // دسته‌بندی آلارم (در اولویت label)
  if (key === "alarmCategoryId" || key === "alarm" || key === "alarm.label") {
    if (value?.label) return value.label;
    return `دسته‌بندی رویداد: ${value?.toString() || "---"}`;
  }

  // موقعیت (در اولویت label)
  if (key === "locationId" || key === "location") {
    if (value?.label) return value.label;
    return value?.toString() || "---";
  }

  // سایر کلیدها (fallback)
  return String(value ?? "");
}

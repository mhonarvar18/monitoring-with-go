import moment from "moment-jalaali";

const keyMap: Record<string, string> = {
  fromDate: "startDate",
  toDate: "endDate",
  fromTime: "startTime",
  toTime: "endTime",
  branch: "branchId",
  // بقیه کلیدها را ننوشتی پس تغییر نمی‌کنند
};

export function faToEn(str: string | number): string {
  if (typeof str !== "string" && typeof str !== "number") return String(str);
  let s = String(str);
  s = s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  s = s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  return s;
}
function toEnglishDigits(str: string) {
  return str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}
export function convertFiltersToApi(filters: Record<string, any>) {
  const query: Record<string, any> = {};

  // لیست فیلدهای تاریخ و ساعت که باید ارقامشان انگلیسی شود
  const dateKeys = ["startDate", "endDate"];
  const timeKeys = ["startTime", "endTime"];

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === "") continue;

    if (key === "dateRange" && typeof value === "object") {
      if (value.from) query.startDate = toEnglishDigits(value.from);
      if (value.to) query.endDate = toEnglishDigits(value.to);
      if (value.fromTime) query.startTime = value.fromTime;
      if (value.toTime) query.endTime = value.toTime;
    } else if (typeof value === "object" && value !== null && "id" in value) {
      query[key] = value.id;
    } else if (dateKeys.includes(key)) {
      query[key] = toEnglishDigits(value);
    } else if (timeKeys.includes(key)) {
      query[key] = value; // زمان معمولاً ارقامش انگلیسی است، اگر لازم بود به انگلیسی تبدیل کن
    } else {
      query[key] = value;
    }
  }
  return query;
}

// تبدیل تاریخ میلادی به جلالی
const toJalali = (date: string) =>
  date
    ? moment(toEnglishDigits(date), "YYYY-MM-DD")
        .locale("fa")
        .format("jYYYY/jMM/jDD")
    : "";

export function getActiveFilterChips(
  filters: Record<string, any>,
  getFilterLabel: (key: string, value: any) => string
) {
  const chips: { key: string; label: string }[] = [];

  if (filters.startDate || filters.endDate) {
    let label = "";
    if (filters.startDate && filters.endDate) {
      label = `از تاریخ ${toJalali(filters.startDate)} تا تاریخ ${toJalali(
        filters.endDate
      )}`;
    } else if (filters.startDate) {
      label = `از تاریخ ${toJalali(filters.startDate)}`;
    } else if (filters.endDate) {
      label = `تا تاریخ ${toJalali(filters.endDate)}`;
    }
    chips.push({ key: "dateRange", label });
  }
  if (filters.startTime || filters.endTime) {
    let label = "";
    if (filters.startTime && filters.endTime) {
      label = `از ساعت ${filters.startTime} تا ساعت ${filters.endTime}`;
    } else if (filters.startTime) {
      label = `از ساعت ${filters.startTime}`;
    } else if (filters.endTime) {
      label = `تا ساعت ${filters.endTime}`;
    }
    chips.push({ key: "timeRange", label });
  }

  if (filters.alarmCategoryId) {
    chips.push({
      key: "alarmCategoryId",
      label:
        "دسته بندی آلارم: " + getFilterLabel("alarmCategoryId", filters.alarmCategoryId),
    });
  }
  const branchVal = filters.branchId || filters.branch;
  if (branchVal) {
    chips.push({
      key: "branch",
      label: "شعبه: " + getFilterLabel("branchId", branchVal),
    });
  }
  if (filters.locationId) {
    chips.push({
      key: "locationId",
      label: "مکان: " + getFilterLabel("locationId", filters.locationId),
    });
  }

  return chips;
}

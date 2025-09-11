import moment from "jalali-moment";

const colorMap: Record<string, string> = {
  "#322929": "قهوه‌ای تیره",
  "#a5bc52": "سبز کم‌رنگ",
  "#ff0000": "قرمز",
  "#00ff00": "سبز",
  "#0000ff": "آبی",
  "#b57878" : "صورتی"
};

const isIsoDate = (val: string) => /^\d{4}-\d{2}-\d{2}T/.test(val);

export const localizeValue = (val: any): any => {
  if (typeof val !== "string") return val;

  // --- Dates ---
  if (isIsoDate(val)) {
    return moment(val).locale("fa").format("YYYY/MM/DD HH:mm");
  }

  // --- Colors ---
  if (val.startsWith("#") && colorMap[val.toLowerCase()]) {
    return colorMap[val.toLowerCase()];
  }

  return val;
};

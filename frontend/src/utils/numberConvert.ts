export function toEnglishDigits(input: string): string {
  if (!input) return input;
  return (
    input
      // Persian digits
      .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
      // Arabic-Indic digits
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
  );
}

export function convertFilterValuesToEnglish(input: any): any {
  if (typeof input === "string") {
    return toEnglishDigits(input);
  }
  if (Array.isArray(input)) {
    return input.map(convertFilterValuesToEnglish);
  }
  if (typeof input === "object" && input !== null) {
    const out: any = {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = convertFilterValuesToEnglish(v);
    }
    return out;
  }
  return input;
}

export function toPersianDigits(input: string | number | undefined | null): string {
  if (input == null) return "";
  return String(input).replace(/\d/g, d =>
    "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]
  );
}
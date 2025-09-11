// utils/num.ts
export function toAsciiDigits(input: string) {
  // Persian ۰-۹ and Arabic-Indic ٠-٩ → ASCII 0-9
  return input
    .replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function normalizeYMD(ymd?: string | null) {
  if (!ymd) return ymd ?? null;
  const s = toAsciiDigits(ymd);
  // optionally enforce zero-padding if someone sent 2025-9-1
  return s.replace(
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    (_, y, m, d) => `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`
  );
}

export function normalizeHM(hm?: string | null) {
  if (!hm) return hm ?? null;
  const s = toAsciiDigits(hm);
  return s.replace(/^(\d{1,2}):(\d{1,2})$/, (_, h, m) => `${h.padStart(2,"0")}:${m.padStart(2,"0")}`);
}

export function normalizeScalars(obj: any) {
  if (!obj) return;
  if (obj instanceof FormData) return;              // don't mutate files
  if (obj instanceof ArrayBuffer) return;
  if (ArrayBuffer.isView(obj)) return;

  const walk = (v: any): any => {
    if (typeof v === "string") return toAsciiDigits(v);
    if (v && typeof v === "object") {
      if (Array.isArray(v)) return v.map(walk);
      const out: Record<string, any> = {};
      for (const k of Object.keys(v)) out[k] = walk(v[k]);
      return out;
    }
    return v;
  };

  return walk(obj);
}
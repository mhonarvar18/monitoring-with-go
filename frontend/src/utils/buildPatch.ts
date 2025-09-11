// utils/buildPatch.ts

function isEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!isEqual(a[i], b[i])) return false;
    return true;
  }

  if (a && b && typeof a === "object") {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!isEqual(a[k], b[k])) return false;
    return true;
  }

  return false;
}

function normalize(val: any) {
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed === "" ? null : trimmed;
  }
  return val;
}

/**
 * Creates a PATCH object containing only the fields that changed.
 *
 * @param original - Original object
 * @param current - Current object (e.g., form values)
 * @param options - Optional settings
 * @param options.ignoreKeys - Keys to ignore from diff
 * @param options.skipEmptyStrings - If true, empty strings become null
 */
export function buildPatch<T extends Record<string, any>>(
  original: T,
  current: T,
  options?: {
    ignoreKeys?: string[];
    skipEmptyStrings?: boolean;
  }
): Partial<T> {
  const patch: Partial<T> = {};
  const keys = new Set([...Object.keys(original ?? {}), ...Object.keys(current ?? {})]);

  keys.forEach((k) => {
    if (options?.ignoreKeys?.includes(k)) return;

    const o = options?.skipEmptyStrings ? normalize(original?.[k]) : original?.[k];
    const c = options?.skipEmptyStrings ? normalize(current?.[k]) : current?.[k];

    if (!isEqual(o, c)) {
      patch[k as keyof T] = c;
    }
  });

  // Remove undefined values
  Object.keys(patch).forEach((k) => {
    if (patch[k as keyof typeof patch] === undefined) {
      delete patch[k as keyof typeof patch];
    }
  });

  return patch;
}

export function unwrap<T>(obj: any, key: string): T | null {
  let v = obj;
  // Keep unwrapping as long as you see { [key]: ... }
  while (v && typeof v === "object" && key in v) {
    v = v[key];
  }
  return v ?? null;
}

export function unwrapAll(obj: any): any {
  let v = obj;
  while (
    v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.keys(v).length === 1
  ) {
    v = v[Object.keys(v)[0]];
  }
  return v;
}

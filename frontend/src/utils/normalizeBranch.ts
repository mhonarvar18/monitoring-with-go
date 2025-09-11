// src/utils/normalizeBranch.ts
import type { BranchInput } from "../services/branchCrud.service";

export function normalizeEmergency(v: unknown): string | undefined {
  if (v == null) return undefined;

  if (typeof v === "string") {
    const t = v.trim();
    if (!t || t === "{}" || t.toLowerCase() === "null") return undefined;
    try {
      const parsed = JSON.parse(t);
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        Object.keys(parsed).length === 0
      ) {
        return undefined;
      }
    } catch {
      /* ignore parse errors, keep string */
    }
    return t;
  }

  if (typeof v === "object" && !Array.isArray(v)) {
    const isEmpty = Object.keys(v as Record<string, unknown>).length === 0;
    return isEmpty ? undefined : JSON.stringify(v);
  }

  return String(v);
}

export function normalizeBranchInput(b: BranchInput): BranchInput {
  return {
    ...b,
    emergencyCall: normalizeEmergency((b as any).emergencyCall),
  };
}

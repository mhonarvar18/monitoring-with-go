import { useRef, useCallback } from "react";
import { fetchBranchById } from "../services/branch.service";

export function useBranchName() {
  const cache = useRef<Record<number, string>>({});

  const getBranchName = useCallback(async (id: number | string) => {
    if (!id) return "";
    if (cache.current[id]) return cache.current[id];

    try {
      const resp = await fetchBranchById(id);
      const name = resp.data.name || String(id);
      cache.current[id] = name;
      return name;
    } catch (e) {
      return String(id);
    }
  }, []);

  return {getBranchName};
}
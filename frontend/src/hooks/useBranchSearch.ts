import { useState, useEffect, useCallback } from "react";
import { fetchBranchesByQuery } from "../services/branch.service";
import type { BranchAll } from "../types/BranchAll";

export function useBranchSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BranchAll[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBranchesByQuery(query);
      setResults(res.data); // .data based on your API response
    } catch (e: any) {
      setError(e.message || "Error fetching branches");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}

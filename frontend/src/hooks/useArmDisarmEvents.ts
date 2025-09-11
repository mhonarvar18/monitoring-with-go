// src/hooks/useArmDisarmBranches.ts
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import type { BranchAll } from "../types/BranchAll";

type ArmDisarmType = "ARM" | "DISARM";

interface UseArmDisarmBranchesResult {
  branches: BranchAll[];
  totalPages: number;
  totalRecords: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches armed/disarmed branch list, then does client-side pagination.
 */
export function useArmDisarmBranches(
  locationId: string | number,
  type: ArmDisarmType,
  page: number,
  limit: number,
  enabled: boolean = true // Add enabled parameter with default true
): UseArmDisarmBranchesResult {
  const [allBranches, setAllBranches] = useState<BranchAll[]>([]);
  const [loading, setLoading] = useState(enabled); // Only show loading if enabled
  const [error, setError] = useState<string | null>(null);

  const [refreshIndex, setRefreshIndex] = useState(0);
  const refetch = useCallback(() => {
    if (enabled) { // Only allow refetch if enabled
      setRefreshIndex((i) => i + 1);
    }
  }, [enabled]);

  useEffect(() => {
    // If not enabled, reset state and return early
    if (!enabled) {
      setAllBranches([]);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .post<{
        statusCode: number;
        message: string;
        data: BranchAll[];
      }>("/admin/branches/ARM_DISARM", {
        locationId,
        type,
      })
      .then((res) => {
        if (!mounted) return;
        setAllBranches(res.data.data);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || "خطا در دریافت شعب مسلح/غیرمسلح");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [locationId, type, refreshIndex, enabled]);

  // client-side pagination
  const totalRecords = allBranches.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const start = (page - 1) * limit;
  const pagedBranches = allBranches.slice(start, start + limit);

  return {
    branches: pagedBranches,
    totalPages,
    totalRecords,
    loading,
    error,
    refetch,
  };
}
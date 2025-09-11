import { useState, useCallback } from "react";
import api from "../../services/api";
import type { BranchAll } from "../../types/BranchAll";

type ArmDisarmType = "ARM" | "DISARM";

interface UseAllArmDisarmBranchesResult {
  branches: BranchAll[];
  loading: boolean;
  error: string | null;
  fetchAllBranches: (locationId: string | number, type: ArmDisarmType) => Promise<BranchAll[]>;
}

/**
 * Fetches all armed/disarmed branch list when manually triggered.
 */
export function useAllArmDisarmBranches(): UseAllArmDisarmBranchesResult {
  const [allBranches, setAllBranches] = useState<BranchAll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBranches = useCallback(async (
    locationId: string | number,
    type: ArmDisarmType
  ) => {
    setLoading(true);
    setError(null);
    setAllBranches([]); // Reset branches

    try {
      const response = await api.post<{
        statusCode: number;
        message: string;
        data: BranchAll[];
      }>("/admin/branches/ARM_DISARM", {
        locationId,
        type,
      });
      
      const branches = response.data.data;
      setAllBranches(branches);
      return branches;
    } catch (e: any) {
      const errorMessage = e.message || "خطا در دریافت شعب مسلح/غیرمسلح";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    branches: allBranches,
    loading,
    error,
    fetchAllBranches,
  };
}
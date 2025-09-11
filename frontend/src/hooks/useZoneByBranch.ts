// src/hooks/useZoneByBranch.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchZoneByBranch, type ZoneData } from "../services/zone.service";

interface UseZoneByBranchOptions {
  branchId: number | null | undefined | string;
  page?: number;
  limit?: number;
}

interface ZoneByBranchResponse {
  zones: ZoneData[];
  total: number;
  totalPages: number;
}

export function useZoneByBranch({
  branchId,
  page = 1,
  limit = 10,
}: UseZoneByBranchOptions) {
  const query = useQuery<ZoneByBranchResponse, Error>({
    queryKey: ["zonesByBranch", branchId, page, limit],
    queryFn: async () => {
      if (branchId === null || branchId === undefined) {
        return { zones: [], total: 0, totalPages: 0 };
      }
      const response = await fetchZoneByBranch(branchId, page, limit);
      return {
        zones: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    },
    enabled: branchId !== null && branchId !== undefined,
    placeholderData: keepPreviousData,
  });

  return {
    zones: query.data?.zones ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    page,
    limit,
    setPage: () => {}, // you can manage page state externally
    setLimit: () => {}, // you can manage limit state externally
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

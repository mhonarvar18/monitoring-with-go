// src/hooks/useZoneTypes.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchZoneTypes, type ZoneTypeData } from "../services/zoneType.service";

interface UseZoneTypesOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UseZoneTypesReturn {
  data: ZoneTypeData[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  refetch: ReturnType<typeof useQuery>["refetch"];
}

export function useZoneTypes({
  initialPage = 1,
  initialLimit = 10,
}: UseZoneTypesOptions = {}): UseZoneTypesReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const query = useQuery<
    { data: ZoneTypeData[]; total: number; totalPages: number },
    Error
  >({
    queryKey: ["zoneTypes", page, limit],
    queryFn: async () => {
      const resp = await fetchZoneTypes(page, limit);
      return {
        data: resp.data,
        total: resp.total,
        totalPages: resp.totalPages,
      };
    },
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    page,
    limit,
    setPage,
    setLimit,
    refetch: query.refetch,
  };
}

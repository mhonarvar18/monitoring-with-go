// hooks/useBranchesByCity.ts
import { useCallback, useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../services/api";
import type { BranchAll } from "../types/BranchAll";

interface UseBranchesOptions {
  cityId: number | string;
  initialPage?: number;
  initialLimit?: number;
}

type Meta = {
  pageCount: number;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

type ListPayload = {
  data: BranchAll[];
  meta: Meta;
};

type ApiEnvelope<T> = {
  statusCode?: number;
  message?: string;
  data: T;
};

export function useBranchesByCity({
  cityId,
  initialPage = 1,
  initialLimit = 20,
}: UseBranchesOptions) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // reset whenever city or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [cityId, limit]);

  const query = useQuery<ListPayload, Error>({
    queryKey: ["branchesByCity", cityId, page, limit],
    enabled: !!cityId,
    queryFn: async () => {
      const res = await api.post<ApiEnvelope<ListPayload>>(
        "/admin/branches/getBranch",
        { locationId: cityId, page, limit }
      );
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });

  const refetch = useCallback(() => {
    void query.refetch();
  }, [query]);

  const fetchAllBranches = useCallback(async () => {
    if (!cityId) return [];
    const pageLimit = 100;
    let all: BranchAll[] = [];
    let pageToFetch = 1;

    const first = await api.post<ApiEnvelope<ListPayload>>(
      "/admin/branches/getBranch",
      { locationId: cityId, page: pageToFetch, limit: pageLimit }
    );
    all = all.concat(first.data.data.data);
    const totalPages = first.data.data.meta.pageCount ?? 1;

    while (pageToFetch < totalPages) {
      pageToFetch += 1;
      const res = await api.post<ApiEnvelope<ListPayload>>(
        "/admin/branches/getBranch",
        { locationId: cityId, page: pageToFetch, limit: pageLimit }
      );
      all = all.concat(res.data.data.data);
    }
    return all;
  }, [cityId]);

  return {
    branches: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    page,
    limit,
    totalItems: query.data?.meta?.pageCount ?? 0,
    setPage,
    setLimit,
    refetch,
    fetchAllBranches,
  };
}

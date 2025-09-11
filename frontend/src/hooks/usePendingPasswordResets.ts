import { useState } from "react";
import { fetchPendingPasswordResets } from "../services/reqPassword";
import type { PendingPasswordResetListResponse } from "../services/reqPassword";
import { useQuery } from "@tanstack/react-query";

export function usePendingPasswordResets(initialPage = 1, initialLimit = 10) {
  // Local state for pagintion
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const queryKey = ["pendingPasswordResets", page, limit];

  const { data, isError, isLoading, refetch } = useQuery<
    PendingPasswordResetListResponse,
    Error
  >({
    queryKey,
    queryFn: () => fetchPendingPasswordResets(page, limit),
  });

  return {
    data: data?.data.data,
    total: data?.data.total,
    page: data?.data.page ?? page,
    limit: data?.data.limit ?? limit,
    totalPages: data?.data.totalPages ?? 1,
    loading: isLoading,
    error: isError ? "Error fetching pending password resets" : null,
    setPage,
    setLimit,
    refetch,
  };
}

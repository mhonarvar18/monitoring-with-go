import { fetchUsers } from "../services/users.service";
import { useState } from "react";
import type { User, UsersResponse } from "../services/users.service";
import { useQuery } from "@tanstack/react-query";

export function useUsers(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const { data, error, refetch, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(page, limit),
  });

  return {
    users: data?.data?.data || [],
    total: data?.data?.total || 0,
    totalPages: data?.data?.totalPage || 0,
    page,
    limit,
    loading: isLoading,
    error,
    setPage,
    setLimit,
    refetch,
  };
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchEmployeeByBranch } from "../services/employee.service";
import type { EmployeeDataResponse } from "../services/employee.service";

interface UseEmployeeByBranchOptions {
  branchId: number | string;
  initialPage?: number;
  initialLimit?: number;
}

export function useEmployeeByBranch({
  branchId,
  initialPage = 1,
  initialLimit = 10,
}: UseEmployeeByBranchOptions) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // Reset page when branchId changes
  useEffect(() => {
    setPage(initialPage);
  }, [branchId, initialPage]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employeesByBranch", branchId, page, limit],
    queryFn: () => fetchEmployeeByBranch(branchId, page, limit),
    enabled: branchId !== null && branchId !== undefined, // don't fetch if branchId is invalid
    placeholderData: keepPreviousData,
  });

  return {
    employeeUsers: data?.data?.data ?? [] as EmployeeDataResponse[],
    total: data?.data?.total ?? 0,
    totalPages: data?.data?.totalPages ?? 1,
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    page,
    limit,
    setPage,
    setLimit,
    refetch,
  };
}

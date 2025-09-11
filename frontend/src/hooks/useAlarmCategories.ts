// hooks/useAlarmCategories.ts
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { CategoryData } from "../services/alarmCategory.service";
import { fetchCategories } from "../services/alarmCategory.service";

interface UseAlarmCategoriesReturn {
  data: CategoryData[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refetch: () => void;
}

type CategoriesResponse = {
  data: CategoryData[];
  total: number;
  totalPages: number;
};

export const useAlarmCategories = (
  initialPage: number = 1,
  initialLimit: number = 10
): UseAlarmCategoriesReturn => {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  const query = useQuery<CategoriesResponse, Error>({
    queryKey: ["alarmCategories", page, limit],
    queryFn: () => fetchCategories(page, limit),
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    page,
    limit,
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    setPage,
    setLimit,
    refetch: () => {
      void query.refetch();
    },
  };
};

// hooks/useBranchCities.ts
import api from "../services/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ApiEnvelope } from "./useUserInfo";

export interface City {
  id: number | string;
  label: string;
  type: string;
  parent: {
    id: number | string;
    label: string;
    type: string;
  };
}

export function useBranchCities(parentId?: number | string) {
  const query = useQuery<City[], Error>({
    queryKey: ["branch-cities", parentId],
    queryFn: async () => {
      const res = await api.post<ApiEnvelope<City[]>>(
        "/admin/locations/exist-branch/parent",
        { parentId, locationType: "CITY" }
      );
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });

  return {
    cities: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
  };
}

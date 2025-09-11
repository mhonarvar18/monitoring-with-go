import { useQuery } from "@tanstack/react-query";
import { fetchPendingRequests } from "../services/reqRegister.service";
import type { PendingUser, PaginatedResponse } from "../services/reqRegister.service";
import type { ApiResponse } from "../types/ApiResponse";

export function usePendingRequests(page: number, limit: number) {
  return useQuery<ApiResponse<PaginatedResponse<PendingUser>>>({
    queryKey: ["pending-users", page, limit],
    queryFn: () => fetchPendingRequests(page, limit),
  });
}

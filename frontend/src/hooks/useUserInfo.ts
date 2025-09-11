import type { UserInfo } from "../services/userInfo.service";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import api from "../services/api";

export type ApiEnvelope<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export function useUserInfo() {
  const query = useQuery<AxiosResponse<ApiEnvelope<UserInfo>>, Error>({
    queryKey: ["userInfo"],
    queryFn: ({ signal }) =>
      api.get<ApiEnvelope<UserInfo>>("/admin/users/userinfo", { signal }),
  });

  return {
    userInfo: (query.data?.data?.data ?? null) as UserInfo | null,
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    refetch: query.refetch,
  };
}

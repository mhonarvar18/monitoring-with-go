import { useQuery } from "@tanstack/react-query";
import {
  type UserSetting,
  fetchUserSettings,
} from "../services/userSetting.service";

export function useUserSettings() {
  const query = useQuery<UserSetting[], Error>({
    queryKey: ["userSettings"],
    queryFn: fetchUserSettings,
  });

  return {
    settings: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}

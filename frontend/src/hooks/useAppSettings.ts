import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useAppSettings = () => {
  const fetchAppSettings = useQuery({
    queryFn: () => api.get("/admin/appSettings"),
    queryKey: ["appSettings"],
  });

  const updateAppSettings = useMutation({
    mutationFn: ({ settingId, value }: { settingId: number; value: string }) =>
      api.put(`/admin/appSettings/${settingId}`, { value }),
  });

  return { fetchAppSettings, updateAppSettings };
};

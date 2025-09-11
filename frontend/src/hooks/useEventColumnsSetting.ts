import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface Params {
  settingId?: number | string;
  data?: {
    key?: string;
    value?: string;
  };
}


// Fetch current settings
export const fetchSetting = async () => {
  const response = await api.get("/admin/personal-settings/userSetting");
  return response.data;
};

// Update settings by settingId
const updateColumnsLayout = async ({ data, settingId }: Params) => {
  return await api.put(`/admin/personal-settings/${settingId}`, data);
};

const resetOrder = async ({ data, settingId }: Params) => {
  return await api.put(`/admin/personal-settings/reset/${settingId}`, data);
};

const resetVisibility = async ({ data, settingId }: Params) => {
  return await api.put(
    `/admin/personal-settings/reset/${settingId}`,
    data
  );
};

const saveHiddenColumns = async ({data , settingId } : Params) => {
    return await api.put(`/admin/personal-settings/${settingId}` , data)
}

// Hook to fetch settings
export const useEventColumnSetting = () => {
  return useQuery({
    queryKey: ["event-column-settings"],
    queryFn: fetchSetting,
  });
};

// Hook to update settings
export const useUpdateColsLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateColumnsLayout,
    onSuccess: () => {
      // Refetch the settings after update
      queryClient.invalidateQueries({ queryKey: ["event-column-settings"] });
    },
  });
};

// Hook to reset column order
export const useResetOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetOrder,
    onSuccess: () => {
      // Refetch the settings after reset
      queryClient.invalidateQueries({ queryKey: ["event-column-settings"] });
    },
  });
};

// Hook to reset visibillity
export const useResetVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetVisibility,
    onSuccess: () => {
      // Refetch the settings after reset
      queryClient.invalidateQueries({ queryKey: ["event-column-settings"] });
    },
  });
};

export const useSaveHiddenColumns = () => {
    const queryClient = useQueryClient()
      return useMutation({
    mutationFn: saveHiddenColumns,
    onSuccess: () => {
      // Refetch the settings after reset
      queryClient.invalidateQueries({ queryKey: ["event-column-settings"] });
    },
  });
}

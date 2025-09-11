// src/hooks/usePersonalSetting.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface PersonalSettingPayload {
  key: string;
  value: string;
  userId: string | number;
}

const personalSettingService = async (payload: PersonalSettingPayload) => {
  const { data } = await api.post(`/admin/personal-settings`, payload);
  return data;
};

export async function fetchPersonalSettings(): Promise<PersonalSettingPayload[]> {
  const { data } = await api.get(`/admin/personal-settings`);
  return data.data;
}

// query: get settings
export const usePersonalSettings = () => {
  return useQuery({
    queryKey: ["personalSettings"],
    queryFn: fetchPersonalSettings,
  });
};

// mutation: edit setting
export const usePersonalSetting = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: personalSettingService,
    onSuccess: (data) => {
      // invalidate cached settings list after update
      queryClient.invalidateQueries({ queryKey: ["personalSettings"] });
      onSuccess?.(data);
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  return { editPersonalSetting: mutation.mutate, ...mutation };
};

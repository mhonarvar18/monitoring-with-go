import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api"; // your axios/fetch wrapper
import type { AxiosResponse } from "axios";

export function useConfirmEvents() {
  const qc = useQueryClient();

  return useMutation<AxiosResponse<any>, Error, string[]>({
    mutationFn: (eventIds) => api.post("/admin/events/confirm", { eventIds }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useConfirmAllEvents() {
  const qc = useQueryClient();

  return useMutation<
    AxiosResponse<any>,
    Error,
    { alarmCategoryId: string | number; stateId: string | number }
  >({
    mutationFn: ({ alarmCategoryId, stateId }) =>
      api.post("/admin/events/confirmAll", { alarmCategoryId, stateId }),
    onSuccess: () => {
      // refetch the events list
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

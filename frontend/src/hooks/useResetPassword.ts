import { useCallback } from "react";
import api from "../services/api";
import type { UseSettingCardOptions } from "./userSettingActions";
import { useMutation, useQuery } from "@tanstack/react-query";

type ResetPasswordPayload = {
  username: "string";
  password: "string";
  phoneNumber: "string";
};

const resetPasswordService = async (data: ResetPasswordPayload) =>
  api.post("/register/reset-password", data);

export function useResetPassword({
  onSuccess,
  onError,
}: UseSettingCardOptions = {}) {
  const resetPassword = useCallback(
    async (formData: ResetPasswordPayload) => {
      try {
        await resetPasswordService(formData);
        onSuccess?.(); // Call success callback if provided
      } catch (error) {
        onError?.(error); // Call error callback if provided
      }
    },
    [onSuccess, onError]
  );

  return { resetPassword };
}

export const useConfirmResetPass = (options = {}) =>
  useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (payload: { requestId: string }) =>
      api.post("/register/confirm-reset-password", payload),
    ...options,
  });
export const useRejectResetPass = (options = {}) =>
  useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (payload: { requestId: string }) =>
      api.delete(`/register/reset-password/reject`, {
        data: payload,
      }),
    ...options,
  });

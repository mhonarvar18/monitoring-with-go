import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import type { PendingUser } from "../services/reqRegister.service";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../types/stylesToast";

interface UsePendingUserActionsResult {
  confirmUser: (id: string | number) => Promise<void>;
  rejectUser: (id: string | number) => Promise<void>;
  editUser: (id: string | number, updates: Partial<PendingUser>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

type EditVars = { id: string | number; updates: Partial<PendingUser> };

export function usePendingUserActions(): UsePendingUserActionsResult {
  const confirmMutation = useMutation<void, Error, string | number>({
    mutationFn: async (id) => {
      await api.post(`/register/complete-profile/${String(id)}`);
    },
    onSuccess: () =>
      toast.success("کاربر با موفقیت تایید شد.", { style: successStyle }),
    onError: (err) =>
      toast.error(err.message || "خطا در تایید کاربر.", { style: errorStyle }),
  });

  const rejectMutation = useMutation<void, Error, string | number>({
    mutationFn: async (id) => {
      await api.delete(`/register/reject/${String(id)}`);
    },
    onSuccess: () =>
      toast.success("کاربر با موفقیت رد شد.", { style: successStyle }),
    onError: (err) =>
      toast.error(err.message || "خطا در رد کاربر.", { style: errorStyle }),
  });

  const editMutation = useMutation<void, Error, EditVars>({
    mutationFn: async ({ id, updates }) => {
      await api.put(`/register/update/${String(id)}`, updates);
    },
    onSuccess: () =>
      toast.success("کاربر با موفقیت ویرایش شد.", { style: successStyle }),
    onError: (err) =>
      toast.error(err.message || "خطا در ویرایش کاربر.", { style: errorStyle }),
  });

  return {
    confirmUser: (id) => confirmMutation.mutateAsync(id),
    rejectUser: (id) => rejectMutation.mutateAsync(id),
    editUser: (id, updates) => editMutation.mutateAsync({ id, updates }),
    isLoading:
      confirmMutation.status === "pending" ||
      rejectMutation.status === "pending" ||
      editMutation.status === "pending",
    error:
      confirmMutation.error?.message ||
      rejectMutation.error?.message ||
      editMutation.error?.message ||
      null,
  };
}

// hooks/useAlarmCategoryCrud.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { alarmCategoryCrudService } from "../services/alarmCategoriesCrud.service";
import type { AlarmCategoryInput } from "../services/alarmCategoriesCrud.service";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../types/stylesToast";

const clean = (data: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== "" && v != null)
  );

const getErrMsg = (err: any) =>
  err?.response?.data?.message || err?.message || "خطایی رخ داد.";

export function useAlarmCategoryCrud() {
  const qc = useQueryClient();

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (payload: AlarmCategoryInput) => {
      const res = await alarmCategoryCrudService.createAlarmCategory(
        clean(payload) as AlarmCategoryInput
      );
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "دسته‌بندی با موفقیت ایجاد شد.", {
        style: successStyle,
      });
      void qc.invalidateQueries({ queryKey: ["alarmCategories"] });
    },
    onError: (err: any) => {
      toast.error(getErrMsg(err), { style: errorStyle });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      payload: Partial<AlarmCategoryInput>;
    }) => {
      const res = await alarmCategoryCrudService.updateAlarmCategory(
        vars.id,
        clean(vars.payload) as AlarmCategoryInput
      );
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "دسته‌بندی با موفقیت ویرایش شد.", {
        style: successStyle,
      });
      void qc.invalidateQueries({ queryKey: ["alarmCategories"] });
    },
    onError: (err: any) => {
      toast.error(getErrMsg(err), { style: errorStyle });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await alarmCategoryCrudService.deleteAlarmCategory(id);
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "دسته‌بندی با موفقیت حذف شد.", {
        style: successStyle,
      });
      void qc.invalidateQueries({ queryKey: ["alarmCategories"] });
    },
    onError: (err: any) => {
      toast.error(getErrMsg(err), { style: errorStyle });
    },
  });

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const error = useMemo<string | null>(() => {
    const e =
      (createMutation.error as any) ||
      (updateMutation.error as any) ||
      (deleteMutation.error as any);
    return e ? getErrMsg(e) : null;
  }, [createMutation.error, updateMutation.error, deleteMutation.error]);

  const resetError = () => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  };

  return {
    // keep the same external API:
    createAlarmCategory: (payload: AlarmCategoryInput) =>
      createMutation.mutateAsync(payload),
    updateAlarmCategory: (id: string | number, payload: Partial<AlarmCategoryInput>) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteAlarmCategory: (id: string | number) =>
      deleteMutation.mutateAsync(id),

    loading,
    error,
    resetError,
  };
}

// hooks/useZoneTypeCrud.ts
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zoneTypeCrudService } from "../services/zoneTypeCrud.service";
import type { ZoneTypeInput } from "../services/zoneTypeCrud.service";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../types/stylesToast";

type ApiMessage = { message?: string };

const clean = <T extends object>(data: T): T => {
  const out = {} as T;
  (Object.keys(data) as Array<keyof T>).forEach((key) => {
    const v = (data as any)[key];
    if (!(typeof v === "string" && v === "") && v != null) {
      (out as any)[key] = v;
    }
  });
  return out;
};

type AxiosErrorLike = { response?: { data?: { message?: string } }; message?: string };
const getErrMsg = (err: unknown): string =>
  (err as AxiosErrorLike)?.response?.data?.message ||
  (err as AxiosErrorLike)?.message ||
  "خطای نامشخص";

export function useZoneTypeCrud() {
  const qc = useQueryClient();

  const createMutation = useMutation<ApiMessage, Error, ZoneTypeInput>({
    mutationFn: async (payload) => {
      const { data } = await zoneTypeCrudService.createZoneType(clean(payload));
      return data as ApiMessage;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "نوع زون با موفقیت ایجاد شد.", { style: successStyle });
      void qc.invalidateQueries({ queryKey: ["zoneTypes"] });
    },
    onError: (err) => {
      toast.error(getErrMsg(err) || "خطا در ایجاد نوع زون.", { style: errorStyle });
    },
  });

  const updateMutation = useMutation<ApiMessage, Error, { id: string | number; payload: ZoneTypeInput }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await zoneTypeCrudService.updateZoneType(id, clean(payload));
      return data as ApiMessage;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "نوع زون با موفقیت ویرایش شد.", { style: successStyle });
      void qc.invalidateQueries({ queryKey: ["zoneTypes"] });
    },
    onError: (err) => {
      toast.error(getErrMsg(err) || "خطا در ویرایش نوع زون.", { style: errorStyle });
    },
  });

  const deleteMutation = useMutation<ApiMessage, Error, string | number>({
    mutationFn: async (id) => {
      const { data } = await zoneTypeCrudService.deleteZoneType(id);
      return data as ApiMessage;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "نوع زون با موفقیت حذف شد.", { style: successStyle });
      void qc.invalidateQueries({ queryKey: ["zoneTypes"] });
    },
    onError: (err) => {
      toast.error(getErrMsg(err) || "خطا در حذف نوع زون.", { style: errorStyle });
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const error = useMemo<string | null>(() => {
    const e = createMutation.error ?? updateMutation.error ?? deleteMutation.error;
    return e ? getErrMsg(e) : null;
  }, [createMutation.error, updateMutation.error, deleteMutation.error]);

  return {
    createZoneType: (payload: ZoneTypeInput) => createMutation.mutateAsync(payload),
    updateZoneType: (id: string | number, payload: ZoneTypeInput) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteZoneType: (id: string | number) => deleteMutation.mutateAsync(id),
    loading,
    error,
    resetError: () => {
      createMutation.reset();
      updateMutation.reset();
      deleteMutation.reset();
    },
  };
}

import {
  fetchPanelTypes,
  createPanelType,
  updatePanelType,
  deletePanelType,
  type PanelTypeData,
  type PanelTypeInput,
} from "../services/panelType.service";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { errorStyle, successStyle } from "../types/stylesToast";
import toast from "react-hot-toast";

export function usePanelTypeCrud(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const queryClient = useQueryClient();

  const {
    data: panelData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["panelTypes", page, limit],
    queryFn: () => fetchPanelTypes(page, limit),
  });

  const createPanelTypeMutation = useMutation({
    mutationFn: createPanelType,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["panelTypes"] });
      toast.success(res?.message || "نوع پنل با موفقیت ایجاد شد.", {
        style: successStyle,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err.message || "خطا در ایجاد نوع پنل.",
        { style: errorStyle }
      );
    },
  });

  const updatePanelTypeMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: Partial<PanelTypeInput>;
    }) => updatePanelType(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["panelTypes"] });
      toast.success(res?.message || "نوع پنل با موفقیت ویرایش شد.", {
        style: successStyle,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err.message || "خطا در ویرایش نوع پنل.",
        { style: errorStyle }
      );
    },
  });

  const deletePanelTypeMutation = useMutation({
    mutationFn: (id: string | number) => deletePanelType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panelTypes"] });
    },
    onError: () => {
      toast.error("خطا در حذف نوع پنل.", { style: errorStyle });
    },
  });

  return {
    data: panelData?.data ?? [],
    total: panelData?.total ?? 0,
    totalPages: panelData?.totalPages ?? 1,
    loading,
    error: error ? "خطا در دریافت داده‌ها" : null,
    page,
    limit,
    setPage,
    setLimit,
    refetch,
    createPanelType: (
      payload: PanelTypeInput,
      options?: Parameters<typeof createPanelTypeMutation.mutateAsync>[1]
    ) => createPanelTypeMutation.mutateAsync(payload, options),

    updatePanelType: (
      id: string | number,
      payload: Partial<PanelTypeInput>,
      options?: Parameters<typeof updatePanelTypeMutation.mutateAsync>[1]
    ) => updatePanelTypeMutation.mutateAsync({ id, payload }, options),

    deletePanelType: (
      id: string | number,
      options?: Parameters<typeof deletePanelTypeMutation.mutateAsync>[1]
    ) => deletePanelTypeMutation.mutateAsync(id, options),
  };
}

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchCrudService } from "../services/branchCrud.service";
import type { BranchInput } from "../services/branchCrud.service";
import type { BranchAll } from "../types/BranchAll";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../types/stylesToast";

const clean = <T extends object>(data: T): T => {
  const result = {} as T;
  (Object.keys(data) as Array<keyof T>).forEach((key) => {
    const value = data[key];
    if (!(typeof value === "string" && value === "")) {
      (result as any)[key] = value;
    }
  });
  return result;
};

const getErrMsg = (err: unknown): string => {
  const anyErr = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
  return anyErr?.response?.data?.message || anyErr?.message || "خطای نامشخص";
};

export function useBranchCrud() {
  const qc = useQueryClient();

  // CREATE
  const createMutation = useMutation<BranchAll, Error, BranchInput>({
    mutationFn: async (payload) => {
      const res = await branchCrudService.createBranch(clean<BranchInput>(payload));
      return res.data.data as BranchAll;
    },
    onSuccess: () => {
      toast.success("شعبه با موفقیت ایجاد شد.", { style: successStyle });
      void qc.invalidateQueries({ queryKey: ["branches"], exact: false });
      void qc.invalidateQueries({ queryKey: ["branchesByCity"], exact: false });
    },
    onError: (err) => {
      toast.error(getErrMsg(err) || "خطا در ایجاد شعبه", { style: errorStyle });
    },
  });

  // UPDATE
  const updateMutation = useMutation<
    BranchAll,
    Error,
    { id: string | number; data: Partial<BranchInput> }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await branchCrudService.updateBranch(id, clean<Partial<BranchInput>>(data));
      return res.data.data as BranchAll;
    },
    onSuccess: () => {
      toast.success("شعبه با موفقیت ویرایش شد.", { style: successStyle });
      void qc.invalidateQueries({ queryKey: ["branches"], exact: false });
      void qc.invalidateQueries({ queryKey: ["branchesByCity"], exact: false });
    },
    onError: (err) => {
      toast.error(getErrMsg(err) || "خطا در ویرایش شعبه", { style: errorStyle });
    },
  });

  // DELETE
  const deleteMutation = useMutation<boolean, Error, { id: number | string }>({
    mutationFn: async ({ id }) => {
      await branchCrudService.deleteBranch(id);
      return true;
    },
    onSuccess: () => {
      toast.success("شعبه با موفقیت حذف شد.", { style: successStyle });
      void qc.invalidateQueries({ queryKey: ["branches"], exact: false });
      void qc.invalidateQueries({ queryKey: ["branchesByCity"], exact: false });
    },
    onError: (err) => {
      toast.error(getErrMsg(err) || "خطا در حذف شعبه", { style: errorStyle });
    },
  });

  const loading =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const error = useMemo<string | null>(() => {
    const e = createMutation.error ?? updateMutation.error ?? deleteMutation.error;
    return e ? getErrMsg(e) : null;
  }, [createMutation.error, updateMutation.error, deleteMutation.error]);

  return {
    loading,
    error,
    resetError: () => {
      createMutation.reset();
      updateMutation.reset();
      deleteMutation.reset();
    },

    createBranch: async (data: BranchInput): Promise<BranchAll | null> => {
      try {
        return await createMutation.mutateAsync(data);
      } catch {
        return null;
      }
    },

    updateBranch: async (
      id: string | number,
      data: Partial<BranchInput>
    ): Promise<BranchAll | null> => {
      try {
        return await updateMutation.mutateAsync({ id, data });
      } catch {
        return null;
      }
    },

    deleteBranch: async (id: number | string): Promise<boolean> => {
      try {
        return await deleteMutation.mutateAsync({ id });
      } catch {
        return false;
      }
    },
  };
}

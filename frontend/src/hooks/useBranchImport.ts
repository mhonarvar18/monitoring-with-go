import { useState } from "react";
import { importBranchesExcel } from "../services/branchImport.service";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../types/stylesToast";

export function useBranchImport() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);

  const importExcel = async (file: File) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await importBranchesExcel(file);
      setResult(data);
      toast.success(data?.message || "ایمپورت با موفقیت انجام شد.", {
        style: successStyle,
      });
      return data;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "خطا در ایمپورت فایل اکسل",
        {
          style: errorStyle,
        }
      );
      setResult(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { importExcel, loading, result };
}

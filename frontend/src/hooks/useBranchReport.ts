import { useState, useCallback } from "react";
import { type BranchReportRequest, type BranchReportData, fetchBranchReport } from "../services/mapBranchReport.service";

export function useBranchReport() {
  const [data, setData] = useState<BranchReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We expose a fetcher for more flexibility:
  const fetchReport = useCallback(async (body: BranchReportRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBranchReport(body);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "خطا در دریافت اطلاعات");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchReport };
}

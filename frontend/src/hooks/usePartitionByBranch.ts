import { useEffect, useState } from "react";
import {
  fetchPartitionByBranch,
  type Partition,
} from "../services/partition.service";

interface UsePartitionByBranchProps {
  branchId: number | null | undefined | string;
  page?: number;
  limit?: number;
}

export function usePartitionByBranch({
  branchId,
  page = 1,
  limit = 10,
}: UsePartitionByBranchProps) {
  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const loadPartitionByBranch = async () => {
      setLoading(true);
      setError(null);
      if (branchId === null || branchId === undefined) {
        setPartitions([]);
        setLoading(false);
        return;
      }
      try {
        const response = await fetchPartitionByBranch(branchId, limit, page);
        setPartitions(response.data.data); // Nested data!
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch {
        setError("خطا در دریافت اطلاعات");
      } finally {
        setLoading(false);
      }
    };
    loadPartitionByBranch();
  }, [branchId, page, limit, refetchIndex]);

  const refetch = () => setRefetchIndex((i) => i + 1);

  return { partitions, loading, error, total, totalPages, refetch };
}

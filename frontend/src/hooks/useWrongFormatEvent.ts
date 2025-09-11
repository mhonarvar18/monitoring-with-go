import { useQuery } from "@tanstack/react-query";
import { fetchWrongFormatBranches } from "../services/wrongFormat.service";
import type { WrongFormatEvent } from "../services/wrongFormat.service";

export interface UseWrongFormatEventOptions {
  enabled?: boolean;
}

export function UseWrongFormatEvent({
  enabled = true,
}: UseWrongFormatEventOptions = {}) {
  const query = useQuery<WrongFormatEvent[], Error>({
    queryKey: ["wrongFormatEvents"],
    queryFn: fetchWrongFormatBranches,
    enabled, // only fetch when enabled is true
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}

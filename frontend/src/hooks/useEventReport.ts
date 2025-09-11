import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEventReport,
  type EventReportItem,
  type EventReportRequest,
  type EventReportResponse,
} from "../services/EventReport.service";

export const useEventReport = (initialParams?: EventReportRequest) => {
  const qc = useQueryClient();

  const [params, setParams] = useState<EventReportRequest | undefined>(undefined);

  // run initial fetch ONLY once on mount (if provided)
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current && initialParams) {
      didInit.current = true;
      setParams(initialParams);
    }
  }, [initialParams]);

  const queryKey = useMemo(
    () => ["eventReport", params?.locationType, params?.parentId ?? null] as const,
    [params?.locationType, params?.parentId]
  );

  const query = useQuery<EventReportResponse, Error, EventReportItem[]>({
    queryKey,
    enabled: !!params,
    queryFn: () => fetchEventReport(params as EventReportRequest),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    // v5 replacement for keepPreviousData
    placeholderData: (prev) => prev,
    // make query.data be EventReportItem[]
    select: (resp) => resp.data ?? [],
  });

  // stable identity; also fills cache and returns items
  const fetchReport = useCallback(
    async (next: EventReportRequest): Promise<EventReportItem[]> => {
      setParams(next); // triggers useQuery with new key
      const resp = await qc.fetchQuery({
        queryKey: ["eventReport", next.locationType, next.parentId ?? null] as const,
        queryFn: () => fetchEventReport(next),
        staleTime: 60_000,
      });
      return resp.data ?? [];
    },
    [qc]
  );

  return {
    data: query.data ?? null,                // EventReportItem[] | null
    loading: query.isFetching || query.isPending,
    error: query.error?.message ?? null,
    lastParams: params,
    fetchReport,                             // stable
  };
};
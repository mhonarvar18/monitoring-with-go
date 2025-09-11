// hooks/useAlarms.ts
import { useState, useRef, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type QueryKey,
} from "@tanstack/react-query";
import {
  fetchAlarms,
  updateAlarm,
  type AlarmData,
  type AlarmInput,
} from "../services/alarms.service";

interface UseAlarmsReturn {
  data: AlarmData[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  refetch: () => void;
}

type AlarmsResponse = {
  data: AlarmData[];
  total: number;
  totalPages: number;
};

const MAX_CACHED_PAGES = 4; // keep only the last 4 visited pages

const getErrMsg = (err: unknown) =>
  (err as any)?.response?.data?.message ||
  (err as Error)?.message ||
  "An error occurred.";

export const useAlarms = (
  initialPage: number = 1,
  initialLimit: number = 10
): UseAlarmsReturn & {
  updateAlarmById: (id: number, payload: AlarmInput) => Promise<void>;
} => {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  const qc = useQueryClient();

  const currentKey: QueryKey = ["alarms", page, limit];

  // LRU of visited pages (per limit). We keep only the most recent N keys.
  const lruKeysRef = useRef<string[]>([]);
  useEffect(() => {
    const str = JSON.stringify(currentKey);
    const list = lruKeysRef.current;

    // move current to front
    const idx = list.indexOf(str);
    if (idx !== -1) list.splice(idx, 1);
    list.unshift(str);

    // trim to MAX_CACHED_PAGES by removing oldest from cache
    while (list.length > MAX_CACHED_PAGES) {
      const drop = list.pop()!;
      const dropKey = JSON.parse(drop) as QueryKey;
      qc.removeQueries({ queryKey: dropKey, exact: true });
    }
  }, [currentKey, qc]);

  const query = useQuery<AlarmsResponse, Error>({
    queryKey: currentKey,
    queryFn: () => fetchAlarms(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 4 * 60 * 1000, // keep page "fresh" for 2 minutes (no refetch)
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  type Ctx = { previous: Array<[QueryKey, AlarmsResponse | undefined]> };

  const mutation = useMutation<
    void,
    Error,
    { id: number; payload: AlarmInput },
    Ctx
  >({
    // Optimistic patch across cached pages only (those still in cache)
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: ["alarms"] });
      const previous = qc.getQueriesData<AlarmsResponse>({
        queryKey: ["alarms"],
      });

      previous.forEach(([key, old]) => {
        if (!old) return;
        const patched: AlarmsResponse = {
          ...old,
          data: old.data.map((a) =>
            a.id === id ? ({ ...a, ...payload } as AlarmData) : a
          ),
        };
        qc.setQueryData(key, patched);
      });

      return { previous };
    },
    mutationFn: async ({ id, payload }) => {
      await updateAlarm(id, payload);
    },
    onError: (_err, _vars, ctx) => {
      ctx?.previous?.forEach(([key, old]) => qc.setQueryData(key, old));
    },
    // Intentionally no invalidate to avoid refetch; call refetch() when needed.
  });

  const updateAlarmById = (id: number, payload: AlarmInput) =>
    mutation.mutateAsync({ id, payload }).then(() => void 0);

  return {
    data: query.data?.data ?? [],
    loading: query.isLoading || mutation.isPending,
    error: query.error
      ? getErrMsg(query.error)
      : mutation.error
      ? getErrMsg(mutation.error)
      : null,
    page,
    limit,
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    setPage,
    setLimit,
    updateAlarmById,
    refetch: () => {
      void query.refetch();
    },
  };
};

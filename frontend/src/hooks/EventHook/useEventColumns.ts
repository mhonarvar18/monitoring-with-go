import { useMemo } from "react";
import {
  eventColumns,
  type MyColumnDef,
} from "../../components/Columns/EventColumns";
import type { Event as AppEvent } from "../../types/Event";

type EnrichedEvent = AppEvent & { alarmColor: string; audioUrl: string | null };

const TYPO_MAP: Record<string, string> = {
  confirmationStatus: "confermationStatus",
};

export function useEventColumns(
  settings: any | undefined,
  deps: { page: number; limit: number; totalRecords: number },
  onCreate: (e: EnrichedEvent) => void
) {
  return useMemo<MyColumnDef<EnrichedEvent>[]>(() => {
    const hiddenSetting = settings?.data?.find(
      (i: any) => i.key === "events_hidden_Coulmn"
    );
    const indexSetting = settings?.data?.find(
      (i: any) => i.key === "events_index_coulmn"
    );

    const parse = (raw?: string) => {
      if (!raw) return {} as Record<string, unknown>;
      try {
        const val = JSON.parse(raw) as Record<string, unknown>;
        // apply typo map without mutating the source
        const fixed: Record<string, any> = { ...val };
        for (const k in TYPO_MAP)
          if (k in fixed) {
            fixed[TYPO_MAP[k]] = fixed[k];
            delete fixed[k];
          }
        return fixed;
      } catch {
        return {} as Record<string, unknown>;
      }
    };

    const hidden = parse(hiddenSetting?.value) as Record<string, boolean>;
    const indices = parse(indexSetting?.value) as Record<string, number>;

    return eventColumns({
      onCreate,
      currentPage: deps.page,
      pageSize: deps.limit,
      totalRecords: deps.totalRecords,
    })
      .filter((col) => hidden[(col as any).accessorKey ?? col.id] === false)
      .sort((a, b) => {
        const keyA = (a as any).accessorKey ?? a.id;
        const keyB = (b as any).accessorKey ?? b.id;
        return (indices[keyA] ?? 999) - (indices[keyB] ?? 999);
      });
  }, [settings, deps.page, deps.limit, deps.totalRecords, onCreate]);
}

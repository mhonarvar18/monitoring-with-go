import { useCallback } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { fetchCategoriesById } from "../services/alarmCategory.service";

export function useCategoryLabel() {
  const qc = useQueryClient();

  const getCategoryLabel = useCallback(
    async (id: number | string): Promise<string> => {
      if (id === null || id === undefined || id === ("" as any)) return "";

      const key: QueryKey = ["categoryLabel", id];
      const cached = qc.getQueryData<string>(key);
      if (cached) return cached;
      const resp = await fetchCategoriesById(id);
      const label: string =
        (resp as any)?.data?.label ??
        (resp as any)?.data?.data?.label ??
        (resp as any)?.label ??
        String(id);

      qc.setQueryData<string>(key, label);
      return label;
    },
    [qc]
  );

  return { getCategoryLabel };
}

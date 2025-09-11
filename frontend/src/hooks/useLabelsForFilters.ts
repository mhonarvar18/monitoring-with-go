import { useEffect, useState } from "react";

export function useLabelsForFilters(activeFilters, resolvers) {
  const [labels, setLabels] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function fetchLabels() {
      const entries = Object.entries(resolvers);
      const promises = entries.map(async ([key, resolver]) => {
        const id = activeFilters[key];
        if (typeof resolver === "function" && id) {
          const label = await resolver(id);
          return [key, label];
        }
        return [key, undefined];
      });
      const results = await Promise.all(promises);
      if (!cancelled) {
        setLabels(Object.fromEntries(results));
      }
    }
    fetchLabels();
    return () => {
      cancelled = true;
    };
  }, [activeFilters, resolvers]);

  return labels;
}

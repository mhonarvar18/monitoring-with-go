import { useState, useEffect, useCallback } from "react";
import { fetchEvents } from "../services/events.service";
import type { EventData } from "../services/events.service";

export function useEvents(
  page: number,
  limit: number,
  confermationStatus: string,
  locationId?: number | string,
  alarmCategoryId?: number | string,
  enabled: boolean = true // Add enabled parameter with default true
) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(enabled); // Only show loading if enabled
  const [error, setError] = useState<string | null>(null);

  const [refreshIndex, setRefreshIndex] = useState(0);
  const refetch = useCallback(() => {
    if (enabled) {
      // Only allow refetch if enabled
      setRefreshIndex((i) => i + 1);
    }
  }, [enabled]);

  useEffect(() => {
    // If not enabled, reset state and return early
    if (!enabled) {
      setEvents([]);
      setTotalPages(0);
      setTotalRecords(0);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchEvents(page, limit, confermationStatus, locationId, alarmCategoryId)
      .then((res) => {
        if (!mounted) return;
        setEvents(res.data.events);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || "خطا در دریافت رویدادها");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [
    page,
    limit,
    confermationStatus,
    locationId,
    alarmCategoryId,
    refreshIndex,
    enabled,
  ]);

  return { events, totalPages, totalRecords, loading, error, refetch };
}

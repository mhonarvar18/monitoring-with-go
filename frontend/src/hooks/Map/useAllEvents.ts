import { useState, useCallback } from "react";
import { fetchEvents } from "../../services/events.service";
import type { EventData } from "../../services/events.service";

const MIN_LIMIT = 10;

export function useAllEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllEvents = useCallback(async (
    limitParam: number,
    confermationStatus: string,
    locationId?: number | string,
    alarmCategoryId?: number | string,
  ) => {
    setLoading(true);
    setError(null);
    setEvents([]); // Reset

    // enforce: at least 10
    const safeLimit = Number.isFinite(limitParam)
      ? Math.max(MIN_LIMIT, Math.floor(limitParam))
      : MIN_LIMIT;

    try {
      // 1) صفحه اول برای به‌دست آوردن totalPages
      const initialResponse = await fetchEvents(
        1,
        safeLimit,
        confermationStatus,
        locationId,
        alarmCategoryId
      );

      const { totalPages } = initialResponse.data;
      let allEvents: EventData[] = [];

      if (totalPages > 1) {
        // 2) بقیهٔ صفحات با همان safeLimit
        const pagePromises: Promise<any>[] = [];
        for (let page = 1; page <= totalPages; page++) {
          pagePromises.push(
            fetchEvents(page, safeLimit, confermationStatus, locationId, alarmCategoryId)
          );
        }
        const responses = await Promise.all(pagePromises);
        responses.forEach((res) => { allEvents.push(...res.data.events); });
      } else {
        allEvents = initialResponse.data.events;
      }

      setEvents(allEvents);
      return allEvents;
    } catch (e: any) {
      const errorMessage = e?.message || "خطا در دریافت رویدادها";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, loading, error, fetchAllEvents };
}

import { useState, useEffect, useRef, useCallback } from "react";
import {
  initializeSocket,
  disconnectSocket,
  listenToEvents,
  stopListeningToEvents,
  requestFilterEvents,
} from "../lib/socket";
import { useAlarmSettings } from "./useUserSetting";
import type { Event } from "../types/Event"; // Import the Event type

interface Payload {
  currentPage: number;
  totalRecords: number;
  totalPages: number;
  events: Event[];
}

interface Params {
  page: number;
  limit: number;
  [key: string]: any;
}

const processEvent = (
  event: Event,
  alarmSettings: any
): Event & { alarmColor: string; audioUrl: string | null } => {
  const catId = event.alarm?.category?.id ?? event.alarm?.category;
  const setting = alarmSettings.find((s: any) => s.alarmCategoryId === catId);
  return {
    ...event,
    alarmColor: setting?.alarmColor ?? "transparent",
    audioUrl: setting?.audioUrl ?? null,
  };
};

// Custom hook, constrained to T which extends Event
export function useEventsSocket<T extends Event = Event>({
  page,
  limit,
  filters,
  refreshKey = 0,
}: {
  page: number;
  limit: number;
  filters: Record<string, any>;
  refreshKey?: any;
}) {
  const { settings: alarmSettings } = useAlarmSettings();
  const [data, setData] = useState<
    Array<T & { alarmColor: string; audioUrl: string | null }>
  >([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const played = useRef<Set<string | number>>(new Set());
  const audioMap = useRef<Record<string, HTMLAudioElement>>({});

  const playAudio = useCallback((audioUrl: string) => {
    if (!audioMap.current[audioUrl]) {
      audioMap.current[audioUrl] = new Audio(audioUrl);
    }
    audioMap.current[audioUrl]
      .play()
      .catch((err) =>
        console.error("Audio play error for", audioUrl, ":", err)
      );
  }, []);

  useEffect(() => {
    let isSocketReceived = false;
    let isApiFinished = false;

    const updateLoading = () => {
      if (isSocketReceived && isApiFinished) {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      initializeSocket(token);
    }

    const handleEvents = (obj: Payload | Event) => {
      isSocketReceived = true;
      if ("events" in obj) {
        const enrichedEvents = obj.events.map((ev) =>
          processEvent(ev, alarmSettings)
        );
        setData(
          enrichedEvents as Array<
            T & { alarmColor: string; audioUrl: string | null }
          >
        );
        setTotalPages(obj.totalPages || 1);
        setTotalRecords(obj.totalRecords || 0);
      } else {
        const enrichedEvent = processEvent(obj as Event, alarmSettings);
        if (enrichedEvent.audioUrl && !played.current.has(enrichedEvent.id)) {
          playAudio(enrichedEvent.audioUrl);
          played.current.add(enrichedEvent.id);
        }
        setData((prev) =>
          [
            enrichedEvent as T & {
              alarmColor: string;
              audioUrl: string | null;
            },
            ...prev,
          ].slice(0, limit)
        );
        setTotalPages(
          Math.max(totalPages, Math.ceil(((page - 1) * limit + 1) / limit))
        );
      }
      updateLoading();
    };

    listenToEvents(
      handleEvents,
      Object.values(filters).some((v) => v !== null)
    );

    const params: Params = { page, limit, ...filters };
    Promise.resolve(requestFilterEvents(params)).finally(() => {
      isApiFinished = true;
      updateLoading();
    });

    return () => {
      stopListeningToEvents();
      disconnectSocket();
    };
  }, [page, limit, filters, alarmSettings, playAudio, refreshKey]);

  return { data, totalPages, totalRecords, loading };
}

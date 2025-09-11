import type { Branch, Employee, Zone } from "../types/Event";
import { normalizeHM, normalizeYMD } from "../utils/num";
import api from "./api";
import type { BranchLocation } from "./mapBranchReport.service";
import type { Partition } from "./partition.service";

export interface EventData {
  id: string | number;
  date: string; // e.g. "2024-10-21"
  time: string; // e.g. "11:34"
  ip: string;
  referenceId: string | string;
  originalBranchCode: string;
  originalPartitionId: string;
  originalEmployeeId: string;
  originalZoneId: string;
  location: BranchLocation
  confermationStatus: string;
  description: string;
  branch: Branch;
  partition: Partition;
  zone: Zone;
  employee: Employee | null;
  action: string;
  alarm: {
    id: string | number;
    label: string;
    code: number;
    protocol: string;
    category: { id: string | number };
  };
}

export interface EventsResponse {
  statusCode: number;
  message: string;
  data: {
    totalPages: number;
    totalRecords: number;
    currentPage: number;
    events: EventData[];
  };
}

/**
 * Fetch events with server-side pagination & optional filters
 */
export async function fetchEvents(
  page: number,
  limit: number,
  confermationStatus: string,
  locationId?: string | number,
  alarmCategoryId?: string | number
): Promise<EventsResponse> {
  const payload: Record<string, any> = { page, limit, confermationStatus };
  if (locationId != null) payload.locationId = locationId;
  if (alarmCategoryId != null) payload.alarmCategoryId = alarmCategoryId;

  const response = await api.post<EventsResponse>("/admin/events", payload);
  return response.data;
}

export async function fetchAllEvents(filters: {
  alarmCategoryId?: number | string;
  locationId?: number | string;
  branchId?: number | string;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  limit?: number; // -1 | undefined => all pages, N>=1 => first page with N rows
}): Promise<EventData[]> {
  const {
    alarmCategoryId,
    locationId,
    branchId,
    startDate,
    endDate,
    startTime,
    endTime,
    limit,
  } = filters;

  const sd = normalizeYMD(startDate);
  const ed = normalizeYMD(endDate);
  const st = normalizeHM(startTime);
  const et = normalizeHM(endTime);

  const fetchAll = limit == null || limit === -1;

  // Helper to build payload with only defined fields
  const buildPayload = (page: number, pageSize: number) => {
    const payload: Record<string, any> = { page, limit: pageSize };
    if (alarmCategoryId !== undefined) payload.alarmCategoryId = alarmCategoryId;
    if (locationId !== undefined) payload.locationId = locationId;
    if (branchId !== undefined) payload.branchId = branchId;
    if (sd) payload.startDate = sd;
    if (ed) payload.endDate = ed;
    if (st) payload.startTime = st;
    if (et) payload.endTime = et;
    return payload;
  };

  if (!fetchAll) {
    // Single request: page 1 with page size = limit
    const pageSize = Math.max(1, Number(limit));
    const response = await api.post<EventsResponse>(
      "/admin/events",
      buildPayload(1, pageSize)
    );
    const firstPage = response?.data?.data?.events ?? [];
    // Slice defensively in case backend sends more
    return firstPage.slice(0, pageSize);
  }

  // Fetch all pages
  const PAGE_SIZE = 100; // internal page size for full export
  let page = 1;
  let totalPages = 1;
  const all: EventData[] = [];

  do {
    const res = await api.post<EventsResponse>("/admin/events", buildPayload(page, PAGE_SIZE));
    const data = res?.data?.data;
    const events = data?.events ?? [];
    all.push(...events);
    totalPages = data?.totalPages ?? 1;
    page++;
  } while (page <= totalPages);

  return all;
} 

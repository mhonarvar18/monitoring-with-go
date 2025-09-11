// src/services/EventReport.service.ts
import api from "./api";

export type LocationType = "CITY" | "STATE" | "COUNTRY";

export interface AlarmItem {
  id: string;          // UUID string from backend
  total: number;
  code: number;
  label: string;
  count: number;
}

export interface EventReportItem {
  id: string;          // UUID string
  label: string;
  parentId: string | null;
  type: LocationType;
  unConfirmAlarms: number;
  totalEvents: number;
  alarm: AlarmItem[];

  // present in your payloads; keep optional for forward-compat
  deletedAt?: string | null;
  version?: number;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface EventReportResponse {
  statusCode: number;
  message: string;
  data: EventReportItem[];
}

export interface EventReportRequest {
  locationType: LocationType;
  parentId?: string;   // UUID when CITY
}

export const fetchEventReport = async (
  params: EventReportRequest
): Promise<EventReportResponse> => {
  const response = await api.post<EventReportResponse>(
    "/admin/map/branch-report",
    params
  );
  return response.data;
};

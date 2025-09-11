// src/services/mapBranchReport.service.ts
import api from "./api";

export interface LocationParent {
  id: number | string;
  label: string;
  type: "COUNTRY" | "STATE" | "CITY" | string;
  parent?: LocationParent;
}

export interface BranchLocation {
  id: number | string;
  label: string;
  type: "CITY" | "STATE" | "COUNTRY" | string;
  parent?: LocationParent;
}

export interface AlarmItem {
  id: number | string;
  total: number;
  code: number;
  label: string;
  count: number;
}

export interface BranchReportData {
  id: number | string;
  name: string;
  code: number;
  address: string;
  panelType: string | null;
  location: BranchLocation;
  alarm: AlarmItem[];
  totalEvents: number;
  unConfirmAlarms: number;
}

export interface BranchReportResponse {
  statusCode: number;
  message: string;
  data: BranchReportData;
}

export interface BranchReportRequest {
  locationType: "CITY" | "STATE" | "COUNTRY" | string;
  parentId: number | string;
  branchId?: number | string;
}

export async function fetchBranchReport(
  body: BranchReportRequest
): Promise<BranchReportData> {
  const response = await api.post<BranchReportResponse>(
    "/admin/map/branch-report",
    body
  );
  return response.data.data;
}
import api from "./api";
import type { PanelTypeData } from "./panelType.service";

export interface AlarmCategory {
  id: number | string;
  label: string;
}

export interface AlarmData {
  id: string | number;
  code: number;
  label: string;
  type: string;
  protocol: string;
  description: string | null;
  categoryId: string | number | null;
  action: string;
  category: AlarmCategory | null;
  panelTypeId: string | number | null;
  panelType: PanelTypeData
}

export interface AlarmResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: AlarmData[];
  };
}

export interface AlarmInput {
  code: number;
  label: string;
  protocol: "IP" | "TELL";
  categoryId: string | number | undefined | null;
  type: "ZONE" | "USER";
  description: string;
}

export const fetchAlarms = async (
  page: number,
  limit: number
): Promise<AlarmResponse["data"]> => {
  const response = await api.post<AlarmResponse>("/admin/alarms/find-all", {
    page,
    limit,
  });
  return response.data.data;
};

export const updateAlarm = async (
  id: number | string,
  payload: Partial<AlarmInput>
): Promise<AlarmResponse> => {
  const response = await api.put<AlarmResponse>(`/admin/alarms/${id}`, payload);
  return response.data;
};

export const searchAlarms = async (
  query: string
): Promise<AlarmResponse["data"]> => {
  const response = await api.get<AlarmResponse>(`/admin/alarms/${query}`);
  return response.data.data;
}
import api from "./api";

export interface SupportInfo {
  [key: string]: string | null;
}

export interface AppSetting {
  key: string;
  value: string | null;
}

export interface AppSettingsResponse {
  statusCode: number;
  message: string;
  data: AppSetting[];
}

export async function fetchSupportInfo(): Promise<AppSettingsResponse> {
  const res = await api.get<AppSettingsResponse>(
    "/admin/appSettings/read-setting"
  );
  return res.data;
}

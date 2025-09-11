// src/services/alarmSettingsService.ts
import api from "./api";

export type ID = string | number;

export interface AlarmCategory {
  id: ID;
  label: string;
  code: number;
}

export interface AlarmSettingResponseItem {
  id: ID;
  alarmColor: string;
  audioUrl: string | null;
  userId: ID;
  alarmCategoryId: ID;
  createdAt: string;
  updatedAt: string;
  alarmCategory: AlarmCategory;
}

export interface AlarmSettingsResponse {
  statusCode: number;
  message: string;
  data: AlarmSettingResponseItem[];
}

/** Client-side model for what we actually care about. */
export interface AlarmSetting {
  alarmCategoryId: ID;
  alarmColor: string;
  audioUrl: string | null;
}

let cache: AlarmSetting[] | null = null;

/** Fetch user alarm settings from API, with in-memory cache. */
export async function fetchAlarmSettings(): Promise<AlarmSetting[]> {
  if (cache) return cache;

  const response = await api.get<AlarmSettingsResponse>(
    "/admin/user-settings/setting"
  );

  if (response.status !== 200) {
    throw new Error(
      `Failed to load alarm settings (${response.status}): ${response.statusText}`
    );
  }

  const items = response.data.data;

  const settings: AlarmSetting[] = items.map((item) => ({
    alarmCategoryId: item.alarmCategoryId, // ID (string | number)
    alarmColor: item.alarmColor,
    audioUrl: item.audioUrl && item.audioUrl !== "null" ? item.audioUrl : null,
  }));

  cache = settings;
  return settings;
}

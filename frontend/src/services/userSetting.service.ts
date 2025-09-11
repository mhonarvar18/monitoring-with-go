import api from "./api";

export interface AlarmCategory {
  id: number | string;
  label: string;
  code: number;
}

export interface UserSetting {
  id: string;
  alarmColor: string;
  audioUrl: string | null;
  userId: number | string;
  alarmCategoryId: number | string;
  createdAt: string;
  updatedAt: string;
  alarmCategory: AlarmCategory;
}

interface UserSettingsResponse {
  statusCode: number;
  message: string;
  data: UserSetting[];
}

/** Fetch all user settings for event color/audio */
export const fetchUserSettings = async (): Promise<UserSetting[]> => {
  const { data } = await api.get<UserSettingsResponse>("/admin/user-settings/setting");
  return data.data;
};

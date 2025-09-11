// src/hooks/useAlarmSettings.ts

import { useState, useEffect, useCallback } from "react";
import { fetchAlarmSettings } from "../services/alarmSetting.service";
import type { AlarmSetting } from "../services/alarmSetting.service";
import type { UseSettingCardOptions } from "./userSettingActions";
import { updateUserInfoReq, type OptionalUserInfo } from "../services/userInfo.service";
/**
 * React hook to load and cache alarm settings.
 */
export function useAlarmSettings() {
  const [settings, setSettings] = useState<AlarmSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("No access token for alarm settings");
      setLoading(false);
      return;
    }
    fetchAlarmSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

export function useUpdateUserInfo({
  onSuccess,
  onError,
}: UseSettingCardOptions = {}) {
  const updateUserInfo = useCallback(
    async (id: number | string,   data: OptionalUserInfo | FormData) => {
      try {
        await updateUserInfoReq(id, data);
        onSuccess?.(); // Call success callback if provided
      } catch (error) {
        onError?.(error); // Call error callback if provided
      }
    },
    [onSuccess, onError]
  );

  return {updateUserInfo}
}

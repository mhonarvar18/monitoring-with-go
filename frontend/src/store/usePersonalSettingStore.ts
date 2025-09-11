import { create } from "zustand";
import type { PersonalSettingPayload } from "../hooks/usePersonalSetting";


interface PersonalSettingState {
  personalSettings: Record<string, PersonalSettingPayload>;
  setPersonalSetting: (payload: PersonalSettingPayload) => void;
}

export const usePersonalSettingStore = create<PersonalSettingState>((set) => ({
  personalSettings: {},
  setPersonalSetting: (payload) =>
    set((state) => ({
      personalSettings: {
        ...state.personalSettings,
        [payload.key]: payload,
      },
    })),
}));

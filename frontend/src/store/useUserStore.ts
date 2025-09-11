import type { UserInfo } from "../services/userInfo.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: "user-info", // نام کلید در localStorage
    }
  )
);

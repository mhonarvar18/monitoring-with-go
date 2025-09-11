import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserAssignedPermission } from "../services/permission.service";

interface UserPermissionStore {
  assignedPermissions: UserAssignedPermission[];
  setAssignedPermissions: (perms: UserAssignedPermission[]) => void;
  clearAssignedPermissions: () => void;
}

export const useUserPermissionStore = create<UserPermissionStore>()(
  persist(
    (set) => ({
      assignedPermissions: [],
      setAssignedPermissions: (perms) => set({ assignedPermissions: perms }),
      clearAssignedPermissions: () => set({ assignedPermissions: [] }),
    }),
    {
      name: "user-permissions", // key in localStorage
      // (optional) Only persist this part of the state:
      partialize: (state) => ({ assignedPermissions: state.assignedPermissions }),
    }
  )
);

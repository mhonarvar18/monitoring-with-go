import { useUserPermissionStore } from "../store/useUserPermissionStore";
import { useUserStore } from "../store/useUserStore";

// Helper: a Set-like object that always returns true for .has()
function universalSet(): Set<string> {
  return {
    has: () => true,
  } as unknown as Set<string>;
}

export function usePermissionSet() {
  const assignedPermissions = useUserPermissionStore((s) => s.assignedPermissions);
  const userInfo = useUserStore((s) => s.userInfo);

  // If OWNER, return universal set
  if (userInfo?.type === "OWNER") {
    return universalSet();
  }

  const permissionSet = new Set(
    assignedPermissions.map(
      (perm) =>
        `${perm.permission.model.toLowerCase()}:${perm.permission.action.toLowerCase()}`
    )
  );
  return permissionSet;
}

import { useUserPermissionStore } from "../store/useUserPermissionStore";
import { useUserStore } from "../store/useUserStore";

/**
 * Hook specifically for UI elements like table columns, buttons, icons
 * Returns true/false - never shows forbidden screens
 */
export function useHasPermission() {
  const assignedPermissions = useUserPermissionStore((s) => s.assignedPermissions);
  const userInfo = useUserStore((s) => s.userInfo);

  return (permission: string): boolean => {
    // OWNER always has all permissions
    if (userInfo?.type === "OWNER") {
      return true;
    }

    // Create permission set
    const permissionSet = new Set(
      assignedPermissions.map(
        (perm) =>
          `${perm.permission.model.toLowerCase()}:${perm.permission.action.toLowerCase()}`
      )
    );

    return permissionSet.has(permission.toLowerCase());
  };
}

/**
 * Simple component for conditionally rendering UI elements
 * Only hides/shows - never displays forbidden screens
 */
export function ConditionalRender({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const hasPermission = useHasPermission();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
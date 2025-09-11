import { usePermissionSet } from "../../hooks/usePermissionSet";
import { useUserStore } from "../../store/useUserStore";
import { FiShieldOff } from "react-icons/fi";

// Utility: check if this is a read permission (e.g., "branch:read")
function isReadPerm(perm: string) {
  const parts = perm.toLowerCase().split(":");
  return parts.length === 2 && parts[1] === "read";
}

export function RequirePermission({
  perm,
  children,
}: {
  perm: string;
  children: React.ReactNode;
}) {
  const permissionSet = usePermissionSet();
  const userInfo = useUserStore((s) => s.userInfo);

  // OWNERs always see
  if (userInfo?.type === "OWNER") {
    return <>{children}</>;
  }

  // User lacks permission
  if (!permissionSet.has(perm.toLowerCase())) {
    // If it's a model:read permission, show forbidden screen
    if (isReadPerm(perm)) {
      return (
        <div className="w-full h-full font-[iransans]">
          <div className="w-full h-full flex justify-center items-center gap-4">
            <div className="flex flex-col justify-center items-center mb-[12%] gap-4">
              <h1>
                <FiShieldOff size={240} />
              </h1>
              <div className="flex flex-col justify-center items-center gap-1">
                <h1 className="text-2xl font-bold">
                  کاربر محترم شما به این صفحه دسترسی ندارید
                </h1>
                <span>جهت دسترسی به مدیر مراجعه نمایید</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // For other actions (update/create/delete), just hide children (return null)
    return null;
  }

  // User has permission
  return <>{children}</>;
}

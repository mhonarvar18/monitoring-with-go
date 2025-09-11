import { useEffect, useState } from "react";
import {
  assignUserPermissions,
  deletePermissions,
  fetchPermissions,
  fetchUserPermissions,
} from "../services/permission.service";
import type {
  Permission,
  UserAssignedPermission,
} from "../services/permission.service";

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPermissions()
      .then(setPermissions)
      .catch(() => setError("خطا در دریافت مجوزها"))
      .finally(() => setLoading(false));
  }, []);

  return { permissions, loading, error };
}

export const useUserAssignedPermissions = (
  userId: string | number | null | undefined
) => {
  const [assignedPermissions, setAssignedPermissions] = useState<
    UserAssignedPermission[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAssignedPermissions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchUserPermissions(userId)
      .then(setAssignedPermissions)
      .finally(() => setLoading(false));
  }, [userId]);

  return { assignedPermissions, loading };
};

export function usePermissionAssignment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // فقط اختصاص مجوز جدید (اضافه‌کردن) را هندل می‌کند
  const savePermissions = async ({
    userId,
    newIds,
  }: {
    userId: string | number;
    newIds: (string | number)[];
  }) => {
    setLoading(true);
    setError(null);

    // Type-check the newIds array to ensure it's of a consistent type
    const isStringArray = newIds.every((id) => typeof id === "string");
    const isNumberArray = newIds.every((id) => typeof id === "number");

    // If the array contains mixed types, throw an error
    if (!isStringArray && !isNumberArray) {
      setError("newIds must be either all strings or all numbers");
      setLoading(false);
      return false;
    }

    try {
      // Only if we are adding permissions
      if (userId && newIds.length > 0) {
        await assignUserPermissions(userId, newIds);
      }
      // If all permissions are removed
      if (userId && newIds.length === 0) {
        await assignUserPermissions(userId, []);
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در ذخیره مجوزها");
      setLoading(false);
      return false;
    }
  };

  return { savePermissions, loading, error };
}

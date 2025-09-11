import api from "./api";

export interface Permission {
  id: string | number;
  action: string;
  model: string;
  field: string | null;
  description: string;
}

export interface PermissionResponse {
  statusCode: number;
  message: string;
  data: Permission[];
}

export interface UserAssignedPermission {
  id: string | number;
  userId: string | number;
  permissionId: string | number;
  modelId: string | number | null;
  permission: {
    id: string | number;
    action: string;
    model: string;
    field: string | null;
    description: string;
  };
}

export interface UserAssignedPermissionResponse {
  statusCode: number;
  message: string;
  data: UserAssignedPermission[];
}

export const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await api.get<PermissionResponse>("/admin/permissions");
  return response.data.data;
};

export const fetchUserPermissions = async (
  userId: string | number
): Promise<UserAssignedPermission[]> => {
  const response = await api.get<UserAssignedPermissionResponse>(
    `/admin/permissions/${userId}/permissions`
  );
  return response.data.data;
};

export const assignUserPermissions = async (
  userId: string | number,
  permissionIds: (string | number)[]
) => {
  await api.post(`/admin/permissions/${userId}/permissions`, {
    permissionIds,
  });
};

export const deletePermissions = async (ids: (string | number)[]) => {
  await api.delete(`/admin/permissions`, {
    data: { ids },
  });
};

export const fetchUserAssignedPermissions = async (
  userId: string | number
): Promise<UserAssignedPermission[]> => {
  const response = await api.get<{ data: UserAssignedPermission[] }>(
    `/admin/permissions/${userId}/permissions`
  );
  return response.data.data || [];
};

import api from "./api";

export interface UserInfo {
  id: number | string;
  fullname: string;
  username: string;
  nationalityCode: string;
  type: "OWNER" | "SUPER_ADMIN" | "ADMIN" | "USER" | string;
  personalCode: string;
  avatarUrl: string | null;
  fatherName: string;
  phoneNumber: string;
  address: string;
  ip: string;
  status: "ONLINE" | "OFFLINE" | string;
  ConfirmationTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OptionalUserInfo = Partial<UserInfo>;

interface UserInfoResponse {
  statusCode: number;
  message: string;
  data: UserInfo;
}

/** Single responsibility: fetch user profile */
export async function fetchUserInfo(): Promise<UserInfo> {
  const { data } = await api.get<UserInfoResponse>("/admin/users/userinfo");
  return data.data;
}

/**
 * Sends a PUT request to update user information.
 * Supports both FormData (for file uploads) and plain JSON.
 */
export const updateUserInfoReq = async (
  userId: number | string,
  data: OptionalUserInfo | FormData
) => {
  const isFormData = data instanceof FormData;

  return api.put(`/admin/users/userinfo/${userId}`, data, {
    headers: isFormData
      ? undefined // Axios sets correct headers automatically for FormData
      : { "Content-Type": "application/json" },

    transformRequest: isFormData
      ? (data) => data // Skip transformation for FormData
      : undefined, // Let Axios handle JSON normally
  });
};

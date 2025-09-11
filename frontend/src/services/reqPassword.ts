import api from "./api"; // Make sure to import your API instance

export interface PendingPasswordReset {
  id: number | string; // Add this!
  username: string;
  password: string;
  phoneNumber: string;
  status: string;
  requestedAt: string;
}

export interface PendingPasswordResetListResponse {
  statusCode?: number;
  message?: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: PendingPasswordReset[];
  };
}

export const fetchPendingPasswordResets = async (
  page: number,
  limit: number
): Promise<PendingPasswordResetListResponse> => {
  const response = await api.get<PendingPasswordResetListResponse>(
    `/register/reset-password/pending/${page}/${limit}`
  );
  return response.data;
};
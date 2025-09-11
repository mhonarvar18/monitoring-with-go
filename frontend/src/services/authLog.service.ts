import api from "./api"; // Make sure to import the API instance

interface User {
  id: number | string;
  ip: string;
  username: string;
  fullname: string;
  location: {
    id: number | string;
    label: string;
    parentId: number;
    type: string;
  };
  fatherName: string;
  phoneNumber: string;
  personalCode: string;
  nationalityCode: string;
}

export interface AuthLog {
  id: number | string;
  ip: string;
  userId: number | string;
  loginTime: string;
  logoutTime: string;
  user: User;
}

export interface AuthLogResponse {
  statusCode: number;
  message: string;
  data: {
    totalPages: number;
    totalRecords: number;
    currentPage: number;
    authLogs: AuthLog[];
  };
}

export const fetchAuthLogs = async (page: number, limit: number): Promise<AuthLogResponse> => {
  const response = await api.post<AuthLogResponse>("/admin/authLog", {
    page,
    limit,
  });
  return response.data;
};

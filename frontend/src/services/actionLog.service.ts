import api from "./api";

export interface UserInfo {
  fullName: string;
  username: string;
  nationalityCode: string;
  avatarUrl: string;
}

export interface User {
  fullname: string;
  username: string;
  phoneNumber: string;
  nationalityCode: string;
}

export interface ChangedFields {
  before?: any;
  after?: any;
  [key: string]: any;
}

export interface ActionLog {
  id: string | number;
  model: string;
  model_id: string | number;
  userId: string | number;
  action: "CREATED" | "UPDATED" | "DELETED" | "CONFIRMED";
  note: string | null;
  userInfo: UserInfo;
  changedFields: ChangedFields | null;
  version: number;
  createdAt: string;
  user: User;
  modelName: string;
}

export interface ActionLogsByDate {
  date: string;
  count: number;
  logs: ActionLog[];
}

export interface ActionLogData {
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  logs: ActionLogsByDate[];
}

export interface ActionLogResponse {
  statusCode: number;
  message: string;
  data: ActionLogData;
}

export const fetchActionLogs = async (
  page: number,
  limit: number
): Promise<ActionLogResponse> => {
  const response = await api.post<ActionLogResponse>("/admin/actionLogs", {
    page,
    limit,
  });
  return response.data;
};

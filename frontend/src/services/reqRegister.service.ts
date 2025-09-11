import type { ApiResponse } from "../types/ApiResponse";
import api from "./api"; // Make sure to import your API instance

interface Location {
  id: string | number;
  label: string;
  parentId: string | number;
  type: string;
  parent: {
    type: string;
    id: string | number;
    label: string;
  };
}

export interface PendingUser {
  id: string | number;
  username: string;
  password: string;
  status: string;
  profileCompleted: boolean;
  nationalityCode: string;
  fullname: string;
  type: "USER" | "OWNER" | "SUPER_ADMIN" | "ADMIN"; 
  personalCode: string;
  fatherName: string;
  phoneNumber: string;
  address: string;
  ip: string;
  locationId: string | number;
  location: Location;
}
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: PendingUser[];
}


export const fetchPendingRequests = async (page: number, limit: number): Promise<ApiResponse<PaginatedResponse<PendingUser>>> => {
  const response = await api.get(`/register/pending/${page}/${limit}`);
  return response.data;
};

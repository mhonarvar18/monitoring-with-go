import api from "./api";
import type { BranchAll } from "../types/BranchAll";

export interface BranchesResponse {
  statusCode: number;
  message: string;
  data: BranchAll[];
}

export interface BranchOneResponse {
  statusCode: number;
  message: string;
  data: BranchAll;
}


export const fetchBranchesByQuery = async (query: string): Promise<BranchesResponse> => {
  // Adjust the API route if needed
  const response = await api.get<BranchesResponse>(`/admin/branches/${encodeURIComponent(query)}`);
  return response.data;
};

export const fetchBranchById = async (branchId: string | number): Promise<BranchOneResponse> => {
  const response = await api.get<BranchOneResponse>(`/admin/branches/one/${encodeURIComponent(branchId)}`);
  return response.data;
};
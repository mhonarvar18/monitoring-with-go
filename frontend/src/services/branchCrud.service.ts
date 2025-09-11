import api from "./api";
import type { BranchAll } from "../types/BranchAll";
import type { ApiResponse } from "../types/ApiResponse";
import type { Location } from "../hooks/useLocationsByType";
// DTO for create/update

export interface LocationObject {
  id: number | string;
  label: string;
  type: string;
  parent: {
    id: number | string;
    label: string;
    type: string;
    parent: {
      id: number | string;
      label: string;
      type: string;
    };
  };
}
export interface BranchInput {
  id?: number | string;
  name: string;
  code: number | null;
  locationId: number | string | null;
  location?: LocationObject;
  phoneNumber?: string;
  address?: string;
  panelName?: string;
  panelCode?: number;
  panelTypeId?: number | string;
  panelIp?: string;
  emergencyCall?: string | null;
}

export const branchCrudService = {
  createBranch: (payload: BranchInput) =>
    api.post<ApiResponse<BranchAll>>("/admin/branches", payload),

  updateBranch: (id: number | string, payload: Partial<BranchInput>) =>
    api.put<ApiResponse<BranchAll>>(`/admin/branches/${id}`, payload),

  deleteBranch: (id: number | string) =>
    api.delete<ApiResponse<null>>(`/admin/branches/${id}`),
};

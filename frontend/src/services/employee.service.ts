import api from "./api";

interface Branch {
  id: number | string;
  name: string;
  code: number;
}

export interface EmployeeDataResponse {
  id: number | string;
  branchId: number | string;
  localId: number;
  name: string;
  lastName: string;
  position: string;
  nationalCode: string;
  createdAt: string;
  updatedAt: string;
  branch: Branch[];
}

export interface Response {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: EmployeeDataResponse[];
  };
}
export interface EmployeeInput {
  branchId: number | string;
  id?: number | string;
  name: string;
  lastName: string;
  position?: string;
  nationalCode?: string;
  localId: number;
}

export const fetchEmployeeByBranch = async (
  branchId: number | string,
  page: number,
  limit: number
): Promise<Response> => {
  const response = await api.post<Response>(`/admin/employees/find-by-branch`, {
    branchId,
    limit,
    page,
  });
  return response.data;
};

export const createEmployee = async (
  branchId: number | string,
  data: EmployeeInput
) => {
  return api.post<Response>("/admin/employees", { ...data, branchId });
};

export const updateEmployee = async (
  id: number | string,
  data: Partial<EmployeeInput>
) => {
  return api.put<Response>(`/admin/employees/${id}`, data);
};

export const deleteEmployee = async (id: number | string) => {
  return api.delete<Response>(`/admin/employees/${id}`);
};

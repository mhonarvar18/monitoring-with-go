import api from "./api"; // import your API instance

interface Location {
  id: number | string;
  label: string;
  type: string
  parent: {
    id: number | string;
    label: string;
    type: string
  };
}

export interface User {
  id: number | string;
  fullname: string;
  username: string;
  nationalityCode: string;
  type: string;
  personalCode: string;
  avatarUrl: string | null;
  fatherName: string;
  phoneNumber: string;
  address: string;
  ip: string;
  status: string;
  locationId: number | string;
  ConfirmationTime: string;
  createdAt: string;
  updatedAt: string;
  location: Location;
}

export interface UsersResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
    data: User[];
  };
}

export interface UserInput {
  id?: number | string;
  fullname: string;
  fatherName: string
  username: string;
  nationalityCode: string;
  password: string
  personalCode: string;
  phoneNumber: string;
  type: "USER" | "OWNER" | "SUPER_ADMIN" | "ADMIN"
  address: string;
  ip: string;
  locationId: string | number;
  location: Location;
}

export const fetchUsers = async (
  page: number,
  limit: number
): Promise<UsersResponse> => {
  const response = await api.post<UsersResponse>("/admin/users/find-all", {
    page,
    limit,
  });
  return response.data;
};

export const createUser = async (payload: Partial<User>) => {
  const response = await api.post<UsersResponse>("/admin/users", payload);
  return response.data;
};

// Update
export const updateUser = async (id: number | string, payload: Partial<UserInput>) => {
  const response = await api.put<UsersResponse>(`/admin/users/${id}`, payload);
  return response.data;
};

// Delete
export const deleteUser = async (id: number | string) => {
  const response = await api.delete<UsersResponse>(`/admin/users/${id}`);
  return response.data;
};

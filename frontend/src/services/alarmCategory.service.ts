import api from "./api";

export interface CategoryData {
  id: string | number;
  label: string;
  code: number;
  needsApproval: boolean;
  priority: "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
}

export interface CategoryResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: CategoryData[];
  };
}

export interface CategoryResponseById {
  statusCode: number;
  message: string;
  data: CategoryData;
}

/**
 * Fetch the full array of alarm categories.
 * Returns CategoryData[] by unwrapping the .data field.
 */
export const fetchCategories = async (
  page: number,
  limit: number
): Promise<CategoryResponse["data"]> => {
  const response = await api.post<CategoryResponse>(
    "/admin/alarm-categories/find-all",
    { page, limit }
  );
  return response.data.data;
};

export const fetchCategoriesById = async (
  id: number | string
): Promise<CategoryResponseById> => {
  const response = await api.get<CategoryResponseById>(
    `/admin/alarm-categories/${id}`
  );
  return response.data;
};

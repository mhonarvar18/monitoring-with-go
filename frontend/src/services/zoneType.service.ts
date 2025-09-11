import api from "./api";

export interface ZoneTypeData {
  id: number | string;
  label: string;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
}

export interface ZoneTypeResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ZoneTypeData[];
  };
}

/**
 * Fetch all zone types, returns array of ZoneTypeData
 */
export const fetchZoneTypes = async (
  page: number,
  limit: number
): Promise<ZoneTypeResponse["data"]> => {
  const response = await api.post<ZoneTypeResponse>("/admin/zone-types/find-all", {
    page,
    limit,
  });
  return response.data.data;
};

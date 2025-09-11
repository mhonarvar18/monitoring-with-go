import api from "./api";
import type { ZoneTypeData } from "./zoneType.service";
import type { Partition } from "./partition.service";

export interface ZoneData {
  id: number | string;
  partitionId: number | string;
  zoneTypeId: number | string;
  localId: number;
  label: string;
  createdAt: string;
  updatedAt: string;
  zoneType: ZoneTypeData[];
  partition: Partition[];
}

export interface ZoneResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ZoneData[];
  };
}

export interface ZoneInput {
  branchId: number | string;
  id?: number | string;
  label: number;
  partitionId: number | string;
  zoneTypeId: number | string;
  localId: number;
}

export const fetchZoneByBranch = async (
  branchId: number | string,
  page: number,
  limit: number
): Promise<ZoneResponse> => {
  const response = await api.post(`/admin/zones/find-by-branch`, {
    page,
    branchId,
    limit,
  });
  return response.data;
};

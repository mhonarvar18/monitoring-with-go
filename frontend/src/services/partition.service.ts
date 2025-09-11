import api from "./api";

interface Branch {
  id: number | string;
  name: string;
}

export interface Partition {
  id: number | string;
  label: string;
  localId: number;
  branch: Branch[];
  branchDefault: number | null | string;
}

export interface PartitionResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: Partition[];
  };
}

export interface PartitionInput {
  id: number | string;
  branchId: number;
  label: string;
  localId: number;
}

export const fetchPartitionByBranch = async (
  branchId: number | string,
  limit: number,
  page: number
): Promise<PartitionResponse> => {
  const response = await api.post<PartitionResponse>(
    `/admin/partitions/find-by-branch`,
    {
      branchId,
      page,
      limit,
    }
  );
  return response.data;
};

export const createPartition = async (input: PartitionInput) => {
  const response = await api.post<PartitionResponse>(
    `/admin/partitions`,
    input
  );
  return response.data;
};

// UPDATE
export const updatePartition = async (id: number | string, input: PartitionInput) => {
  const response = await api.put<PartitionResponse>(
    `/admin/partitions/${id}`,
    input
  );
  return response.data;
};

// DELETE
export const deletePartition = async (id: number | string) => {
  const response = await api.delete<PartitionResponse>(
    `/admin/partitions/${id}`
  );
  return response.data;
};

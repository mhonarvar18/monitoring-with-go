import type { AlarmEvent, Employee, Location, Partition, Zone } from "../types/Event";
import api from "./api";

export interface BackupEvent {
  id: number | string;
  branchId: number | string;
  alarmId: number | string;
  partition: Partition;
  employee: Employee;
  zone: Zone;
  zoneId: number | null | string;
  originalZoneId: string;
  partitionId: number | null | string;
  originalPartitionId: string;
  referenceId: string | string;
  time: string;
  date: string;
  employeeId: number | null | string;
  originalEmployeeId: string;
  originalBranchCode: string;
  ip: string;
  description: string;
  confermationStatus: string | null;
  createdAt: string;
  branch: {
    id: number | string;
    location: Location;
    name: string;
    code: number;
  };
  alarm: {
    id: number | string;
    label: string;
    code: number;
    protocol: string;
  };
  audioUrl: string;
  alarmColor: string;
  action: string;
}

export interface BackupFileListResponse {
  statusCode: number;
  message: string;
  data: string[];
}

export interface BackupFileDataResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: BackupEvent[];
  };
}

export interface BackupFileDataRequest {
  fileName: string;
  limit: number;
  page: number;
}

// Fetch list of backup files
export const fetchBackupFileList =
  async (): Promise<BackupFileListResponse> => {
    const response = await api.get<BackupFileListResponse>(
      "/admin/events/backup-list"
    );
    return response.data;
  };

// Fetch data from a specific backup file
export const fetchBackupFileData = async (
  request: BackupFileDataRequest
): Promise<BackupFileDataResponse> => {
  const response = await api.post<BackupFileDataResponse>(
    "/admin/events/backup-file-data",
    request
  );
  return response.data;
};

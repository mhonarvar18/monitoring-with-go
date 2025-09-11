import { useState, useCallback } from "react";
import {
  fetchBackupFileData,
  fetchBackupFileList,
  type BackupEvent,
  type BackupFileDataRequest,
} from "../services/backup.service";

interface UseBackupFileListReturn {
  data: string[] | null;
  loading: boolean;
  error: string | null;
  fetchFileList: () => Promise<void>;
}

interface UseBackupFileDataReturn {
  data: BackupEvent[] | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
  fetchFileData: (request: BackupFileDataRequest) => Promise<void>;
}

// Hook for fetching backup file list
export const useBackupFileList = (): UseBackupFileListReturn => {
  const [data, setData] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFileList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchBackupFileList();
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت لیست فایل‌های بکاپ"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchFileList,
  };
};

// Hook for fetching backup file data
export const useBackupFileData = (): UseBackupFileDataReturn => {
  const [data, setData] = useState<BackupEvent[] | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFileData = useCallback(async (request: BackupFileDataRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchBackupFileData(request);
      setData(response.data.data);
      setPagination({
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت اطلاعات فایل بکاپ"
      );
      setData(null);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    fetchFileData,
  };
};

// Combined hook for both functionalities
export const useBackupEvents = () => {
  const fileListHook = useBackupFileList();
  const fileDataHook = useBackupFileData();

  return {
    fileList: fileListHook,
    fileData: fileDataHook,
  };
};

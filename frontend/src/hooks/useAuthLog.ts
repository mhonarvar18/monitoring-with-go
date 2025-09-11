import { useState, useEffect } from "react";
import { fetchAuthLogs } from "../services/authLog.service";
import type { AuthLog } from "../services/authLog.service";

export function useAuthLogs(page: number = 1, limit: number = 20) {
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAuthLogs(page, limit);
        setLogs(response.data.authLogs);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Error fetching auth logs");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [page, limit]);

  return { logs, totalPages, loading, error };
}

export function useExportAuthLogs() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllLogs = async (pageSize: number = 20): Promise<AuthLog[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get first page to determine total pages
      const firstPageResponse = await fetchAuthLogs(1, pageSize);
      const totalPagesCount = firstPageResponse.data.totalPages;
      
      // If only one page, return the data directly
      if (totalPagesCount === 1) {
        return firstPageResponse.data.authLogs;
      }
      
      // Create promises for all remaining pages
      const pagePromises: Promise<any>[] = [Promise.resolve(firstPageResponse)];
      
      for (let pageNum = 2; pageNum <= totalPagesCount; pageNum++) {
        pagePromises.push(fetchAuthLogs(pageNum, pageSize));
      }
      
      // Execute all requests concurrently
      const allResponses = await Promise.all(pagePromises);
      
      // Combine all auth logs
      const allLogs: AuthLog[] = allResponses.reduce((acc, response) => {
        return [...acc, ...response.data.authLogs];
      }, []);
      
      return allLogs;
    } catch (err) {
      const errorMessage = "Error fetching all auth logs for export";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    fetchAllLogs, 
    loading, 
    error 
  };
}
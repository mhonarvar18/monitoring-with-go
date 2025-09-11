import { useState, useEffect } from "react";
import type {
  ActionLogResponse,
  ActionLog,
  ActionLogsByDate,
} from "../services/actionLog.service";
import { fetchActionLogs } from "../services/actionLog.service";

// Helper function to flatten date-grouped logs
const flattenLogs = (logsByDate: ActionLogsByDate[]): ActionLog[] => {
  return logsByDate.flatMap(dateGroup => dateGroup.logs);
};

export function useActionLogs(page: number = 1, limit: number = 20) {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [logsByDate, setLogsByDate] = useState<ActionLogsByDate[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: ActionLogResponse = await fetchActionLogs(page, limit);
        const dateGroupedLogs = response.data.logs;
        
        setLogsByDate(dateGroupedLogs);
        setLogs(flattenLogs(dateGroupedLogs));
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Error fetching action logs");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [page, limit]);

  return { 
    logs, 
    logsByDate, 
    totalPages, 
    loading, 
    error 
  };
}

// New hook for infinite scroll pagination
export function useInfiniteActionLogs(limit: number = 50) {
  const [allLogs, setAllLogs] = useState<ActionLog[]>([]);
  const [allLogsByDate, setAllLogsByDate] = useState<ActionLogsByDate[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  // Function to load next page
  const loadNextPage = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response: ActionLogResponse = await fetchActionLogs(currentPage, limit);
      const newLogsByDate = response.data.logs;
      
      if (!initialLoad) {
        // First load - replace everything
        setAllLogsByDate(newLogsByDate);
        setAllLogs(flattenLogs(newLogsByDate));
        setTotalPages(response.data.totalPages);
        setInitialLoad(true);
      } else {
        // Subsequent loads - merge data
        setAllLogsByDate(prev => {
          const merged = [...prev];
          
          newLogsByDate.forEach(newDateGroup => {
            const existingIndex = merged.findIndex(
              existing => existing.date === newDateGroup.date
            );
            
            if (existingIndex >= 0) {
              // Merge logs for existing date, avoiding duplicates
              const existingLogs = merged[existingIndex].logs;
              const newLogs = newDateGroup.logs.filter(
                newLog => !existingLogs.some(existing => existing.id === newLog.id)
              );
              
              merged[existingIndex] = {
                ...merged[existingIndex],
                logs: [...existingLogs, ...newLogs],
                count: existingLogs.length + newLogs.length
              };
            } else {
              // Add new date group
              merged.push(newDateGroup);
            }
          });
          
          // Sort by date (newest first)
          return merged.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        });
        
        setAllLogs(prev => {
          const newFlatLogs = flattenLogs(newLogsByDate);
          const uniqueNewLogs = newFlatLogs.filter(
            newLog => !prev.some(existing => existing.id === newLog.id)
          );
          return [...prev, ...uniqueNewLogs];
        });
      }

      // Update pagination state
      setCurrentPage(prev => prev + 1);
      setHasMore(currentPage < response.data.totalPages);
      
    } catch (err) {
      setError("Error fetching action logs");
    } finally {
      setLoading(false);
    }
  };

  // Load first page on mount
  useEffect(() => {
    if (!initialLoad) {
      loadNextPage();
    }
  }, []);

  // Function to load all remaining data (for export)
  const loadAllData = async (): Promise<ActionLog[]> => {
    if (loading) return allLogs;

    const allData: ActionLog[] = [];
    let page = 1;
    let hasMoreData = true;

    try {
      while (hasMoreData) {
        const response: ActionLogResponse = await fetchActionLogs(page, limit);
        const pageData = flattenLogs(response.data.logs);
        allData.push(...pageData);
        
        hasMoreData = page < response.data.totalPages;
        page++;
      }
      
      return allData;
    } catch (err) {
      console.error("Error loading all data:", err);
      return allLogs; // Return what we have so far
    }
  };

  return {
    allLogs,
    allLogsByDate,
    totalPages,
    loading,
    error,
    hasMore,
    initialLoad,
    loadNextPage,
    loadAllData,
    totalCount: allLogs.length
  };
}
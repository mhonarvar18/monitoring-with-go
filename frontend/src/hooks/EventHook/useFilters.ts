import { useMemo, useState, useEffect } from "react";
import {
  convertFiltersToApi,
  getActiveFilterChips,
} from "../../utils/convertFilterSocket";

// Define the filter state interface - now supporting objects for UI display
export interface FilterState {
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  alarmCategoryId?:
    | { id: string | number; label: string }
    | string
    | number
    | null;
  branchId?: { id: string | number; name: string } | string | number | null;
  locationId?: { id: string | number; label: string } | string | number | null;
}

export function useFilters() {
  const [activeFilters, setActiveFilters] = useState<FilterState>({});

  // For backward compatibility with existing UI chips that expect objects with labels
  const flatFilters = useMemo(() => {
    const result: Record<string, any> = {};

    // Handle each filter type - keep objects for UI display
    if (activeFilters.startDate) result.startDate = activeFilters.startDate;
    if (activeFilters.endDate) result.endDate = activeFilters.endDate;
    if (activeFilters.startTime) result.startTime = activeFilters.startTime;
    if (activeFilters.endTime) result.endTime = activeFilters.endTime;
    if (activeFilters.alarmCategoryId)
      result.alarmCategoryId = activeFilters.alarmCategoryId;
    if (activeFilters.branchId) result.branchId = activeFilters.branchId;
    if (activeFilters.locationId) result.locationId = activeFilters.locationId;

    return result;
  }, [activeFilters]);

  // Convert to API format - ensure only IDs are sent, not objects
  const apiFilters = useMemo(() => {
    const result: Record<string, any> = {};

    // Date/Time filters - pass as-is
    if (activeFilters.startDate) result.startDate = activeFilters.startDate;
    if (activeFilters.endDate) result.endDate = activeFilters.endDate;
    if (activeFilters.startTime) result.startTime = activeFilters.startTime;
    if (activeFilters.endTime) result.endTime = activeFilters.endTime;

    // ID filters - extract ID if it's an object, otherwise use as-is
    if (activeFilters.alarmCategoryId) {
      result.alarmCategoryId =
        typeof activeFilters.alarmCategoryId === "object" &&
        activeFilters.alarmCategoryId !== null
          ? activeFilters.alarmCategoryId.id
          : activeFilters.alarmCategoryId;
    }

    if (activeFilters.branchId) {
      result.branchId =
        typeof activeFilters.branchId === "object" &&
        activeFilters.branchId !== null
          ? activeFilters.branchId.id
          : activeFilters.branchId;
    }

    if (activeFilters.locationId) {
      result.locationId =
        typeof activeFilters.locationId === "object" &&
        activeFilters.locationId !== null
          ? activeFilters.locationId.id
          : activeFilters.locationId;
    }

    const finalApiFilters = convertFiltersToApi(result);

    return finalApiFilters;
  }, [activeFilters]);

  // Helper function to get filter display labels for UI chips
  const getFilterLabel = (key: string, value: any): string => {
    if (!value) return "";

    let label = "";
    switch (key) {
      case "startDate":
      case "endDate":
      case "startTime":
      case "endTime":
        label = value;
        break;
      case "alarmCategoryId":
        // If it's an object with label, use label; if just ID, use ID
        label =
          typeof value === "object" && value !== null && value.label
            ? value.label
            : value;
        break;
      case "branchId":
        // If it's an object with name, use name; if just ID, use ID
        label =
          typeof value === "object" && value !== null && value.name
            ? value.name
            : value;
        break;
      case "locationId":
        // If it's an object with label, use label; if just ID, use ID
        label =
          typeof value === "object" && value !== null && value.label
            ? value.label
            : value;
        break;
      default:
        label =
          typeof value === "object" && value !== null
            ? value.label || value.name || value.id
            : value;
    }

    return label;
  };

  // Get formatted filter chips for UI display using the utility function
  const filterChips = useMemo(() => {
    const chips = getActiveFilterChips(flatFilters, getFilterLabel);

    return chips;
  }, [flatFilters, getFilterLabel]);

  // Helper function to remove a specific filter
  const removeFilter = (key: string) => {

    setActiveFilters((prev) => {
      const updated = { ...prev };

      // Handle special cases for combined filters
      if (key === "dateRange") {
        // Remove both start and end date
        delete (updated as any).startDate;
        delete (updated as any).endDate;
        console.log("🗑️ [useFilters] removed dateRange (startDate + endDate)");
      } else if (key === "timeRange") {
        // Remove both start and end time
        delete (updated as any).startTime;
        delete (updated as any).endTime;
        console.log("🗑️ [useFilters] removed timeRange (startTime + endTime)");
      } else if (key === "branch") {
        // Handle both branchId and branch keys
        delete (updated as any).branchId;
        delete (updated as any).branch;
        console.log("🗑️ [useFilters] removed branch (branchId)");
      } else if (key in updated) {
        delete (updated as any)[key];
        console.log(`🗑️ [useFilters] removed single key: ${key}`);
      }

      console.log("🗑️ [useFilters] removeFilter - after removal:", {
        updatedFilters: updated,
        removedKeys: Object.keys(prev).filter((k) => !(k in updated)),
      });

      return updated;
    });
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    console.log("🧹 [useFilters] clearAllFilters called");
    console.log("🧹 [useFilters] clearing filters:", activeFilters);
    setActiveFilters({});
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    const count = Object.entries(activeFilters).filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    ).length;

    return count;
  }, [activeFilters]);

  // Check if any filters are active
  const hasActiveFilters = activeFiltersCount > 0;

  return {
    activeFilters,
    setActiveFilters,
    flatFilters,
    apiFilters,
    getFilterLabel,
    filterChips,
    removeFilter,
    clearAllFilters,
    activeFiltersCount,
    hasActiveFilters,
  } as const;
}

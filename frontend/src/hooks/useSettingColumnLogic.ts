import { useState, useEffect, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-hot-toast";
import { labelOverrides } from "../utils/mocks";
import {
  useEventColumnSetting,
  useResetOrder,
  useResetVisibility,
  useSaveHiddenColumns,
  useUpdateColsLayout,
} from "../hooks/useEventColumnsSetting";
import { errorStyle } from "../types/stylesToast";

// Custom hook that handles the logic for managing column settings in the UI
export const useSettingColumnLogic = (onSuccess: () => void) => {
  // States for managing UI state and settings data
  const [activeTab, setActiveTab] = useState("True/FalseColumn"); // Currently active tab
  const [indexColumns, setIndexColumns] = useState<Record<string, number>>({});
  const [hiddenColumns, setHiddenColumns] = useState({}); // Initial hidden column config
  const [updatedIndexColumns, setUpdatedIndexColumns] = useState<
    Record<string, number>
  >({});
  const [updatedHiddenColumns, setUpdatedHiddenColumns] = useState({}); // Modified hidden column config
  const [hasChanges, setHasChanges] = useState(false); // Flag for detecting index changes
  const [hasVisibilityChanges, setHasVisibilityChanges] = useState(false); // Flag for detecting visibility changes
  const [indexSettingId, setIndexSettingId] = useState<number | null>(null); // ID for index setting
  const [hiddenSettingId, setHiddenSettingId] = useState<number | null>(null); // ID for visibility setting
  const [loading, setLoading] = useState(true); // Flag for loading state

  // Hooks to perform mutations or fetch settings data
  const { data: settings } = useEventColumnSetting();
  const { mutate: updateLayout } = useUpdateColsLayout();
  const { mutate: resetLayout } = useResetOrder();
  const { mutate: resetVisibility } = useResetVisibility();
  const { mutate: saveHiddenColumns } = useSaveHiddenColumns();

  // Effect to parse the settings when data is available
  useEffect(() => {
    if (!Array.isArray(settings?.data)) return;

    for (const item of settings.data) {
      try {
        const parsedValue = JSON.parse(item.value || "{}");

        if (item.key === "events_index_coulmn") {
          setIndexColumns(parsedValue);
          setUpdatedIndexColumns(parsedValue);
          setIndexSettingId(item.id);
        }

        if (item.key === "events_hidden_Coulmn") {
          setHiddenColumns(parsedValue);
          setUpdatedHiddenColumns(parsedValue);
          setHiddenSettingId(item.id);
        }
      } catch (err) {
        console.error("Failed to parse setting:", item.value, err);
      }
    }

    setLoading(false);
  }, [settings]);

  // Handler to switch tabs safely, preventing unsaved changes
  const handleTabSwitch = useCallback(
    (tabName: string) => {
      if (hasChanges || hasVisibilityChanges) {
        toast.error("لطفاً قبل از تغییر تب، تغییرات را ذخیره کنید.", {
          style: errorStyle,
        });
        return;
      }
      setActiveTab(tabName);
    },
    [hasChanges, hasVisibilityChanges]
  );

  // Save updated column order to the server
  const handleSaveOrder = useCallback(async () => {
    if (!indexSettingId) {
      toast.error("شناسه تنظیمات مرتب‌سازی یافت نشد.", { style: errorStyle });
      return;
    }

    try {
      await updateLayout({
        settingId: indexSettingId,
        data: {
          key: "events_index_coulmn",
          value: JSON.stringify(updatedIndexColumns),
        },
      });

      onSuccess(); // Callback on success
      setHasChanges(false); // Reset flag
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("ذخیره‌سازی ترتیب ستون‌ها با خطا مواجه شد.", {
        style: errorStyle,
      });
    }
  }, [indexSettingId, updatedIndexColumns, onSuccess]);

  // Save updated visibility settings to the server
  const handleSaveHiddenColumns = useCallback(async () => {
    if (!hiddenSettingId) {
      toast.error("شناسه تنظیمات ستون‌های مخفی یافت نشد.", {
        style: errorStyle,
      });
      return;
    }

    try {
      await saveHiddenColumns({
        settingId: hiddenSettingId,
        data: {
          key: "events_hidden_Coulmn",
          value: JSON.stringify(updatedHiddenColumns),
        },
      });

      onSuccess(); // Callback on success
      setHasVisibilityChanges(false); // Reset flag
    } catch (error) {
      console.error("Error saving hidden columns:", error);
      toast.error("ذخیره‌سازی وضعیت نمایش ستون‌ها با خطا مواجه شد.", {
        style: errorStyle,
      });
    }
  }, [hiddenSettingId, updatedHiddenColumns, onSuccess]);

  // Reset column order to the default state
  const handleResetOrder = useCallback(() => {
    if (!indexSettingId) return;

    resetLayout(
      {
        settingId: indexSettingId,
        data: { key: "events_index_coulmn" },
      },
      {
        onSuccess: () => {
          onSuccess();
          setHasChanges(false);
        },
        onError: (err) => console.error("Error resetting order:", err),
      }
    );
  }, [indexSettingId, resetLayout, onSuccess]);

  // Reset visibility of columns to the default state
  const handleResetVisibility = useCallback(() => {
    if (!hiddenSettingId) return;

    resetVisibility(
      { settingId: hiddenSettingId },
      {
        onSuccess: () => {
          onSuccess();
          setHasVisibilityChanges(false);
        },
        onError: (err) => console.error("Error resetting visibility:", err),
      }
    );
  }, [hiddenSettingId, resetVisibility, onSuccess]);

  // Handle drag-and-drop event to update column order
  const handleDragEnd = useCallback(
    (activeId: string, overId: string) => {
      const orderedKeys = Object.entries(updatedIndexColumns)
        .filter(([key]) => !updatedHiddenColumns[key])
        .sort(([, a], [, b]) => a - b) // a & b are now number
        .map(([key]) => key);

      if (activeId !== overId) {
        const oldIndex = orderedKeys.indexOf(activeId);
        const newIndex = orderedKeys.indexOf(overId);
        const newOrder = arrayMove(orderedKeys, oldIndex, newIndex);

        const reordered: Record<string, number> = {};
        newOrder.forEach((key, index) => (reordered[key] = index));
        setUpdatedIndexColumns(reordered);
        setHasChanges(true); // Mark as changed
      }
    },
    [updatedIndexColumns, updatedHiddenColumns]
  );

  // Toggle visibility of a specific column
  const handleToggleColumnVisibility = useCallback(
    (key: string) => {
      const newState = {
        ...updatedHiddenColumns,
        [key]: !updatedHiddenColumns[key],
      };
      setUpdatedHiddenColumns(newState);
      setHasVisibilityChanges(true); // Mark as changed
    },
    [updatedHiddenColumns]
  );

  // Return all necessary state and handlers for the component using this hook
  return {
    activeTab,
    loading,
    updatedIndexColumns,
    updatedHiddenColumns,
    hasChanges,
    hasVisibilityChanges,
    indexSettingId,
    hiddenSettingId,
    labelOverrides,
    handleTabSwitch,
    handleSaveOrder,
    handleResetOrder,
    handleResetVisibility,
    handleDragEnd,
    handleToggleColumnVisibility,
    handleSaveHiddenColumns,
  };
};

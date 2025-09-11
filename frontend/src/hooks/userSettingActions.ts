import { useCallback } from "react";
import api from "../services/api";

// Optional callbacks for success and error handling in hooks
export type UseSettingCardOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

// Shape of a new event used for creating or editing user settings
export type NewEvent = {
  alarmCategoryId: number | string;
  alarmColor: string;
  audioUrl: string;
  userId: number | string;
};

// Sends DELETE request to remove a user setting by ID
const deleteSetttingCard = async (id: number | string) => {
  await api.delete(`/admin/user-settings/${id}`);
};

// Sends POST request to create a new user setting (event)
const createNewEventCard = async (formData: NewEvent) => {
  await api.post("/admin/user-settings", formData);
};

// Sends PUT request to update an existing user setting (event) by ID
const editEventCard = async (formData: NewEvent, id: number | string) => {
  await api.put(`/admin/user-settings/${id}`, formData);
};

// Hook to delete a user setting and handle success/error callbacks
export function useDeleteSettingCard({
  onSuccess,
  onError,
}: UseSettingCardOptions = {}) {
  const deleteSetting = useCallback(
    async (id: number | string) => {
      try {
        await deleteSetttingCard(id);
        onSuccess?.(); // Call success callback if provided
      } catch (error) {
        onError?.(error); // Call error callback if provided
      }
    },
    [onSuccess, onError]
  );

  return { deleteSetting };
}

// Hook to create a new event and handle success/error callbacks
export function useCreateNewEvent({
  onSuccess,
  onError,
}: UseSettingCardOptions = {}) {
  const createNewEvent = useCallback(
    async (formData: NewEvent) => {
      try {
        await createNewEventCard(formData);
        onSuccess?.(); // Call success callback if provided
      } catch (error) {
        onError?.(error); // Call error callback if provided
      }
    },
    [onSuccess, onError]
  );

  return { createNewEvent };
}

// Hook to edit an existing event and handle success/error callbacks
export function useEditEvent({
  onSuccess,
  onError,
}: UseSettingCardOptions = {}) {
  const editEvent = useCallback(
    async (formData: NewEvent, id: number | string) => {
      try {
        await editEventCard(formData, id);
        onSuccess?.(); // Call success callback if provided
      } catch (error) {
        onError?.(error); // Call error callback if provided
      }
    },
    [onSuccess, onError]
  );

  return { editEvent };
}

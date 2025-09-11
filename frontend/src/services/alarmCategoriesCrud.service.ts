import api from "./api";
import type { CategoryData, CategoryResponse } from "./alarmCategory.service";

export interface AlarmCategoryInput {
  code: number;
  label: string;
  priority: "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW";
  needsApproval?: boolean;
}

export const alarmCategoryCrudService = {
  createAlarmCategory: (payload: AlarmCategoryInput) =>
    api.post<CategoryResponse>("/admin/alarm-categories", payload),

  updateAlarmCategory: (id: string | number, payload: AlarmCategoryInput) =>
    api.put<CategoryResponse>(`/admin/alarm-categories/${id}`, payload),

  deleteAlarmCategory: (id: string | number) =>
    api.delete<CategoryResponse>(`/admin/alarm-categories/${id}`),
};

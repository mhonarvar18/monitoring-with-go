import api from "./api";
import type { ZoneData, ZoneInput } from "./zone.service";
import type { ZoneResponse } from "./zone.service";

export const zoneCrudService = {
  createZone: (payload: ZoneInput) =>
    api.post<ZoneResponse>("/admin/zones", payload),

  updateZone: (id: string | number, payload: ZoneInput) =>
    api.put<ZoneResponse>(`/admin/zones/${id}`, payload),

  deleteZone: (id: string | number) => api.delete<ZoneResponse>(`/admin/zones/${id}`),
};

import api from "./api";
import type { ZoneTypeData, ZoneTypeResponse } from "./zoneType.service";

export interface ZoneTypeInput {
    label?: string
}

export const zoneTypeCrudService = {
    createZoneType: (payload: ZoneTypeInput) => 
        api.post<ZoneTypeResponse>("/admin/zone-types", payload),

    updateZoneType: (id: number | string, payload: ZoneTypeInput) =>
        api.put<ZoneTypeResponse>(`/admin/zone-types/${id}`, payload),

    deleteZoneType: (id: number | string) =>
        api.delete<ZoneTypeResponse>(`/admin/zone-types/${id}`),
}
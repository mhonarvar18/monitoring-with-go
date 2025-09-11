import api from "./api";

export const fetchLocationsByType = (body: { locationType: string, parentId?:number | string, limit?: number, page?: number }) => {
  return api.post("/admin/locations/type", body);
};

// Create a new location
export const createLocation = (body: { parentId: number | string; type: string; label: string }) => {
  return api.post("/admin/locations", body);
};

// Update a location
export const updateLocation = (locationId: number | string, body: { parentId: number | string; type: string; label: string }) => {
  return api.put(`/admin/locations/${locationId}`, body);
};

// Delete a location
export const deleteLocation = (locationId: number | string) => {
  return api.delete(`/admin/locations/${locationId}?lang=fa`);
};
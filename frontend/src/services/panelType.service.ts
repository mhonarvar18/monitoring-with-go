// src/services/panelType.service.ts
import api from "./api";

export interface PanelTypeData {
  id: number | string; // If there is an `id` field; if not, remove this line
  name: string;
  model: string;
  delimiter: string;
  code: number;
  eventFormat: Record<string, any>; // Flexible for arbitrary objects
}

export interface PanelTypeResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: PanelTypeData[];
  };
}

export interface PanelTypeInput {
  name: string;
  model: string;
  delimiter: string;
  code: number;
  eventFormat: Record<string, any>;
}

// Define a new type for create/update responses
export interface PanelTypeSingleResponse {
  statusCode: number;
  message: string;
  data: PanelTypeData;
}


export const fetchPanelTypes = async (
  page: number,
  limit: number
): Promise<PanelTypeResponse["data"]> => {
  const response = await api.post<PanelTypeResponse>(
    "/admin/panel-types/find-all",
    { page, limit }
  );
  return response.data.data;
};

export const createPanelType = async (
  payload: PanelTypeInput
): Promise<PanelTypeSingleResponse> => {
  const res = await api.post<PanelTypeSingleResponse>(
    "/admin/panel-types",
    payload
  );
  return res.data;
};

export const updatePanelType = async (
  id: string | number,
  payload: Partial<PanelTypeInput>
): Promise<PanelTypeSingleResponse> => {
  const res = await api.put<PanelTypeSingleResponse>(
    `/admin/panel-types/${id}`,
    payload
  );
  return res.data;
};

export const deletePanelType = async (id: string | number) => {
  const res = await api.delete<{ statusCode: number; message: string }>(
    `/admin/panel-types/${id}`
  );
  return res.data.message;
};

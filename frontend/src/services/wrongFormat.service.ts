import api from "./api";

export type WrongFormatEvent = string;

export interface WrongFormatResponse {
  statusCode: number;
  message: string;
  data: WrongFormatEvent[];
}

/**
 * Fetches branches with wrong format.
 * @returns an array of raw-format branch strings
 */
export const fetchWrongFormatBranches = async (): Promise<
  WrongFormatEvent[]
> => {
  const response = await api.post<WrongFormatResponse>(
    "/admin/branches/wrongFormat"
  );
  return response.data.data;
};

import api from "./api";
import type { BranchAll } from "../types/BranchAll";

export interface InactiveBranchesRequestBase {
  hour: number;
  locationId: string;
  allActions: boolean;
}
export type InactiveBranchesRequest<Extras extends object = {}> =
  InactiveBranchesRequestBase & Extras;

export interface InactiveBranchesResponse {
  statusCode: number;
  message: string;
  data: BranchAll[];
}

/**
 * Fetches inactive branches.
 * @param params – at minimum `{ hour, locationId, allActions }`
 *                 but you can also pass `{ foo: 123 }`, `{ bar: "baz" }`, etc.
 */
export async function fetchInactiveBranches<Extras extends object>(
  params: InactiveBranchesRequest<Extras> = {
    hour: 12,
    locationId: 1,
    allActions: false,
  } as InactiveBranchesRequest<Extras>
): Promise<BranchAll[]> {
  const res = await api.post<InactiveBranchesResponse>(
    "/admin/branches/inactive",
    params
  );
  return res.data.data;
}

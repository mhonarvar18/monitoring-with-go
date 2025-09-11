import type { PanelTypeData } from "../services/panelType.service";

// ✅ src/types/Branch.ts
export interface Location {
  id: number;
  label: string;
  type: "CITY" | "STATE" | "COUNTRY" | "DISTRICT";
  parent?: Location;
}

export interface BranchAll {
  id: number | string;
  name: string;
  locationId: number | string;
  code: number;
  address: string;
  phoneNumber: string | null;
  destinationPhoneNumber: string | null;
  imgUrl: string | null;
  panelName: string | null;
  panelIp: string | null | string;
  panelCode: number | null;
  panelType: PanelTypeData[];
  panelTypeId: number | null;
  emergencyCall: string | null;
  receiverId: number | null;
  createdAt: string;
  updatedAt: string;
  location: Location;
  receiver: unknown;
  mainPartition?: { label: string };
}

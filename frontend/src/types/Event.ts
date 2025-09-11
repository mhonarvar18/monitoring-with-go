import type { AlarmCategory } from "../services/alarmSetting.service";

export interface Location {
  id: number | string;
  label: string;
  type: string;
  parent?: Location;
}

export interface Branch {
  id: number | string;
  name: string;
  code: number;
  panelName?: string | null;
  emergencyCall?: string | null;
  panelType?: string | null;
  address?: string | null;
  location: Location;
}

export interface AlarmEvent {
  id: number | string;
  label: string;
  code: number;
  protocol: string;
  category?: AlarmCategory | null;
}

export interface BranchDefault {
  id: number | string;
  name: string;
  code: number;
}

export interface Partition {
  id: number | string;
  label: string;
  branchDefault: BranchDefault | null
}

export interface Employee {
  id: number | string;
  name: string;
  lastName: string
}

export interface Zone {
  id: number | string;
  label: string;
}

export interface Event {
  id: number | string;
  time: string; // e.g. "07:20"
  date: string; // e.g. "2025-05-18"
  ip: string; // e.g. "178.131.100.15"
  referenceId: string;
  // cameraImage: string | null;
  branchId: string | number;
  originalBranchCode: string;
  originalPartitionId: string;
  originalEmployeeId: string;
  originalZoneId: string;
  confermationStatus: string | null;
  description: string | null;
  action: string;
  alarm: AlarmEvent;
  branch: Branch;
  zone: Zone | null;
  employee: Employee | null;
  partition: Partition | null;
  alarmColor: string
  audioUrl: string
}

import {
  MdLocalFireDepartment,
  MdOutlineSecurity,
  MdNotificationsActive,
} from "react-icons/md";
import { GiPistolGun, GiShieldEchoes } from "react-icons/gi";
import { FiShield , FiShieldOff  } from "react-icons/fi";

import type { IconType } from "react-icons";

export const getAlarmColor = (label: string): string => {
  switch (label) {
    case "حریق":
      return "#F59E0B";
    case "سرقت":
      return "#B91C1C";
    case "پدال":
      return "#3B82F6";
    case "مسلح":
      return "#10B981";
    case "غیر مسلح":
      return "#22C55E";
    default:
      return "#CCCCCC";
  }
};

export const getAlarmIcon = (label: string): IconType => {
  switch (label) {
    case "حریق":
      return MdLocalFireDepartment;
    case "سرقت":
      return MdOutlineSecurity;
    case "پدال":
      return MdNotificationsActive;
    case "مسلح":
      return FiShield;
    case "غیر مسلح":
      return FiShieldOff;
    default:
      return MdOutlineSecurity; // fallback
  }
};

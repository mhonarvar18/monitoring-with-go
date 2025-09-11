import type { EventData } from "../../services/events.service";
import type { TableColumn } from "../../services/TablePdfDocumnet";
import moment from "moment-jalaali";
import { toPersianDigits } from "../../utils/numberConvert";

const dash = "—";

const getEventDisplayValue = (alarmLabel?: string, action?: string) => {
  if (!alarmLabel) return "Unknown";
  if (alarmLabel === "مسلح / غیر مسلح") {
    return action === "ARM" ? "مسلح" : "غیر مسلح";
  }
  return alarmLabel;
};

// helpers for nested location (STATE/CITY/DISTRICT)
function getProvinceLabel(row: EventData): string {
  const loc: any = row.branch?.location;
  if (!loc) return dash;

  // if DISTRICT -> province is grandparent; if CITY/STATE -> parent might be province
  const candidate = loc.type === "DISTRICT" ? loc.parent?.parent : loc.parent;
  const label = candidate?.type === "STATE" ? candidate.label : null;
  return label ? String(label) : "-";
}

function getCityLabel(row: EventData): string {
  const loc: any = row.branch?.location;
  if (!loc) return dash;

  const cityNode = loc.type === "DISTRICT" ? loc.parent : loc;
  const label = cityNode?.type === "CITY" ? cityNode.label : null;
  return label ? String(label) : "-";
}

function getDistrictLabel(row: EventData): string {
  const loc: any = row.branch?.location;
  const label = loc?.type === "DISTRICT" ? loc.label : null;
  return label ? String(label) : "";
}

export const pdfEventsColumns: TableColumn<EventData>[] = [
  {
    header: "تاریخ",
    key: "date",
    accessor: (row) =>
      row.date
        ? toPersianDigits(moment(row.date, "YYYY-MM-DD").format("jYYYY/jMM/jDD"))
        : dash,
  },
  {
    header: "ساعت",
    key: "time",
    accessor: (row) => (row.time ? toPersianDigits(row.time) : dash),
  },
  {
    header: "استان",
    key: "province",
    accessor: (row) => getProvinceLabel(row),
  },
  {
    header: "شهر",
    key: "city",
    accessor: (row) => getCityLabel(row),
  },
  {
    header: "منطقه",
    key: "district",
    accessor: (row) => getDistrictLabel(row),
  },
  {
    header: "شعبه",
    key: "branch",
    accessor: (row) => (row.branch?.name ? String(row.branch.name) : dash),
  },
  {
    header: "کد شعبه",
    key: "branchCode",
    accessor: (row) => {
      const code = row.branch?.code ?? row.originalBranchCode;
      return code ? toPersianDigits(String(code)) : dash;
    },
  },
  {
    header: "آیپی / تلفن",
    key: "ip",
    accessor: (row) => (row.ip ? toPersianDigits(String(row.ip)) : dash),
  },
  {
    header: "رویداد",
    key: "alarm",
    accessor: (row) => {
      const label = row.alarm?.label;
      const action = row.action;
      return getEventDisplayValue(label, action) || dash;
    },
  },
  {
    header: "پارتیشن",
    key: "partition",
    accessor: (row) => {
      const v = row.partition?.label ?? row.originalPartitionId;
      return v ? toPersianDigits(String(v)) : dash;
    },
  },
  {
    header: "زون",
    key: "zone",
    accessor: (row) => {
      const v = row.zone?.label ?? row.originalZoneId;
      return v ? toPersianDigits(String(v)) : dash;
    },
  },
  {
    header: "کارمند شعبه",
    key: "user",
    accessor: (row) => {
      const v = row.employee?.lastName ?? row.originalEmployeeId;
      return v ? String(v) : dash;
    },
  },
];

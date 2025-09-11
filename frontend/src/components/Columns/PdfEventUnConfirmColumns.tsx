import moment from "moment-jalaali";
import type { TableColumn } from "../../services/TablePdfDocumnet";
import { toPersianDigits } from "../../utils/numberConvert";

const toJalali = (g?: string | Date | null) => {
  if (!g) return "—";
  const iso = g instanceof Date ? g.toISOString().slice(0, 10) : String(g);
  const m = moment(iso, "YYYY-MM-DD", true);
  return m.isValid() ? toPersianDigits(m.format("jYYYY/jMM/jDD")) : "—";
};

// جستجو در زنجیرهٔ location برای نوع موردنظر
const pickLoc = (loc: any, wanted: string[]) => {
  let cur = loc;
  for (let i = 0; i < 4 && cur; i++) {
    const t = String(cur?.type || "").toUpperCase();
    if (wanted.includes(t)) return cur?.label ?? "—";
    cur = cur?.parent;
  }
  return "—";
};

export const pdfEventColumns: TableColumn<any>[] = [
  { header: "تاریخ", key: "date",
    accessor: (row) => toJalali(row?.date ?? row?.createdAt),
  },
  { header: "ساعت", key: "time",
    accessor: (row) => row?.time ? toPersianDigits(String(row.time)) : "—",
  },
  { header: "استان", key: "province",
    accessor: (row) => pickLoc(row?.branch?.location, ["STATE","PROVINCE"]),
  },
  { header: "شهر", key: "city",
    accessor: (row) => pickLoc(row?.branch?.location, ["CITY"]),
  },
  { header: "منطقه", key: "district",
    accessor: (row) => pickLoc(row?.branch?.location, ["DISTRICT"]),
  },
  { header: "شعبه", key: "branch",
    accessor: (row) => row?.branch?.name ?? "—",
  },
  { header: "کد شعبه", key: "branchCode",
    accessor: (row) =>
      row?.branch?.code != null ? toPersianDigits(String(row.branch.code)) : "—",
  },
  { header: "آیپی / تلفن", key: "ip",
    accessor: (row) => row?.ip ? toPersianDigits(row.ip) : "—",
  },
  { header: "رویداد", key: "alarm",
    accessor: (row) => row?.alarm?.label ?? "—",
  },
  // { header: "کد رویداد", key: "alarmCode",
  //   accessor: (row) =>
  //     row?.alarm?.code != null ? toPersianDigits(String(row.alarm.code)) : "—",
  // },
  { header: "پارتیشن", key: "partition",
    accessor: (row) => row?.partition?.label ?? "—",
  },
  { header: "زون", key: "zone",
    accessor: (row) => row?.zone?.label ?? "—",
  },
  { header: "کارمند شعبه", key: "employee",
    accessor: (row) => {
      const e = row?.employee;
      if (!e) return "—";
      const first = e.firstName ?? e.name;
      const last  = e.lastName;
      const full  = [first, last].filter(Boolean).join(" ").trim();
      return full || "—";
    },
  },
  // { header: "آدرس شعبه", key: "address",
  //   accessor: (row) => row?.branch?.address ?? "—",
  // },
  { header: "وضعیت تایید", key: "status",
    accessor: (row) =>
      row?.confermationStatus === "Unconfirmed" ? "تایید نشده" : "تایید شده",
  },
];

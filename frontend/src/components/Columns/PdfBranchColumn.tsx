import type { BranchAll } from "../../types/BranchAll";
import type { TableColumn } from "../../services/TablePdfDocumnet";
import { toPersianDigits } from "../../utils/numberConvert";

// Helper for Persian fallback
const p = (val: any) => val == null ? "—" : toPersianDigits(val);

export const branchPdfColumns: TableColumn<BranchAll>[] = [
  // {
  //   header: "ردیف",
  //   key: "id",
  //   accessor: row => p(row.id), // Row number, or use p(row.id) for DB id
  // },
  {
    header: "نام شعبه",
    key: "name",
    accessor: row => row.name ?? "—",
  },
  {
    header: "کد شعبه",
    key: "code",
    accessor: row => p(row.code), 
  },
  {
    header: "استان",
    key: "province",
    accessor: row => row.location?.parent?.label ?? "—", 
  },
  {
    header: "شهر",
    key: "city",
    accessor: row => row.location?.label ?? "—", // Fallback if city is missing
  },
  {
    header: "منطقه",
    key: "district",
    accessor: row =>
      row.location?.type === "DISTRICT" ? row.location?.label : "—", // Only show district if available
  },
  {
    header: "آدرس",
    key: "address",
    accessor: row => row.address ?? "—", // Fallback to "—" if address is missing
  },
  {
    header: "شماره تماس",
    key: "phoneNumber",
    accessor: row => p(row.phoneNumber), // Convert phone number to Persian digits
  },
  {
    header: "برند پنل",
    key: "panelName",
    accessor: row => row.panelName ?? "—", // Fallback to "—" if panel name is missing
  },
  {
    header: "مدل پنل",
    key: "panelType",
    accessor: row => row.panelType ?? "—", // Fallback to "—" if panel type is missing
  },
  {
    header: "آیپی",
    key: "panelIp",
    accessor: row => p(row.panelIp), // Convert IP to Persian digits
  },
];

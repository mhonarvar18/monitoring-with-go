import type { ColumnDef } from "@tanstack/react-table";
import type { BranchAll } from "../../types/BranchAll";
import { toPersianDigits } from "../../utils/numberConvert";

export const branchColumn: ColumnDef<BranchAll>[] = [
  { accessorKey: "name", header: "نام شعبه", size: 100 },
  { accessorKey: "code", header: "کد", size: 100, cell: ({ getValue }) => {
        const value = getValue() as any;
        return (
          <>
            <div className="w-full flex justify-center items-center">
              {toPersianDigits(value)}
            </div>
          </>
        );
      }, },
  {
    accessorKey: "address",
    header: "آدرس",
    size: 150,
    cell: ({ row }) => {
      const address = row.original.address || "";
      const display =
        address.length > 10 ? address.slice(0, 10) + "…" : address;
      return (
        <div className="w-full h-full flex justify-center items-center">
          {display}
        </div>
      );
    },
  },
  { accessorKey: "phoneNumber", header: "شماره تماس", size: 120 },
  {
    header: "استان",
    accessorFn: (row) => row.location?.parent?.label,
    id: "location.parent.label",
    size: 100,
  },
  {
    header: "شهر",
    accessorFn: (row) => row.location?.label,
    id: "location.label",
    size: 100,
  },
];

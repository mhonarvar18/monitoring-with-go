import type { ColumnDef } from "@tanstack/react-table";
import type { EventData } from "../../services/events.service";
import { convertToJalaali } from "../../utils/convertTime";
import { toPersianDigits } from "../../utils/numberConvert";

export const eventColumns: ColumnDef<EventData>[] = [
  {
    header: "ردیف",
    accessorKey: "id",
    size: 30,
    cell: ({ row, table }) => {
      const totalRows = table.getRowModel().rows.length; // or use your actual data length
      const reverseIndex = totalRows - row.index;
      return (
        <div className="w-full flex justify-center items-center">
          {toPersianDigits(reverseIndex)}
        </div>
      );
    },
  },
  {
    header: "تاریخ",
    accessorKey: "date",
    size: 30,
    cell: ({ getValue }) => {
      return (
        <>
          <span>{toPersianDigits(convertToJalaali(getValue() as any))}</span>
        </>
      );
    },
  },
  {
    header: "زمان",
    accessorKey: "time",
    size: 30,
    cell: ({ getValue }) => {
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            <span>{toPersianDigits(getValue<any>())}</span>
          </div>
        </>
      );
    },
  },
  {
    id: "province",
    header: "استان",
    cell: ({ row }) => {
      let stateNode: any = null;
      const loc = row.original?.branch?.location;
      if (!loc) {
        return <span></span>;
      }
      if (loc.type === "DISTRICT") {
        stateNode = loc.parent?.parent;
      } else {
        stateNode = loc.parent;
      }
      return <span>{stateNode?.type === "STATE" ? stateNode.label : ""}</span>;
    },
    size: 30,
  },
  {
    id: "city",
    header: "شهر",
    cell: ({ row }) => {
      let cityNode: any = null;
      const loc = row.original?.branch?.location;
      if (!loc) {
        return <span></span>;
      }
      if (loc.type === "DISTRICT") {
        cityNode = loc.parent;
      } else {
        cityNode = loc;
      }
      return <span>{cityNode?.type === "CITY" ? cityNode.label : ""}</span>;
    },
    size: 30,
  },
  {
    id: "district",
    header: "منطقه",
    cell: ({ row }) => {
      const districtNode = row.original?.branch?.location;
      return (
        <span>
          {districtNode?.type === "DISTRICT" ? districtNode.label : ""}
        </span>
      );
    },
    size: 30,
  },
  {
    header: "شعبه",
    accessorKey: "branch.name",
    size: 40,
  },
  {
    header: "IP",
    accessorKey: "ip",
    size: 100,
    cell: ({ getValue }) => {
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            <span>{toPersianDigits(getValue<any>())}</span>
          </div>
        </>
      );
    },
  },
  {
    header: "آلارم",
    accessorKey: "alarm.label",
    size: 100,
  },
  {
    header: "کاربر",
    accessorKey: "user",
    cell: ({ row }) => (
      <span>
        {row.original.employee?.name || "---"}
        {row.original.employee?.lastName || ""}
      </span>
    ),
    size: 40,
  },
  {
    header: "وضعیت",
    accessorKey: "confermationStatus",
    cell: ({ row }) => (
      <span
        className={`${
          row.original.confermationStatus === "Unconfirmed"
            ? "text-red-500"
            : "text-green-500"
        }`}
      >
        {row.original.confermationStatus === "Unconfirmed"
          ? "تایید نشده"
          : row.original.confermationStatus}
      </span>
    ),
    size: 100,
  },
];

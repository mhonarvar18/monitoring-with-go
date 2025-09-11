import type { ColumnDef } from "@tanstack/react-table";
import type { AlarmData as AppAlarm } from "../../services/alarms.service";
import { EditIcon } from "../../assets/icons/EditIcon";
import { toPersianDigits } from "../../utils/numberConvert";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

export const alarmColumns = ({
  onEdit,
}: {
  onEdit: (row: AppAlarm) => void;
}): ColumnDef<AppAlarm>[] => [
  {
    header: "کد",
    accessorKey: "code",
    size: 15,
    cell: ({ getValue }) => {
      const value = getValue() as any;
      return (
        <>
          <div className="w-full flex justify-center items-center">
            {toPersianDigits(value)}
          </div>
        </>
      );
    },
  },
  {
    header: "نام آلارم",
    accessorKey: "label",
    size: 50,
    cell: ({ getValue }) => {
      const value = getValue() as any;
      return (
        <>
          <div className="w-full flex justify-center items-center">
            {toPersianDigits(value)}
          </div>
        </>
      );
    },
  },
  {
    header: "نوع",
    accessorKey: "type",
    cell: ({ row }) => {
      const typeValue = row.getValue("type");
      let displayValue = "";
      if (typeValue === "ZONE") {
        displayValue = "زون";
      } else if (typeValue === "USER") {
        displayValue = "کاربر";
      }
      return <span>{displayValue}</span>;
    },
    size: 50,
  },
  {
    header: "پروتکل",
    accessorKey: "protocol",
    cell: ({ row }) => {
      const typeValue = row.getValue("protocol");
      let displayValue = "";
      if (typeValue === "TELL") {
        displayValue = "خط تلفن";
      } else if (typeValue === "IP") {
        displayValue = "آی‌پی";
      }
      return <span>{displayValue}</span>;
    },
    size: 50,
  },
  // description
  {
    header: "دسته بندی آلارم",
    accessorKey: "category.label",
    size: 50,
  },
  {
    header: "نوع پنل",
    accessorKey: "panelType.name",
    size: 50,
  },
  {
    header: "توضیحات",
    accessorKey: "description",
    size: 50,
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (!value) return null;
      return value.length > 16 ? value.slice(0, 16) + "..." : value;
    },
  },
  {
    header: "تنظیمات",
    accessorKey: "description",
    size: 50,
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <>
          <div className="w-full h-full flex justify-center items-center gap-2">
            <ConditionalRender permission="alarm:update">
              <div
                onClick={() => onEdit(rowData)}
                className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
              >
                <EditIcon />
              </div>
            </ConditionalRender>
          </div>
        </>
      );
    },
  },
];

import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeDataResponse } from "../../services/employee.service";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { toPersianDigits } from "../../utils/numberConvert";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

export const employeeColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
}): ColumnDef<EmployeeDataResponse>[] => [
  {
    header: "نام",
    accessorKey: "name",
    size: 26,
  },
  {
    header: "نام خانوادگی",
    accessorKey: "lastName",
    size: 26,
  },
  {
    header: "سمت",
    accessorKey: "position",
    size: 26,
  },
  {
    header: "شماره کاربر",
    accessorKey: "localId",
    size: 26,
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
    header: "شماره پرسنلی",
    accessorKey: "nationalCode",
    size: 26,
  },
  {
    header: "تنظیمات",
    accessorKey: "id",
    size: 20,
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <ConditionalRender permission="employee:update">
              <div
                onClick={() => onEdit(rowData)}
                className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
              >
                <EditIcon />
              </div>
            </ConditionalRender>
            <ConditionalRender permission="employee:delete">
              <div
                onClick={() => onDelete(rowData)}
                className="p-2 border border-red-500 rounded-[10px] cursor-pointer"
              >
                <TrashIcon />
              </div>
            </ConditionalRender>
          </div>
        </>
      );
    },
  },
];

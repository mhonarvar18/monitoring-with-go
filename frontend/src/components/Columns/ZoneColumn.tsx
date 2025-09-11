import type { ColumnDef } from "@tanstack/react-table";
import type { ZoneData } from "../../services/zone.service";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { toPersianDigits } from "../../utils/numberConvert";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

export const zoneColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
}): ColumnDef<ZoneData>[] => [
  {
    header: "نام زون",
    accessorKey: "label",
    size: 26,
  },
  {
    header: "نام پارتیشن",
    accessorKey: "partition.label",
    size: 26,
  },
  {
    header: "شماره زون",
    accessorKey: "localId",
    size: 26,
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
    header: "تنظیمات",
    accessorKey: "id",
    size: 20,
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <ConditionalRender permission="zone:update">
              <div
                onClick={() => onEdit(rowData)}
                className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
              >
                <EditIcon />
              </div>
            </ConditionalRender>
            <ConditionalRender permission="zone:delete">
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

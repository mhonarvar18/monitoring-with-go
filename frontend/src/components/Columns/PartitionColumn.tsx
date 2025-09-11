import type { ColumnDef } from "@tanstack/react-table";
import type { Partition } from "../../services/partition.service";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { toPersianDigits } from "../../utils/numberConvert";
import { ConditionalRender } from "../../hooks/useHasPermission";

export const partitionColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
}): ColumnDef<Partition>[] => [
  {
    header: "نام پارتیشن",
    accessorKey: "label",
    size: 26,
  },
  {
    header: "شماره پارتیشن",
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
            <ConditionalRender permission="partition:update">
              <div
                onClick={() => onEdit(rowData)}
                className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
              >
                <EditIcon />
              </div>
            </ConditionalRender>
            <ConditionalRender permission="partition:delete">
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

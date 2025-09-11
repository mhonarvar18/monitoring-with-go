import type { ColumnDef } from "@tanstack/react-table";
import type { PanelTypeData } from "../../services/panelType.service";
import { toPersianDigits } from "../../utils/numberConvert";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

/**
 * panelTypeColumns
 * @param onEdit - function(row)
 * @param onDelete - function(row)
 */
export const panelTypeColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: PanelTypeData) => void;
  onDelete: (row: PanelTypeData) => void;
}): ColumnDef<PanelTypeData>[] => [
  // {
  //   header: "ردیف",
  //   accessorKey: "id",
  //   size: 20,
  //   cell: ({ row }) => {
  //     const value = row.index;
  //     return (
  //       <div className="w-full h-full flex justify-center items-center">
  //         <span>{value + 1}</span>
  //       </div>
  //     );
  //   },
  // },
  {
    header: "نام پنل",
    accessorKey: "name",
    size: 30,
  },
  {
    header: "مدل پنل",
    accessorKey: "model",
    size: 30,
  },
  {
    header: "تنظیمات",
    accessorKey: "settings",
    size: 40,
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex justify-center items-center gap-2">
          <ConditionalRender permission="paneltype:upadate">
            <div
              onClick={() => onEdit(rowData)}
              className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
            >
              <EditIcon />
            </div>
          </ConditionalRender>
          <ConditionalRender permission="paneltype:delete">
            <div
              onClick={() => onDelete(rowData)}
              className="p-2 border border-red-500 rounded-[10px] cursor-pointer"
            >
              <TrashIcon />
            </div>
          </ConditionalRender>
        </div>
      );
    },
  },
];

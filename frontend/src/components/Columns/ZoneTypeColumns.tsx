import type { ColumnDef } from "@tanstack/react-table";
import type { ZoneTypeData } from "../../services/zoneType.service";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

/**
 * zoneTypeColumns
 * @param onEdit - function(row)
 * @param onDelete - function(row)
 */
export const zoneTypeColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: ZoneTypeData) => void;
  onDelete: (row: ZoneTypeData) => void;
}): ColumnDef<ZoneTypeData>[] => [
  {
    header: "نام نوع زون",
    accessorKey: "label",
    size: 50,
  },
  {
    header: "تنظیمات",
    accessorKey: "settings",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <ConditionalRender permission="zonetype:update">
              <div
                onClick={() => onEdit(rowData)}
                className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
              >
                <EditIcon />
              </div>
            </ConditionalRender>
            <ConditionalRender permission="zonetype:delete">
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
    size: 50,
  },
];

import type { ColumnDef } from "@tanstack/react-table";
import type { Location } from "../../hooks/useLocationsByType";
import Button from "../Button";
import { FaPlus } from "react-icons/fa6";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import type { MyColumnDef } from "./EventColumns";
import { ConditionalRender } from "../../hooks/useHasPermission";

export const cityColumns = ({
  onCreate,
  onEdit,
  onDelete,
}: {
  onCreate: (row: Location | null) => void;
  onEdit: (row: Location) => void;
  onDelete: (row: Location) => void;
}): MyColumnDef<Location>[] => [
  {
    header: "نام شهر",
    accessorKey: "label",
    size: 50,
  },
  {
    header: () => (
      <ConditionalRender permission="location:create">
        <Button className="rounded-full p-2 bg-btns border-0" onClick={() => onCreate(null)}>
          <FaPlus color="#FFF" />
        </Button>
      </ConditionalRender>
    ),
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <ConditionalRender permission="location:update">
          <Button
            className="border p-2 rounded-[10px] border-[#FF9F1C] cursor-pointer"
            onClick={() => onEdit(row.original)}
          >
            <EditIcon />
          </Button>
        </ConditionalRender>
        <ConditionalRender permission="location:delete">
          <Button
            className="border p-2 rounded-[10px] border-red-500 cursor-pointer"
            onClick={() => onDelete(row.original)}
          >
            <TrashIcon />
          </Button>
        </ConditionalRender>
      </div>
    ),
    size: 50,
  },
];

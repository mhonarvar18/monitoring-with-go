import type { ColumnDef } from "@tanstack/react-table";
import type { CategoryData } from "../../services/alarmCategory.service";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { toPersianDigits } from "../../utils/numberConvert";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

const PRIORITY_OPTIONS = [
  { value: "VERY_HIGH", label: "بسیار بالا" },
  { value: "HIGH", label: "بالا" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "LOW", label: "کم" },
  { value: "VERY_LOW", label: "بسیار کم" },
  { value: "NONE", label: "بدون اولویت" },
];

export const alarmCategoryColumn = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: CategoryData) => void;
  onDelete: (row: CategoryData) => void;
}): ColumnDef<CategoryData>[] => [
  {
    header: "نام",
    accessorKey: "label",
    size: 60,
    cell: ({ row }) => {
      const label = row.original.label;
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            {toPersianDigits(label)}
          </div>
        </>
      );
    },
  },
  {
    header: "کد",
    accessorKey: "code",
    size: 10,
    cell: ({ row }) => {
      const code = row.original.code;
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            {toPersianDigits(code)}
          </div>
        </>
      );
    },
  },
  {
    header: "نیاز به تایید؟",
    accessorKey: "needsApproval",
    cell: ({ getValue }) => (getValue() ? "بله" : "خیر"),
    size: 50,
  },
  {
    header: "اولویت",
    accessorKey: "priority",
    cell: ({ row }) => {
      const priority = PRIORITY_OPTIONS.find(
        (option) => option.value === row.getValue("priority")
      );
      return <span>{priority ? priority.label : "نامشخص"}</span>;
    },
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
            <ConditionalRender permission="alarmcategory:upadate">
              <div
                onClick={() => onEdit(rowData)}
                className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
              >
                <EditIcon />
              </div>
            </ConditionalRender>
            <ConditionalRender permission="alarmcategory:delete">
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

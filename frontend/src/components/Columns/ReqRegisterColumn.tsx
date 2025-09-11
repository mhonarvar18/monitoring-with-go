import type { ColumnDef } from "@tanstack/react-table";
import type { PendingUser } from "../../services/reqRegister.service";
import { toPersianDigits } from "../../utils/numberConvert";
import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import Button from "../Button";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

const UserTypeLabel = {
  OWNER: "مالک",
  SUPER_ADMIN: "اپراتور ارشد",
  ADMIN: "اپراتور",
  USER: "کاربر",
};

export const reqRegisterColumns = ({
  onConfirm,
  onEdit,
  onDelete,
}: {
  onConfirm: (row: any) => void;
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
}): ColumnDef<PendingUser>[] => [
  {
    header: "ردیف",
    accessorKey: "id",
    cell: ({ row }) => {
      return <>{toPersianDigits(row.index + 1)}</>;
    },
    size: 40,
  },
  {
    header: "نام کاربری",
    accessorKey: "username",
    size: 50,
  },
  {
    header: "نام و نام خانوادگی",
    accessorKey: "fullname",
    size: 50,
  },
  {
    header: "نوع کاربری",
    accessorKey: "type",
    cell: ({ getValue }) => {
      const raw = getValue();
      const label = UserTypeLabel[raw as any] || raw;
      return (
        <div className="w-full h-full flex justify-center items-center">
          <span>{label}</span>
        </div>
      );
    },
    size: 50,
  },
  {
    header: "کد ملی",
    accessorKey: "nationalityCode",
    size: 50,
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
    header: "شماره همراه",
    accessorKey: "phoneNumber",
    size: 50,
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
    header: "آدرس",
    accessorKey: "address",
    cell: ({ row }) => {
      const address = row.original?.address || "";
      // Trim description to 16 characters and add ellipsis if longer
      const displayText =
        address.length > 14 ? address.substring(0, 14) + "..." : address;

      return (
        <div data-tooltip-id="address-tooltip" data-tooltip-content={address}>
          <span className="text-sm">{displayText}</span>
        </div>
      );
    },
    size: 60,
  },
  {
    header: "تنظیمات",
    accessorKey: "status",
    cell: ({ row, getValue }) => {
      const status = getValue();
      const eventId = row.original.id; // Retrieve event ID from row data
      const rowData = row.original;
      if (status === "pending") {
        return (
          <>
            <div className="flex justify-center items-center gap-2">
              <ConditionalRender permission="usercreate:create">
                <div
                onClick={() => onConfirm(rowData)}
                className="p-2 border border-green-500 rounded-[10px] cursor-pointer"
              >
                <MdCheck color="green" />
              </div>
              </ConditionalRender>
              <ConditionalRender permission="usercreate:delete">
                <div
                onClick={() => onDelete(rowData)}
                className="p-2 border border-red-500 rounded-[10px] cursor-pointer"
              >
                <MdClose color="red" />
              </div>
              </ConditionalRender>
              <ConditionalRender permission="usercreate:update">
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
      } else if (status === "confirmed") {
        return (
          <button className="bg-green-700 w-4 h-4 rounded-full">
            ثبت شده است
          </button>
        );
      } else {
        return null; // Show empty if null
      }
    },
    size: 50,
  },
];

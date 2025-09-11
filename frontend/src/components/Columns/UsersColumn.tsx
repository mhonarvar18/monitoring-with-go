import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../services/users.service";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { MdKey } from "react-icons/md";
import { toPersianDigits } from "../../utils/numberConvert";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission"; // Import the new helper
import moment from "moment-jalaali";

const UserTypeLabel = {
  OWNER: "مالک",
  SUPER_ADMIN: "اپراتور ارشد",
  ADMIN: "اپراتور",
  USER: "کاربر",
};

export const userColumns = ({
  onEdit,
  onDelete,
  onPermission,
}: {
  onEdit: (row: User) => void;
  onDelete: (row: User) => void;
  onPermission: (row: User) => void;
}): ColumnDef<User>[] => [
  {
    header: "نام و نام خانوادگی",
    accessorKey: "fullname",
    size: 50,
  },
  {
    header: "نام کاربری",
    accessorKey: "username",
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
    header: "نوع کاربری",
    accessorKey: "type",
    cell: ({ getValue }) => {
      const raw = getValue(); // Ensure that raw is typed as UserType
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
    header: "وضعیت",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const isOnline = getValue() === "ONLINE";
      return (
        <div className="w-full h-full flex justify-center items-center gap-2">
          <span
            className={`w-4 h-4 rounded-full 
            ${isOnline ? "bg-green-600" : "bg-red-600"} 
            flashing`}
          ></span>
          <span
            className={`font-semibold ${
              isOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOnline ? "آنلاین" : "آفلاین"}
          </span>
        </div>
      );
    },
    size: 50,
  },
  {
    header: "IP",
    accessorKey: "ip",
    cell: ({ getValue }) => {
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            <span className="font-mono font-semibold text-sm">
              {(getValue() as string) || "نامشخص"}
            </span>
          </div>
        </>
      );
    },
    size: 50,
  },
  // {
  //   header: "شماره پرسنلی",
  //   accessorKey: "personalCode",
  //   size: 50,
  //   cell: ({ getValue }) => {
  //     return (
  //       <>
  //         <div className="w-full h-full flex justify-center items-center">
  //           <span>{toPersianDigits(getValue<any>())}</span>
  //         </div>
  //       </>
  //     );
  //   },
  // },
  // {
  //   header: "نام پدر",
  //   accessorKey: "fatherName",
  //   size: 50,
  // },
  {
    header: "شماره موبایل",
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
    header: "شهر",
    accessorKey: "location.label",
    cell: ({ row }) => {
      let cityNode: any = null;
      const loc = row.original?.location;
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
    header: "آدرس",
    accessorKey: "address",
    cell: ({ row }) => {
      const address = row.original?.address || "";
      // Trim description to 16 characters and add ellipsis if longer
      const displayText =
        address.length > 14 ? address.substring(0, 14) + "..." : address;

      return (
        <div
          data-tooltip-id="address-tooltip-monitor"
          data-tooltip-content={address}
        >
          <span className="text-sm cursor-pointer">{displayText}</span>
        </div>
      );
    },
    size: 50,
  },
  {
    header: "زمان درخواست",
    size: 50,
  },
  {
    header: "زمان تایید",
    accessorKey: "ConfirmationTime",
    cell: ({ getValue }) => {
      const iso = getValue<string>();
      if (!iso) return "-";
      // Parse and convert to Jalali
      const m = moment(iso);
      const jalaliDate = m.format("jYYYY/jMM/jDD"); // Jalali date part
      const time = m.format("HH:mm"); // Time part
      return (
        <span className="ltr" dir="ltr">
          {jalaliDate}-{time}
        </span>
      );
    },
    size: 50,
  },
  {
    header: "تنظیمات",
    accessorKey: "settings",
    cell: ({ row }) => {
      const user = row.original;
      const isOwner = user.type === "OWNER";
      return (
        <div className="flex justify-center items-center gap-2">
          <RequirePermission perm="user:update">
            <div
              className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
              onClick={() => onEdit(user)}
            >
              <EditIcon />
            </div>
          </RequirePermission>
          {!isOwner && (
            <>
              <ConditionalRender permission="user:delete">
                <div
                  className="p-2 border border-red-500 rounded-[10px] cursor-pointer"
                  onClick={() => onDelete(user)}
                >
                  <TrashIcon />
                </div>
              </ConditionalRender>

              <ConditionalRender permission="permission:read">
                <div
                  className="p-2 border border-sky-950 rounded-[10px] cursor-pointer"
                  onClick={() => onPermission(user)}
                >
                  <MdKey color="#082f49" />
                </div>
              </ConditionalRender>
            </>
          )}
        </div>
      );
    },
    size: 50,
  },
];

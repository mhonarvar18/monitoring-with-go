import type { ColumnDef } from "@tanstack/react-table";
import type { PendingPasswordReset } from "../../services/reqPassword";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { convertToJalaali } from "../../utils/convertTime";
import { toPersianDigits } from "../../utils/numberConvert";
import { ConditionalRender } from "../../hooks/useHasPermission";

export const getReqPasswordColumns = (
  openConfirmModal: (username: string, action: "confirm" | "reject") => void
): ColumnDef<PendingPasswordReset>[] => [
  {
    header: "ردیف",
    accessorKey: "id",
    cell: ({ row }) => <span>{toPersianDigits(row.index + 1)}</span>,
    size: 5,
  },
  {
    header: "نام کاربری",
    accessorKey: "username",
    size: 50,
  },
  {
    header: "شماره همراه",
    accessorKey: "phoneNumber",
    size: 50,
    cell: ({ getValue }) => (
      <div className="w-full h-full flex justify-center items-center">
        <span>{toPersianDigits(getValue<any>())}</span>
      </div>
    ),
  },
  {
    header: "تاریخ و زمان درخواست",
    accessorKey: "requestedAt",
    size: 50,
    cell: ({ getValue }) => {
      const jalaaliValue = convertToJalaali(getValue() as any);
      return <span dir="ltr">{toPersianDigits(jalaaliValue)}</span>;
    },
  },
  {
    header: "تنظیمات",
    accessorKey: "status",
    size: 50,
    cell: ({ row, getValue }) => {
      const status = getValue();
      const username = row.original.username;

      if (status === "pending") {
        return (
          <div className="flex justify-center items-center gap-3">
            <ConditionalRender permission="">
              <button
                className="bg-green-600 px-2 py-2 rounded-full"
                onClick={() => openConfirmModal(username, "confirm")}
              >
                <FaCheck size={18} color="white" />
              </button>
            </ConditionalRender>
            <ConditionalRender permission="">
              <button
                className="bg-red-600 px-2 py-2 rounded-full"
                onClick={() => openConfirmModal(username, "reject")}
              >
                <FaXmark size={18} color="white" />
              </button>
            </ConditionalRender>
          </div>
        );
      }

      if (status === "confirmed") {
        return (
          <span className="bg-green-700 text-white text-xs px-2 py-1 rounded">
            ثبت شده است
          </span>
        );
      }

      return null;
    },
  },
];

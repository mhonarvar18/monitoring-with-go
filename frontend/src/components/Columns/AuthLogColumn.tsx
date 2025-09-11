import type { ColumnDef } from "@tanstack/react-table";
import type { AuthLog } from "../../services/authLog.service";
import { toPersianDigits } from "../../utils/numberConvert";

export const authLogColumns: ColumnDef<AuthLog>[] = [
  {
    header: "ردیف",
    accessorKey: "id",
    cell: ({ row, table }) => {
      const totalRows = table.getRowModel().rows.length; // or use your actual data length
      const reverseIndex = totalRows - row.index;
      return (
        <div className="w-full flex justify-center items-center">
          {toPersianDigits(reverseIndex)}
        </div>
      );
    },
  },
  { header: "نام و نام خانوادگی", accessorKey: "user.fullname" },
  { header: "نام کاربری", accessorKey: "user.username" },
  { header: "IP کاربر", accessorKey: "ip" },
  {
    header: "ساعت و تاریخ ورود",
    accessorKey: "loginTime",
    cell: ({ row }) => {
      const LoginTime = row.original.loginTime;

      // Create Date object and add 3 hours 30 minutes
      const date = new Date(LoginTime);
      date.setHours(date.getHours() + 3);
      date.setMinutes(date.getMinutes() + 30);

      // Format the adjusted date
      const isoString = date.toISOString();
      const datePart = isoString.split("T")[0].replace(/-/g, "/");
      const timePart = isoString.split("T")[1].substring(0, 8);
      const datePersian = new Date(datePart).toLocaleDateString("fa-IR");
      return (
        <>
          <div className="w-full h-full flex justify-center items-center gap-2">
            <span>{toPersianDigits(timePart)}</span>
            {"-"}
            <span>{datePersian}</span>
          </div>
        </>
      );
    },
  },
  {
    header: "ساعت و تاریخ خروج",
    accessorKey: "logoutTime",
    cell: ({ row }) => {
      const LogoutTime = row.original.logoutTime;

      // Create Date object and add 3 hours 30 minutes
      const date = new Date(LogoutTime);
      date.setHours(date.getHours() + 3);
      date.setMinutes(date.getMinutes() + 30);

      // Format the adjusted date
      const isoString = date.toISOString();
      const datePart = isoString.split("T")[0].replace(/-/g, "/");
      const timePart = isoString.split("T")[1].substring(0, 8);
      const datePersian = new Date(datePart).toLocaleDateString("fa-IR");
      return (
        <>
          <div className="w-full h-full flex justify-center items-center gap-2">
            <span>{toPersianDigits(timePart)}</span>
            {"-"}
            <span>{datePersian}</span>
          </div>
        </>
      );
    },
  },
];

import type { TableColumn } from "../../services/TablePdfDocumnet";
import type { AuthLog } from "../../services/authLog.service";
import { toPersianDigits } from "../../utils/numberConvert";

// Define the columns for your table in a simple accessor style
export const authLogPdfColumn: TableColumn<AuthLog>[] = [
  {
    header: "ردیف",
    key: "id",
    accessor: (row) => {
      console.log("Row ID:", row.id); // Debug log
      return toPersianDigits(row.id);
    },
  },
  {
    header: "نام و نام خانوادگی",
    key: "fullname",
    accessor: (row) => {
      console.log("Full row data:", row); // Debug log
      console.log("User object:", row.user); // Debug log
      const fullname = row.user?.fullname;
      console.log("Extracted fullname:", fullname); // Debug log
      return fullname || "—";
    },
  },
  {
    header: "نام کاربری",
    key: "username",
    accessor: (row) => {
      const username = row.user?.username;
      console.log("Extracted username:", username); // Debug log
      return username || "—";
    },
  },
  {
    header: "IP کاربر",
    key: "ip",
    accessor: (row) => row.ip || "—",
  },
  {
    header: "ساعت و تاریخ ورود",
    key: "loginTime",
    accessor: (row) => {
      if (!row.loginTime) return "—";

      try {
        const loginTime = new Date(row.loginTime);
        loginTime.setHours(loginTime.getHours() + 3);
        loginTime.setMinutes(loginTime.getMinutes() + 30);
        const isoString = loginTime.toISOString();
        const datePart = isoString.split("T")[0].replace(/-/g, "/");
        const timePart = isoString.split("T")[1].substring(0, 8);
        const datePersian = new Date(datePart).toLocaleDateString("fa-IR");
        return `${toPersianDigits(timePart)} - ${datePersian}`;
      } catch (error) {
        console.error("Error formatting login time:", error);
        return "—";
      }
    },
  },
  {
    header: "ساعت و تاریخ خروج",
    key: "logoutTime",
    accessor: (row) => {
      if (!row.logoutTime) return "—";

      try {
        const logoutTime = new Date(row.logoutTime);
        logoutTime.setHours(logoutTime.getHours() + 3);
        logoutTime.setMinutes(logoutTime.getMinutes() + 30);
        const isoString = logoutTime.toISOString();
        const datePart = isoString.split("T")[0].replace(/-/g, "/");
        const timePart = isoString.split("T")[1].substring(0, 8);
        const datePersian = new Date(datePart).toLocaleDateString("fa-IR");
        return `${toPersianDigits(timePart)} - ${datePersian}`;
      } catch (error) {
        console.error("Error formatting logout time:", error);
        return "—";
      }
    },
  },
];

export default authLogPdfColumn;

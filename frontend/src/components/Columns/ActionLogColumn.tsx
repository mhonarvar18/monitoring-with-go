import type { ColumnDef } from "@tanstack/react-table";
import type { ActionLog } from "../../services/actionLog.service";
import moment from "moment-jalaali";
import { toPersianDigits } from "../../utils/numberConvert";

const translateModel = (model) => {
  const translations = {
    Events: "پنل رویداد",
    Branch: "مدیریت شعب",
    User: "اطلاعات شخصی",
    PersonalSetting: "تنظیمات شخصی",
    UserSetting: "تنظیمات",
    Location: "مدیریت استان ها",
    Partition: "مدیریت پارتیشن",
    Zone: "مدیریت زون",
    ZoneType: "مدیریت نوع زون",
    Alarm: "مدیریت آلارم",
    AlarmCategory: "مدیریت دسته بندی آلارم",
    Employee: "مدیریت کارمندان",
    AppSetting: "تنظیمات سامانه",
  };
  return translations[model] || model; // Return the original value if no translation is found
};

const translateAction = (action) => {
  const translations = {
    CREATE: "ایجاد",
    CREATED: "ایجاد",
    UPDATED: "ویرایش",
    DELETED: "حذف",
    CONFIRMED: "تایید",
  };
  return translations[action] || action; // Return original value if no translation is found
};

export const actionLogColumn: ColumnDef<ActionLog>[] = [
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
  {
    header: "مدل",
    accessorKey: "model",
    cell: ({ getValue }) => {
      const translatedModel = translateModel(getValue());
      return <span>{translatedModel}</span>;
    },
  },
  // { header: "شناسه مدل", accessorKey: "model_id" },
  {
    header: "عملیات",
    accessorKey: "action",
    cell: ({ getValue }) => {
      const translatedAction = translateAction(getValue());
      return <span>{translatedAction}</span>;
    },
  },
  {
    header: "تاریخ",
    accessorKey: "createdAtDate", // Unique key for the date column
    cell: ({ row }) => {
      const formattedDate = new Date(row.original.createdAt).toLocaleDateString(
        "fa-IR"
      );
      return <span>{formattedDate}</span>;
    },
  },
  {
    header: "زمان",
    accessorKey: "createdAtTime", // Unique key for the time column
    cell: ({ row }) => {
      const timeWithOffset = moment(row.original.createdAt)
        .utcOffset("+03:30")
        .format("HH:mm");
      return <span>{toPersianDigits(timeWithOffset)}</span>;
    },
  },
  { header: "نام", accessorKey: "user.fullname" },
  {
    header: "شماره تماس",
    accessorKey: "user.phoneNumber",
    cell: ({ row }) => {
      const phoneNumber = row.original.user.phoneNumber;
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            {toPersianDigits(phoneNumber)}
          </div>
        </>
      );
    },
  },
];

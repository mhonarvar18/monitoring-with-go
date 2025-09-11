import moment from "moment-jalaali";
import { toPersianDigits } from "../../utils/numberConvert";
import { type ActionLog } from "../../services/actionLog.service";

const translateModel = (model: string) => {
  const translations: Record<string, string> = {
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
  return translations[model] || model;
};

const translateAction = (action: string) => {
  const translations: Record<string, string> = {
    CREATE: "ایجاد",
    CREATED: "ایجاد",
    UPDATED: "ویرایش",
    DELETED: "حذف",
    CONFIRMED: "تایید",
  };
  return translations[action] || action;
};

export const actionLogColumnsPdf = [
  // {
  //   header: "شناسه",
  //   key: "id",
  //   accessor: (row: ActionLog) => toPersianDigits(row.id),
  // },
  {
    header: "مدل",
    key: "model",
    accessor: (row: ActionLog) => translateModel(row.model),
  },
  // { header: "شناسه مدل", key: "model_id", accessor: row => row.model_id }, // Uncomment if you want this field
  {
    header: "عملیات",
    key: "action",
    accessor: (row: ActionLog) => translateAction(row.action),
  },
  {
    header: "تاریخ",
    key: "createdAtDate",
    accessor: (row: ActionLog) => 
      new Date(row.createdAt).toLocaleDateString("fa-IR"),
  },
  {
    header: "زمان",
    key: "createdAtTime",
    accessor: (row: ActionLog) =>
      toPersianDigits(moment(row.createdAt).utcOffset("+03:30").format("HH:mm")),
  },
  {
    header: "نام",
    key: "fullname",
    accessor: (row: ActionLog) => row.user?.fullname || "—",
  },
  {
    header: "شماره تماس",
    key: "phoneNumber",
    accessor: (row: ActionLog) => toPersianDigits(row.user?.phoneNumber ?? "—"),
  },
];

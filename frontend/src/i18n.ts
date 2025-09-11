// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fa: {
    translation: {
      nLogs: "لاگ",
      models: {
        User: "کاربر",
        UserSetting: "تنظیمات کاربر",
        PersonalSetting: "تنظیمات شخصی",
        Alarm: "آلارم",
        AlarmCategory: "دسته آلارم",
        Branch: "شعبه",
        Location: "مکان",
        Event: "رویداد",
        PanelType: "نوع پنل",
        Partition: "پارتیشن",
        Receiver: "گیرنده",
        Permission: "دسترسی",
        UserPermission: "دسترسی کاربر",
        Zone: "زون",
        ZoneType: "نوع زون",
        Employee: "مدیریت کارمندان",
        ActionLog: "لاگ عملیاتی",
        AppSetting: "تنظیمات برنامه",
        Events: "رویداد ها",
      },
      actions: {
        CREATED: "ایجاد شد",
        UPDATED: "ویرایش شد",
        DELETED: "حذف شد",
        CONFIRMED: "تأیید شد",
      },
      enums: {
        LocationType: {
          COUNTRY: "کشور",
          STATE: "استان",
          CITY: "شهر",
        },
        Position: {
          user: "کاربر",
          admin: "مدیر",
          manager: "مدیر",
        },
      },
      fields: {
        // برچسب‌های عمومی
        common: {
          // id: "شناسه",
          // model_id: "شناسه مدل",
          // userId: "شناسه کاربر",
          label: "برچسب",
          name: "نام",
          lastName: "نام خانوادگی",
          type: "نوع",
          version: "نسخه",
          // parentId: "شناسه والد",
          parent: "والد",
          // branchId: "شناسه شعبه",
          localId: "شماره آن از پنل",
          nationalCode: "کد ملی",
          fullname: "نام کامل",
          username: "نام کاربری",
          phoneNumber: "شماره تماس",
          createdAt: "تاریخ ایجاد",
          updatedAt: "تاریخ به‌روزرسانی",
          deletedAt: "تاریخ حذف",
          // zoneTypeId: "شناسه نوع زون",
          panelIp: "آی پی پنل",
          emergencyCall: "شماره تماس اضطراری",
          code: "کد",
          address: "آدرس",
          destinationPhoneNumber: "شماره تماس مقصد",
          location: "مکان",
          panelType: "نوع پنل",
          panelCode: "کد پنل",
          imgUrl: "آدرس عکس",
          receiver: "دریافت کننده",
          audioUrl: "آدرس فایل صوتی",
          alarmColor: "رنگ هشدار",
          mainPartition: "پارتیشین اصلی",
          fatherName: "نام پدر",
          nationalityCode: "کد ملی",
          ConfirmationTime: "زمان تاید",
          status: "وضعیت",
          avatarUrl: "آدرس آواتار",
          personalCode: "کد پرسنلی",
          key : "کلید",
          value : 'مقدار',
          model : "مدل",
          branch : "شعبه"
        },
        Location: {
          type: "@enums.LocationType",
        },
        Employee: {
          position: "@enums.Position",
        },
      },
    },
  },
  en: {
    translation: { models: {}, actions: {}, enums: {}, fields: { common: {} } },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fa",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

import type { IconType } from "react-icons";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { MdOutlineSpaceDashboard, MdOutlineSupportAgent } from "react-icons/md";
import { FiUsers, FiSettings } from "react-icons/fi";
import { LuFileCode2 } from "react-icons/lu";
import { GoHome } from "react-icons/go";
import { FaDownload, FaInfo } from "react-icons/fa6";
import { FcAbout } from "react-icons/fc";
import { CiCircleInfo } from "react-icons/ci";
import { FaInfoCircle } from "react-icons/fa";

export interface NavItem {
  label: string;
  path: string;
  icon?: IconType;
  permission?: string; // Permission key
  hidden?: boolean; // Optional: hide from UI
  badge?: string; // Optional: number or label
  children?: NavItem[]; // Submenu
}

export const sidebarNav: NavItem[] = [
  {
    label: "پاژونیک",
    path: "/pazhonic",
    icon: GoHome,
    permission: "events:read",
  },
  {
    label: "پنل رویدادها",
    path: "/events",
    icon: MdOutlineSpaceDashboard,
    permission: "events:read",
    children: [
      {
        label: "نقشه",
        path: "/maps",
        permission: "admin:settings",
        // badge: "1",
      },
      {
        label: "رویداد ها",
        path: "/events",
        permission: "admin:settings",
        // badge: "10",
      },
      {
        label: "آمار رویدادها",
        path: "/events-reports",
      },
    ],
  },
  {
    label: "مدیریت سامانه",
    path: "/admin",
    icon: HiOutlineShieldCheck,
    permission: "admin:access",
    children: [
      {
        label: "مدیریت شعب",
        path: "/branches",
        permission: "admin:roles",
      },
      {
        label: "مدیریت استان ها",
        path: "/locations",
        permission: "admin:settings",
      },

      {
        label: "مدیریت آلارم ها",
        path: "/alarms",
        permission: "admin:roles",
      },
      {
        label: "مدیریت دسته بندی آلارم ها",
        path: "/category-alarms",
        permission: "admin:roles",
      },
      {
        label: "مدیریت نوع زون ها",
        path: "/zone-types",
        permission: "admin:roles",
      },
      {
        label: "مدیریت انواع پنل ها",
        path: "/panel-types",
        permission: "admin:roles",
      },
    ],
  },
  {
    label: "کاربری",
    path: "/users",
    icon: FiUsers,
    permission: "users:read",
    children: [
      {
        label: "پروفایل",
        path: "/profile",
        permission: "admin:settings",
      },
      {
        label: "مدیریت رمز عبور کاربران",
        path: "/req-password",
        permission: "admin:settings",
      },
      {
        label: "مدیریت ثبت نام کاربران",
        path: "/req-registers",
        permission: "admin:settings",
      },
      {
        label: "مدیریت کاربران مانیتورینگ",
        path: "/users",
        permission: "admin:settings",
      },
    ],
  },
  {
    label: "لاگ ها",
    path: "/logs",
    icon: LuFileCode2,
    children: [
      {
        label: "لاگ ورود و خروج",
        path: "/auth-logs",
        permission: "support:access",
      },
      {
        label: "لاگ عملیاتی",
        path: "/action-logs",
        permission: "support:access",
      },
    ],
  },
  {
    label: "تنظیمات",
    path: "/settings",
    icon: FiSettings,
    children: [
      {
        label: "تنظیمات سامانه",
        path: "/app-settings",
        permission: "settings:read",
      },
      {
        label: "تنظیمات دوربین",
        path: "/cctv-settings",
        permission: "settings:read",
      },
    ],
  },
  {
    label: "پشتیبانی",
    path: "/support",
    icon: MdOutlineSupportAgent,
    permission: "support:access",
  },
  // {
  //   label: "درباره ما",
  //   path: "/about-us",
  //   icon: FaInfoCircle,
  //   // permission: "support:access",
  // },
  {
    label: "فایل های بک آپ",
    path: "/backup-files",
    icon: FaDownload,
  },
];

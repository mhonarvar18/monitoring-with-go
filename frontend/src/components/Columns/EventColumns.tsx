// src/components/Events/eventsColumns.tsx
import React from "react";
import type { ColumnDef as BaseColumnDef } from "@tanstack/react-table";
import type { Event as AppEvent } from "../../types/Event";
import moment from "moment-jalaali";
import Button from "../Button";
import { FaCirclePlus } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { toPersianDigits } from "../../utils/numberConvert";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { ConditionalRender } from "../../hooks/useHasPermission";

export type MyColumnDef<T> = BaseColumnDef<T> & {
  filterable?: boolean;
};

export const eventColumns = ({
  onCreate,
  currentPage,
  pageSize,
  totalRecords,
}: {
  onCreate: (row: AppEvent) => void;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
}): MyColumnDef<AppEvent>[] => [
  {
    header: "ردیف",
    id: "id",
    cell: ({ row }) => {
      const globalRowNumber =
        totalRecords - ((currentPage - 1) * pageSize + row.index);
      return <span>{toPersianDigits(globalRowNumber)}</span>;
    },
    size: 16,
  },
  {
    header: "تاریخ",
    accessorKey: "date",
    cell: ({ row }) => (
      <span>
        {toPersianDigits(
          moment(row.original?.date as string, "YYYY-MM-DD").format(
            "jYYYY/jMM/jDD"
          )
        )}
      </span>
    ),
    filterable: true,
    size: 30,
  },
  {
    header: "زمان",
    accessorKey: "time",
    cell: ({ getValue }) => {
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            <span>{toPersianDigits(getValue<any>())}</span>
          </div>
        </>
      );
    },
    size: 26,
    filterable: true,
  },
  {
    id: "province",
    header: "استان",
    cell: ({ row }) => {
      let stateNode: any = null;
      const loc = row.original?.branch?.location;
      if (!loc) {
        return <span></span>;
      }
      if (loc.type === "DISTRICT") {
        stateNode = loc.parent?.parent;
      } else {
        stateNode = loc.parent;
      }
      return <span>{stateNode?.type === "STATE" ? stateNode.label : ""}</span>;
    },
    size: 30,
    filterable: true,
  },
  {
    id: "city",
    header: "شهر",
    cell: ({ row }) => {
      let cityNode: any = null;
      const loc = row.original?.branch?.location;
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
    filterable: true,
  },
  {
    id: "district",
    header: "منطقه",
    cell: ({ row }) => {
      const districtNode = row.original?.branch?.location;
      return (
        <span>
          {districtNode?.type === "DISTRICT" ? districtNode.label : ""}
        </span>
      );
    },
    size: 30,
  },
  {
    header: "نام شعبه",
    accessorKey: "branchName",
    cell: ({ row }) => {
      const branchRowData = row.original;

      // Determine branchId from either possible location
      const branchId =
        row.original?.branchId ?? row.original?.branch?.id ?? null;
      const branch = row.original?.branch ?? null;

      const hasBranchId = branchId !== null && branchId !== undefined;

      if (hasBranchId && !branch) {
        // 1) Branch ID exists but branch object missing => deleted
        return (
          <div className="w-full h-full py-1">
            <div className="w-full h-full flex justify-center items-center rounded-2xl">
              <span className="text-nowrap text-center font-black text-red-600">
                شعبهء حذف شده
              </span>
            </div>
          </div>
        );
      }

      if (!hasBranchId && !branch) {
        // 2) No branch mapping yet => show create button
        return (
          <div className="w-full h-full flex justify-center items-center">
            <Button
              onClick={() => onCreate(branchRowData)}
              className="2xl:py-0 2xl:px-0 border-0"
              title="ایجاد ارتباط با شعبه"
            >
              <FaCirclePlus size={28} color="#3b82f6" />
            </Button>
          </div>
        );
      }

      if (hasBranchId && branch) {
        // 3) Properly linked => show branch name
        return (
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-nowrap text-center">
              {branch?.name ?? "نامشخص"}
            </span>
          </div>
        );
      }

      // Fallback (unexpected mixed state)
      return (
        <div className="w-full h-full flex justify-center items-center">
          <span className="text-nowrap text-center">نامشخص</span>
        </div>
      );
    },
    size: 60,
    filterable: true,
  },
  {
    header: "کد شعبه",
    accessorKey: "branchCode",
    cell: ({ getValue }) => {
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            <span>{toPersianDigits(getValue<any>())}</span>
          </div>
        </>
      );
    },
    size: 30,
  },
  {
    header: "IP / تلفن شعبه",
    accessorKey: "ip",
    cell: ({ getValue }) => {
      return (
        <>
          <div className="w-full h-full flex justify-center items-center">
            <span>{toPersianDigits(getValue<any>())}</span>
          </div>
        </>
      );
    },
    size: 40,
  },
  {
    id: "alarm",
    header: "رویداد",
    accessorKey: "alarm",
    cell: ({ row }) => {
      const alarmLabel = row.original?.alarm?.label?.trim() || "";
      const alarmCode = row.original?.alarm?.code || "Unknown";
      // const action = row.original?.action;
      const cellColor = row.original?.alarmColor;

      let displayValue = alarmLabel || alarmCode;
      // if (alarmLabel === "مسلح / غیر مسلح") {
      //   displayValue = action === "ARM" ? "مسلح" : "غیر مسلح";
      // }

      return (
        <span
          className="py-1 px-2 block w-full rounded-2xl text-center font-medium"
          style={{ backgroundColor: cellColor }}
        >
          {toPersianDigits(displayValue)}
        </span>
      );
    },
    size: 70,
    filterable: true,
  },
  {
    header: "پارتیشن",
    accessorKey: "partitionLabel",
    cell: ({ row }) => {
      const PartitionLabel = row.original.partition?.label;
      // console.log(PartitionLabel);
      const PartitionId = row.original.originalPartitionId;
      const originalPartitionId = PartitionId === "0" ? "" : PartitionId;
      // console.log(originalPartitionId);
      return (
        <span>
          {toPersianDigits(PartitionLabel) ||
            toPersianDigits(originalPartitionId)}
        </span>
      );
    },
    size: 50,
  },
  {
    header: "ورودی",
    accessorKey: "zoneLabel",
    cell: ({ row }) => {
      const ZoneLabel = row.original.zone?.label;
      const originalZoneId = row.original.originalZoneId;
      const zoneId = originalZoneId === "0" ? "" : originalZoneId;
      return (
        <span>{toPersianDigits(ZoneLabel) || toPersianDigits(zoneId)}</span>
      );
    },
    size: 50,
  },
  {
    header: "کاربر شعبه",
    accessorKey: "employee",
    cell: ({ row }) => {
      const lastName = row.original.employee?.lastName;
      const firstName = row.original.employee?.name;
      const fullName =
        firstName && lastName ? `${firstName} ${lastName}` : undefined;
      // console.log(fullName);
      const originalEmployeeId = row.original.originalEmployeeId;
      const EmployeeId = originalEmployeeId === "0" ? "" : originalEmployeeId;
      // console.log(originalEmployeeId || fullName)
      return <span>{fullName || toPersianDigits(EmployeeId)}</span>;
    },
    size: 50,
  },
  {
    header: "اطلاعات تکمیلی",
    accessorKey: "referenceId",
    cell: ({ getValue }) => <span>{toPersianDigits(getValue<string>())}</span>,
    size: 50,
  },
  {
    header: "تاییدیه",
    accessorKey: "confermationStatus",
    cell: ({ row, getValue, table }) => {
      const status = getValue<string>();
      const eventId = row.original?.id;
      const openConfirm = table.options.meta?.openConfirmationModal;

      if (status === "Unconfirmed") {
        return (
          <div className="w-full h-full flex justify-center items-center">
            <ConditionalRender permission="event:update">
              <Button
                onClick={() => openConfirm?.([String(eventId)])} // Pass as array for single selection
                className="bg-red-700 w-4 h-4 rounded-full border-0"
                data-tooltip-content="تایید نشده"
                data-tooltip-id="confermationStatus"
              />
            </ConditionalRender>
          </div>
        );
      }
      if (status === "Confirmed") {
        return (
          <>
            <div className="w-full h-full flex justify-center items-center">
              <Button
                className="bg-green-700 w-4 h-4 rounded-full border-0"
                data-tooltip-content="تایید شده"
                data-tooltip-id="confermationStatus"
              />
            </div>
          </>
        );
      }
      return null;
    },
    size: 30,
  },
  // {
  //   header: "عکس دوربین",
  //   accessorKey: "cameraImage",
  //   cell: ({ row }) => {
  //     const cameraImage = row.original?.cameraImage;
  //     if (!cameraImage) {
  //       return <span className="text-sm text-gray-500">بدون تصویر</span>;
  //     }
  //     return (
  //       <div className="w-full h-full flex justify-center items-center">
  //         <img
  //           src={cameraImage}
  //           alt="Camera"
  //           className="w-16 h-16 object-cover rounded-lg"
  //         />
  //       </div>
  //     );
  //   },
  // },
  {
    header: "توضیحات",
    size: 60,
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row.original?.description || "";
      // Trim description to 16 characters and add ellipsis if longer
      const displayText =
        description.length > 10
          ? description.substring(0, 10) + "..."
          : description;

      return (
        <div
          data-tooltip-id="description-tooltip"
          data-tooltip-content={description}
        >
          <span className="text-sm">{displayText}</span>
        </div>
      );
    },
  },
];

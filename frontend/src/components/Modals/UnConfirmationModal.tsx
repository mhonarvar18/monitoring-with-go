import Modal from "react-modal";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useEvents } from "../../hooks/useEvents";
import { useArmDisarmBranches } from "../../hooks/useArmDisarmEvents";
import { useAllEvents } from "../../hooks/Map/useAllEvents";
import { useAllArmDisarmBranches } from "../../hooks/Map/useAllArmDisarmBranches";
import {
  useConfirmEvents,
  useConfirmAllEvents,
} from "../../hooks/useConfirmEvents";
import EventTable from "../Table/EventTable";
import Pagination from "../Paginations/Paginations";
import Button from "../Button";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";

import type { EventData } from "../../services/events.service";
import type { BranchAll } from "../../types/BranchAll";
import { eventColumns as baseEventColumns } from "../Columns/EventUnConfirmationColumn";
import { pdfEventColumns } from "../Columns/PdfEventUnConfirmColumns";
import { branchColumn as baseBranchColumns } from "../Columns/BranchColumn";
import {
  mapColumnDefsToTableColumns,
  mapDataToPdfRows,
} from "../../utils/mapColumnDefsToTableColumns";
import { downloadTablePdf } from "../../services/pdfExport";
import { errorStyle, successStyle } from "../../types/stylesToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  locationId?: string | number | null;
  alarmCategoryId?: string | number | null;
  alarmLabel?: string;
  success?: () => void;
}

const UnConfirmationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  locationId,
  alarmCategoryId,
  alarmLabel = "",
  success,
}) => {
  const isArming = alarmLabel === "مسلح" || alarmLabel === "غیر مسلح";

  const [limit, setLimit] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const singleConfirm = useConfirmEvents();
  const batchConfirm = useConfirmAllEvents();

  // Conditional hooks - only one will actually fetch data
  const eventsHook = useEvents(
    page,
    limit,
    "Unconfirmed",
    locationId ?? undefined,
    alarmCategoryId ?? undefined,
    !isArming && isOpen // Only enabled when not arming and modal is open
  );

  const branchesHook = useArmDisarmBranches(
    locationId ?? 0,
    alarmLabel === "مسلح" ? "ARM" : "DISARM",
    page,
    limit,
    isArming && isOpen // Only enabled when arming and modal is open
  );

  // Get the appropriate data based on mode
  const data = isArming ? branchesHook.branches : eventsHook.events;
  const loading = isArming ? branchesHook.loading : eventsHook.loading;
  const totalPages = isArming ? branchesHook.totalPages : eventsHook.totalPages;
  const error = isArming ? branchesHook.error : eventsHook.error;
  const refetch = isArming ? branchesHook.refetch : eventsHook.refetch;
  const totalRecords = isArming
    ? branchesHook.totalRecords
    : eventsHook.totalRecords;

  // Export hooks - manual trigger only
  const allEventsHook = useAllEvents();
  const allBranchesHook = useAllArmDisarmBranches();

  // Table configuration
  const canSelect = !isArming;
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (isArming) return baseBranchColumns;

    const selectColumn: ColumnDef<EventData> = {
      id: "select",
      size: 20,
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    };

    return [selectColumn, ...baseEventColumns];
  }, [isArming]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: canSelect ? { rowSelection } : {},
    onRowSelectionChange: canSelect ? setRowSelection : undefined,
    enableRowSelection: canSelect,
    getRowId: (row: any) => String(row.id),
  });

  // Actions
  const handleSingleConfirm = useCallback(() => {
    const ids = Object.entries(rowSelection)
      .filter(([, sel]) => sel)
      .map(([id]) => id);
    if (!ids.length) return;

    singleConfirm.mutate(ids, {
      onSuccess: () => {
        toast.success(`تعداد ${ids.length} رویداد تایید شد.`, {
          style: successStyle,
        });
        refetch();
        setRowSelection({});
        success?.();
      },
      onError: () =>
        toast.error("خطا در تایید رویدادها", {
          style: errorStyle,
        }),
    });
  }, [rowSelection, refetch, singleConfirm, success]);

  const handleBatchConfirm = useCallback(() => {
    if (alarmCategoryId == null || locationId == null) return;

    batchConfirm.mutate(
      { alarmCategoryId, stateId: locationId },
      {
        onSuccess: () => {
          toast.success(`تمام رویدادها تایید شدند.`, {
            style: successStyle,
          });
          refetch();
          success?.();
          onClose();
        },
        onError: () =>
          toast.error("خطا در تایید همه رویدادها", {
            style: errorStyle,
          }),
      }
    );
  }, [alarmCategoryId, locationId, refetch, batchConfirm, success, onClose]);

  const handleExportAll = useCallback(async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("در حال آماده‌سازی فایل...", {
        style: { direction: "rtl", fontFamily: "iransans", fontSize: 18 },
      });

      if (isArming) {
        // Branch export
        const dataForPdf = await allBranchesHook.fetchAllBranches(
          locationId!,
          alarmLabel === "مسلح" ? "ARM" : "DISARM"
        );

        const colDefs = baseBranchColumns as ColumnDef<BranchAll, any>[];
        const pdfCols = mapColumnDefsToTableColumns(colDefs);
        const pdfRows = mapDataToPdfRows(dataForPdf, pdfCols);

        await downloadTablePdf({
          columns: pdfCols,
          data: pdfRows,
          title: "لیست شعب",
          iconUrl: "/kesh.png",
          footerCenterText: "تنظیم و توسعه توسط شرکت پاژالکترونیک",
          signText: "امضا: _____________",
          fileName: "branches.pdf",
        });
      } else {
        // 1) بگیر
        const raw = await allEventsHook.fetchAllEvents(
          totalRecords,
          "Unconfirmed",
          locationId ?? undefined,
          alarmCategoryId ?? undefined
        );

        // 2) ستون‌ها: مطمئن باش ستون تاریخ وجود دارد و accessor دارد
        const pdfCols = pdfEventColumns;

        // داده‌ها را با ستون‌ها محاسبه می‌کنی (فلت‌شده و رشته)
        const pdfRows = raw.map((r, idx) =>
          pdfCols.reduce((acc, c) => {
            acc[c.key] =
              typeof c.accessor === "function"
                ? c.accessor(r, idx)
                : (r as any)[c.key];
            return acc;
          }, {} as Record<string, any>)
        );

        // ⚠️ برای مرحله‌ی رندر، accessorها را حذف کن تا دوباره اجرا نشوند
        const colsForRender = pdfCols.map(({ header, key }) => ({
          header,
          key,
        }));

        console.log("[PDF] first raw row:", raw[0]);
        console.log("[PDF] first mapped row:", pdfRows[0]); // باید مقادیر نهایی (رشته) را ببینی

        // 5) خروجی
        const title =
          alarmCategoryId != null
            ? `رویدادهای (${alarmLabel}) تایید نشده`
            : "آلارم های تایید نشده";

        await downloadTablePdf({
          columns: colsForRender,
          data: pdfRows,
          title,
          iconUrl: "/kesh.png",
          footerCenterText: "تنظیم و توسعه توسط شرکت پاژالکترونیک پاسارگاد",
          signText: ":امضا",
          fileName: `${title}.pdf`,
        });
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("فایل PDF با موفقیت دانلود شد", { style: successStyle });
    } catch (err: any) {
      toast.error("خطا در تولید PDF: " + err.message, {
        style: { direction: "rtl" },
      });
    }
  }, [
    isArming,
    locationId,
    alarmLabel,
    totalRecords,
    alarmCategoryId,
    allBranchesHook,
    allEventsHook,
    baseBranchColumns,
    pdfEventColumns,
  ]);

  // Reset row selection when switching modes
  useEffect(() => {
    setRowSelection({});
  }, [isArming]);

  // Reset pagination when modal opens
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setRowSelection({});
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-[15px] 2xl:pt-3 px-3 w-[76%] h-[76%] font-[iransans]"
      overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      {!error && (
        <div
          className="w-full flex h-full flex-col justify-between items-center gap-2"
          dir="rtl"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between py-3">
            <h1 className="text-2xl font-semibold">
              {alarmLabel || "آلارم های تایید نشده"}
            </h1>
            <Button
              onClick={handleExportAll}
              className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center gap-2"
              disabled={
                !data ||
                data.length === 0 ||
                allEventsHook.loading ||
                allBranchesHook.loading
              }
            >
              <span>
                {allEventsHook.loading || allBranchesHook.loading
                  ? "در حال آماده‌سازی..."
                  : "دریافت فایل"}
              </span>
              <FiDownload size={20} />
            </Button>
          </div>

          {/* Table */}
          <div className="w-full h-full flex flex-col">
            <EventTable
              columns={columns}
              table={table}
              data={data || []}
              isLoading={loading}
              bodyHeight="max-h-[54vh]"
            />
          </div>

          {/* Footer */}
          <div className="w-full flex justify-between items-center pb-4">
            <div className="w-1/2 flex items-center gap-2">
              <Button onClick={onClose} className="py-2 px-4 border-[#F2485D]">
                <span className="text-[#F2485D]">انصراف</span>
              </Button>

              {canSelect && (
                <>
                  <Button
                    onClick={handleSingleConfirm}
                    disabled={
                      singleConfirm.isPending ||
                      Object.keys(rowSelection).length === 0
                    }
                    className="bg-btns py-2 px-4 text-white border-[#09a1a4]"
                  >
                    {singleConfirm.isPending ? "درحال تایید..." : "تایید"}
                  </Button>
                  {alarmCategoryId != null && (
                    <Button
                      onClick={handleBatchConfirm}
                      disabled={batchConfirm.isPending}
                      className="bg-btns py-2 px-4 text-white border-[#09a1a4]"
                    >
                      {batchConfirm.isPending ? "درحال ارسال…" : "تایید همه"}
                    </Button>
                  )}
                </>
              )}
            </div>

            <Pagination
              currentPage={page}
              classNames="w-1/2 px-0 py-0"
              rowPageClassNames="hidden"
              pageSize={limit}
              totalItems={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(sz) => {
                setLimit(sz);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">خطا در بارگذاری داده‌ها</p>
            <Button onClick={() => { void refetch(); }} className="bg-btns py-2 px-4 text-white">
              تلاش مجدد
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UnConfirmationModal;

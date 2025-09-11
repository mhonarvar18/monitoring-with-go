import ReactModal from "react-modal";
import Button from "../Button";
import DateFilterDetail from "./components/DateFiltersDetail";
import AlarmFiltersDetail from "./components/AlarmFiltersDetail";
import BranchFiltersDetail from "./components/BranchFiltersDetail";
import ProvinceCityFiltersDetail from "./components/ProvinceFiltersDetail";
import Accordion from "../Accordion";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  convertFiltersToApi,
  getActiveFilterChips,
} from "../../utils/convertFilterSocket";
import { toPersianDigits } from "../../utils/numberConvert";
import { IoMdClose } from "react-icons/io";
import { getFilterLabel } from "../../utils/filterLabels";
import { fetchAllEvents } from "../../services/events.service";
import { downloadTablePdf } from "../../services/pdfExport";
import { pdfEventsColumns } from "../Columns/PdfEventsColumns";
import { downloadTableExcel } from "../../services/downloadTableExcel.service";

ReactModal.setAppElement("#root");

const limitOptions = [
  { label: "همه", value: -1 },
  { label: "6", value: 6 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "150", value: 150 },
  { label: "200", value: 200 },
  { label: "300", value: 300 },
];

type IdLike = { id: string | number; label?: string } | string | number | null;

interface FilterState {
  // canonical, flat time/date shape (Gregorian "YYYY-MM-DD" + "HH:mm")
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;

  // entity filters may be object (id,label) or raw id
  alarmCategoryId?: IdLike;
  branchId?: IdLike;
  locationId?: IdLike;

  // NEW: export limit (-1 means "all")
  exportLimit?: number;
}

interface EventReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters?: Record<string, any>;
  setActiveFilters?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const filterItems = [
  {
    key: "dateRange",
    title: "بازه زمانی",
    type: "date-range",
    component: DateFilterDetail,
  },
  {
    key: "alarmCategoryId",
    title: "نوع دسته بندی رویداد",
    type: "select",
    component: AlarmFiltersDetail,
  },
  {
    key: "branchId",
    title: "شعبه",
    type: "search",
    component: BranchFiltersDetail,
  },
  {
    key: "locationId",
    title: "موقعیت مکانی",
    type: "select",
    component: ProvinceCityFiltersDetail,
  },
];

const toIdU = (value?: IdLike | null): string | number | undefined => {
    const id = toId(value as IdLike);
    return id == null ? undefined : id;
  };

function toId(value: IdLike): string | number | null | undefined {
  if (value == null) return value as null | undefined;
  if (typeof value === "object") return (value as any).id ?? null;
  return value as string | number;
}
function isEmpty(v: any) {
  if (v == null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (typeof v === "object") return !("id" in v) && Object.keys(v).length === 0;
  return false;
}
function cleanFilters(state: FilterState): FilterState {
  const cleaned: FilterState = {};
  (Object.keys(state) as (keyof FilterState)[]).forEach((k) => {
    const v = state[k];
    if (
      k === "startDate" ||
      k === "endDate" ||
      k === "startTime" ||
      k === "endTime"
    ) {
      if (v === null || (typeof v === "string" && v.trim() !== ""))
        cleaned[k] = v as any;
      return;
    }
    if (!isEmpty(v)) cleaned[k] = v as any;
  });
  return cleaned;
}
function buildApiFilters(state: FilterState): Record<string, any> {
  const s = cleanFilters(state);
  
  const api: Record<string, any> = {
    startDate: s.startDate ?? null,
    endDate: s.endDate ?? null,
    startTime: s.startTime ?? null,
    endTime: s.endTime ?? null,
    alarmCategoryId: toIdU(s.alarmCategoryId),
    branchId: toIdU(s.branchId),
    locationId: toIdU(s.locationId),
  };
  return convertFiltersToApi(api);
}
function buildExportFilters(state: FilterState) {
  const s = cleanFilters(state);
  return {
    alarmCategoryId: toIdU(s.alarmCategoryId),
    locationId: toIdU(s.locationId),
    branchId: toIdU(s.branchId),
    startDate: s.startDate ?? undefined,
    endDate: s.endDate ?? undefined,
    startTime: s.startTime ?? undefined,
    endTime: s.endTime ?? undefined,
    limit: typeof s.exportLimit === "number" ? s.exportLimit : undefined,
  };
}

function getPdfColumns(columnsConfig: { header: string; key: string }[]) {
  return columnsConfig.map((col) => ({ header: col.header, key: col.key }));
}
function sanitizeCell(v: any): string {
  if (v == null) return "—";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    return String(v);
  if (typeof v === "object") {
    if (typeof (v as any).label === "string") return (v as any).label;
    if (typeof (v as any).name === "string") return (v as any).name;
    if (typeof (v as any).title === "string") return (v as any).title;
    if ((v as any).code != null && (v as any).protocol != null)
      return `${(v as any).code} / ${(v as any).protocol}`;
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}
function getPdfRows(
  events: any[],
  columnsConfig: { key: string; accessor?: (row: any, idx: number) => any }[]
) {
  return events.map((row, idx) => {
    const flatRow: Record<string, string> = {};
    for (const col of columnsConfig) {
      const raw =
        typeof col.accessor === "function"
          ? col.accessor(row, idx)
          : row[col.key];
      flatRow[col.key] = sanitizeCell(raw);
    }
    return flatRow;
  });
}

const EventReportModal: React.FC<EventReportModalProps> = ({
  isOpen,
  onClose,
  activeFilters,
  setActiveFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(
    (activeFilters as FilterState) || { exportLimit: -1 }
  );
  const [openAccordionKey, setOpenAccordionKey] = useState<string | null>(null);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingExcelExport, setLoadingExcelExport] = useState(false);

  useEffect(() => {
    if (activeFilters) {
      setLocalFilters((prev) => ({
        exportLimit: prev.exportLimit ?? -1,
        ...(activeFilters as FilterState),
      }));
    }
  }, [activeFilters]);

  const renderFilterComponent = (item: any) => {
    const Component = item.component;
    if (!Component) return null;
    return (
      <div className="w-full px-2 mt-2">
        <Component
          value={localFilters as any}
          onChange={(patch: Record<string, any>) =>
            setLocalFilters((prev) => ({ ...prev, ...patch }))
          }
        />
      </div>
    );
  };

  const flatFilters = useMemo(() => cleanFilters(localFilters), [localFilters]);
  const filters = useMemo(() => buildApiFilters(flatFilters), [flatFilters]);

  const handleRemoveChip = (removeKey: string) => {
    const dateKeys = new Set([
      "dateRange",
      "startDate",
      "endDate",
      "startTime",
      "endTime",
      "timeRange",
    ]);
    setLocalFilters((prev) => {
      const updated = { ...prev };
      if (dateKeys.has(removeKey)) {
        delete updated.startDate;
        delete updated.endDate;
        delete updated.startTime;
        delete updated.endTime;
      } else {
        delete (updated as any)[removeKey];
      }
      return updated;
    });
    if (setActiveFilters) {
      setActiveFilters((prev) => {
        const updated = { ...(prev as FilterState) };
        if (dateKeys.has(removeKey)) {
          delete updated.startDate;
          delete updated.endDate;
          delete updated.startTime;
          delete updated.endTime;
        } else {
          delete (updated as any)[removeKey];
        }
        return updated as any;
      });
    }
  };

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        className="bg-white rounded-[15px] py-5 px-3 min-w-[38%] h-auto font-[iransans] rtl outline-none"
      >
        <div
          className="w-full h-full flex flex-col justify-between items-center gap-2"
          dir="rtl"
        >
          <h2 className="w-full h-fit text-right text-xl font-semibold">
            دریافت فایل رویداد ها
          </h2>
          <hr className="w-full" />

          {/* Active chips */}
          <div className="w-full h-auto flex justify-start items-center gap-2 flex-wrap">
            {getActiveFilterChips(flatFilters as any, getFilterLabel).map(
              ({ key, label }: any) => (
                <Button
                  key={key}
                  className="bg-transparent border border-[#09a1a4] text-[#09a1a4] 2xl:py-0 h-10 2xl:px-2 flex justify-center items-center gap-2"
                  onClick={() => handleRemoveChip(key)}
                >
                  <span>{toPersianDigits(label)}</span>
                  <span>
                    <IoMdClose size={24} />
                  </span>
                </Button>
              )
            )}
          </div>

          {/* Filter accordions */}
          <div className="w-full grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
            {filterItems.map((item) => (
              <Accordion
                key={item.key}
                title={item.title}
                className="w-full border border-gray-400 rounded-lg"
                isOpen={openAccordionKey === item.key}
                onToggle={(open) => setOpenAccordionKey(open ? item.key : null)}
              >
                {renderFilterComponent(item)}
              </Accordion>
            ))}

            {/* NEW: Export limit selector */}
            <Accordion
              key="exportLimit"
              title="تعداد ردیف‌ها"
              className="w-full col-span-2 border border-gray-400 rounded-lg"
              isOpen={openAccordionKey === "exportLimit"}
              onToggle={(open) =>
                setOpenAccordionKey(open ? "exportLimit" : null)
              }
            >
              <div className="w-full px-2 mt-2 mb-4">
                <div className="w-full bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    تعداد ردیف برای خروجی
                  </label>
                  <select
                    value={localFilters.exportLimit ?? -1}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        exportLimit: Number(e.target.value),
                      }))
                    }
                    className="w-full border-2 border-gray-200 focus:border-[#09A1A4] rounded-lg p-3 outline-none transition-colors duration-200 bg-gray-50 focus:bg-white font-[iransans]"
                  >
                    {limitOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="font-[iransans]"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    «همه» یعنی دریافت کل صفحات. سایر گزینه‌ها یعنی حداکثر این
                    تعداد ردیف.
                  </p>
                </div>
              </div>
            </Accordion>

            {/* Apply Filters */}
            <Button
              onClick={() => {
                const cleaned = cleanFilters(localFilters);
                if (setActiveFilters) setActiveFilters(cleaned as any);
                setLocalFilters(cleaned);
              }}
              className="col-span-2 py-3 border-[#09a1a4] text-[#09a1a4] hover:bg-btns hover:text-white transition-all duration-300"
            >
              اعمال فیلتر
            </Button>
          </div>

          <hr className="w-full" />

          {/* Actions */}
          <div className="w-full h-fit flex justify-center items-center gap-2">
            {/* PDF */}
            <Button
              className="w-1/3 bg-btns py-3 text-white"
              disabled={loadingExport}
              onClick={async () => {
                setLoadingExport(true);
                try {
                  const exportFilters = buildExportFilters(localFilters);
                  const events = await fetchAllEvents(exportFilters);
                  const columns = getPdfColumns(pdfEventsColumns as any);
                  const processedRows = getPdfRows(
                    events,
                    pdfEventsColumns as any
                  );

                  await downloadTablePdf({
                    columns,
                    data: processedRows,
                    title: "رویدادهای ثبت شده",
                    iconUrl: "/kesh.png",
                    footerCenterText: "تنظیم و توسعه توسط شرکت پاژالکترونیک",
                    signText: ":امضا",
                    fileName: "events.pdf",
                  });
                } catch (err) {
                  alert("خطا در دریافت داده‌ها");
                  console.error(err);
                }
                setLoadingExport(false);
              }}
            >
              {loadingExport ? "در حال دریافت..." : "دریافت بصورت PDF"}
            </Button>

            {/* Excel */}
            <Button
              className="w-1/3 bg-btns py-3 text-white"
              disabled={loadingExcelExport}
              onClick={async () => {
                setLoadingExcelExport(true);
                try {
                  const exportFilters = buildExportFilters(localFilters);
                  const events = await fetchAllEvents(exportFilters);
                  const columns = getPdfColumns(pdfEventsColumns as any);
                  const processedRows = getPdfRows(
                    events,
                    pdfEventsColumns as any
                  );

                  downloadTableExcel({
                    columns,
                    data: processedRows,
                    fileName: "events.xlsx",
                  });
                } catch (err) {
                  console.error(err);
                }
                setLoadingExcelExport(false);
              }}
            >
              {loadingExcelExport ? "در حال دریافت..." : "دریافت بصورت Excel"}
            </Button>

            {/* Cancel */}
            <Button
              onClick={onClose}
              className="w-1/3 bg-transparent py-3 border-red-600 text-red-600"
            >
              انصراف
            </Button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default EventReportModal;

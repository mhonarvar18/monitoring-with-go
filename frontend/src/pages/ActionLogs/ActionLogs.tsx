import React, { useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useInfiniteActionLogs } from "../../hooks/useActionLog";
import type { ActionLogsByDate } from "../../services/actionLog.service";
import Button from "../../components/Button";
import ExportFileModal from "../../components/Modals/ExportFileModal";
import { actionLogColumnsPdf } from "../../components/Columns/PdfActionLogColumn";
import DateGroup from "../../components/DataGroup/DataGroup";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { localizeValue } from "../../utils/localizeDate&colors";

// ---------------- i18n helpers (unchanged) ----------------
const toFaModel = (t: TFunction, model: string) => t(`models.${model}`, model);

const toFaAction = (t: TFunction, action: string) =>
  t(`actions.${action}`, action);

const fieldLabel = (t: TFunction, model: string, key: string) =>
  t(`fields.${model}.${key}`, t(`fields.common.${key}`, key));

const fieldValueWithEnum = (
  t: TFunction,
  model: string,
  key: string,
  value: any
) => {
  const marker = t(`fields.${model}.${key}`, { defaultValue: "" });
  if (typeof marker === "string" && marker.startsWith("@enums.")) {
    const enumName = marker.replace("@enums.", "");
    return t(`enums.${enumName}.${String(value)}`, String(value));
  }
  return value;
};

const translateKv = (t: TFunction, model: string, obj: any): any => {
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map((it) => translateKv(t, model, it));
  if (typeof obj !== "object") return localizeValue(obj);

  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    const label = fieldLabel(t, model, k);
    let val: any = v;

    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nestedModel = k === "parent" ? "Location" : model;
      val = translateKv(t, nestedModel, v);
    } else if (Array.isArray(v)) {
      val = v.map((it) =>
        typeof it === "object" ? translateKv(t, model, it) : localizeValue(it)
      );
    } else {
      val = fieldValueWithEnum(t, model, k, v);
      val = localizeValue(val);
    }

    out[label] = val;
  }
  return out;
};

const localizeLog = (t: TFunction, log: any) => {
  const modelName = toFaModel(t, log.model);
  const actionLabel = toFaAction(t, log.action);
  const before_i18n = translateKv(t, log.model, log.changedFields?.before);
  const after_i18n = translateKv(t, log.model, log.changedFields?.after);

  return {
    ...log,
    modelName,
    actionLabel,
    changedFields_i18n: {
      ...(before_i18n ? { before: before_i18n } : {}),
      ...(after_i18n ? { after: after_i18n } : {}),
    },
  };
};

// ---------------- Component ----------------
const ActionLogs: React.FC = () => {
  const [localizedLogsByDate, setLocalizedLogsByDate] = useState<
    ActionLogsByDate[]
  >([]);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [openDate, setOpenDate] = useState<string | null>(null);

  const limit = 50; // Start with reasonable limit

  // Use the new infinite scroll hook
  const {
    allLogsByDate,
    loading,
    error,
    hasMore,
    initialLoad,
    loadNextPage,
    loadAllData,
  } = useInfiniteActionLogs(limit);

  const { t } = useTranslation();

  // Localize logs whenever allLogsByDate changes
  useEffect(() => {
    if (allLogsByDate && allLogsByDate.length > 0) {
      const localized = allLogsByDate.map((dateGroup) => ({
        ...dateGroup,
        logs: dateGroup.logs.map((log: any) => localizeLog(t, log)),
      }));
      setLocalizedLogsByDate(localized);
    }
  }, [allLogsByDate, t]);

  // Infinite scroll observer
  useEffect(() => {
    if (!initialLoad || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading before user reaches the bottom
      }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loading, loadNextPage, initialLoad]);

  // Export handlers
  const handlePdfExport = async (): Promise<any[]> => {
    setIsExporting(true);
    try {
      const allData = await loadAllData();
      return allData.map((log: any) => localizeLog(t, log));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExcelExport = async (): Promise<any[]> => {
    setIsExporting(true);
    try {
      const allData = await loadAllData();
      return allData.map((log: any) => localizeLog(t, log));
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {t("retry", "تلاش مجدد")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex flex-col justify-start items-center bg-white rounded-2xl">
            {/* Header */}
            <div className="w-full">
              <div className="w-full flex items-center justify-between px-6 py-3">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {t("models.ActionLog", "لاگ های عملیاتی")}
                </h1>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-btns h-10 px-4 text-white border-0 flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    onClick={() => setOpenExportModal(true)}
                    disabled={isExporting}
                  >
                    <span>
                      {isExporting
                        ? t("exporting", "در حال آماده سازی...")
                        : t("download", "دریافت فایل")}
                    </span>
                    <FiDownload size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="w-full h-full flex flex-col">
              <div className="w-full flex-1 overflow-y-auto max-h-[90%]">
                <div className="w-full px-2">
                  {!initialLoad && loading ? (
                    // Initial loading
                    <div className="w-full flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 ml-3" />
                      <span className="text-gray-500">
                        {t("loading", "بارگذاری...")}
                      </span>
                    </div>
                  ) : localizedLogsByDate.length === 0 ? (
                    // No data after initial load
                    <div className="w-full text-center py-8 text-gray-500">
                      <p>{t("noLogs", "هیچ لاگی یافت نشد")}</p>
                    </div>
                  ) : (
                    <>
                      {/* Display logs */}
                      <div className="w-full">
                        {localizedLogsByDate.map((dateGroup, index) => (
                          <DateGroup
                            key={dateGroup.date}
                            dateGroup={dateGroup}
                            isLast={index === localizedLogsByDate.length - 1}
                            activeDate={openDate}
                            onToggle={(date) =>
                              setOpenDate((prev) =>
                                prev === date ? null : date
                              )
                            }
                          />
                        ))}
                      </div>

                      {/* Loading more indicator */}
                      {loading && hasMore && (
                        <div className="w-full flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 ml-3" />
                          <span className="text-gray-500">
                            {t("loadingMore", "بارگذاری بیشتر...")}
                          </span>
                        </div>
                      )}

                      {/* End of data indicator */}
                      {!hasMore && localizedLogsByDate.length > 0 && (
                        <div className="w-full text-center py-4 text-gray-400 text-sm">
                          {t("endOfData", "پایان داده‌ها")}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Sentinel for infinite scroll - only show if we have more data */}
                {hasMore && <div ref={observerTarget} className="h-1" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {openExportModal && (
        <ExportFileModal
          isOpen
          onClose={() => setOpenExportModal(false)}
          onPdfExport={handlePdfExport}
          onExcelExport={handleExcelExport}
          pdfColumns={actionLogColumnsPdf}
          pdfTitle={t("models.ActionLog", "لاگ های عملیاتی")}
          iconUrl="/kesh.png"
          // loading={isExporting}
        />
      )}
    </>
  );
};

export default ActionLogs;

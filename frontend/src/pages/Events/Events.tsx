import { useEffect, useState, useMemo } from "react";
import EventTable from "../../components/Table/EventTable";
import Pagination from "../../components/Paginations/Paginations";
import { useEventsSocket } from "../../hooks/useEventsSocket";
import { refreshMap } from "../../lib/socket";
import Button from "../../components/Button";
import { FiSettings } from "react-icons/fi";
import type { MyColumnDef } from "../../components/Columns/EventColumns";
import type { Event as AppEvent } from "../../types/Event";
import InActiveBranchModal from "../../components/Modals/InactiveBranchModal";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import { getActiveFilterChips } from "../../utils/convertFilterSocket";
import { useConfirmEvents } from "../../hooks/useConfirmEvents";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import SettingColumnDrawer from "../../components/SettingColumnDrawer";
import { useEventColumnSetting } from "../../hooks/useEventColumnsSetting";
import { errorStyle, successStyle } from "../../types/stylesToast";
import { LuFilter } from "react-icons/lu";
import FilterEventDrawer from "../../components/FilterEventDrawer";
import { toPersianDigits } from "../../utils/numberConvert";
import { IoMdClose } from "react-icons/io";
import type { BranchInput } from "../../services/branchCrud.service";
import FormModal from "../../components/Modals/FormModal";
import { branchSchema } from "../../formSchema/branchSchema";
import { usePanelTypeCrud } from "../../hooks/usePanelTypeCrud";
import EventReportModal from "../../components/Modals/EventReportModal";
import { FaDownload } from "react-icons/fa6";
import { useSocketLifecycle } from "../../hooks/EventHook/useSocketLifycycle";
import { usePaginationState } from "../../hooks/EventHook/usePaginationState";
import { useFilters } from "../../hooks/EventHook/useFilters";
import { useBranchForm } from "../../hooks/EventHook/useBranchForm";
import { useEventColumns } from "../../hooks/EventHook/useEventColumns";

type EnrichedEvent = AppEvent & { alarmColor: string; audioUrl: string | null };

const isIPv4 = (v: string) => /^\d{1,3}(\.\d{1,3}){3}$/.test(v);
const isDigits = (v: string) => /^\d+$/.test(v);

const Events: React.FC = () => {
  useSocketLifecycle();

  const { page, setPage, limit, setLimit } = usePaginationState();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterModalColumn, setFilterModalColumn] =
    useState<MyColumnDef<EnrichedEvent> | null>(null);
  const [isInactiveModalOpen, setInactiveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [isColumnDrawerOpen, setColumnDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isReportOpen, setReportOpen] = useState(false);

  const {
    activeFilters,
    setActiveFilters,
    flatFilters,
    apiFilters,
    getFilterLabel,
    removeFilter,
    clearAllFilters,
    activeFiltersCount,
    filterChips,
    hasActiveFilters,
  } = useFilters();

  const { data: settings } = useEventColumnSetting();
  const { mutateAsync: confirmEvents, isPending: confirming } =
    useConfirmEvents();

  const {
    data: events,
    totalPages,
    loading,
    totalRecords,
  } = useEventsSocket({
    page,
    limit,
    filters: apiFilters,
    refreshKey,
  });

  // Panel type options for dynamic schema
  const { data: panelTypes, refetch: refetchPanelTypes } = usePanelTypeCrud(
    1,
    100
  );
  const panelTypeOptions = useMemo(
    () => (panelTypes ?? []).map((pt) => ({ label: pt.name, value: pt.id })),
    [panelTypes]
  );

  // Branch form orchestrator
  const {
    isOpen: isFormOpen,
    setOpen: setFormOpen,
    formKey,
    editingBranch,
    openWithPrefill,
    handleSubmit,
  } = useBranchForm(() => setRefreshKey((k) => k + 1));

  useEffect(() => {
    if (isFormOpen) refetchPanelTypes();
  }, [isFormOpen, refetchPanelTypes]);

  const columns = useEventColumns(
    settings,
    { page, limit, totalRecords },
    (eventRow: EnrichedEvent) => {
      const ipValue = eventRow.ip || "";
      const prefill: BranchInput = {
        name: "",
        locationId: null,
        code: null,
        panelIp: isIPv4(ipValue) ? ipValue : undefined,
        phoneNumber:
          !isIPv4(ipValue) && isDigits(ipValue) ? ipValue : undefined,
      };
      openWithPrefill(prefill);
    }
  );

  const dynamicBranchSchema = useMemo(
    () =>
      branchSchema(!!editingBranch).map((f) =>
        f.name === "panelTypeId" ? { ...f, options: panelTypeOptions } : f
      ),
    [editingBranch, panelTypeOptions]
  );

  const onConfirm = async () => {
    try {
      await confirmEvents(selectedEventIds);
      toast.success("رویداد(ها) تایید شد!", { style: successStyle });
      refreshMap();
      setRefreshKey((k) => k + 1);
    } catch {
      toast.error("تایید با خطا مواجه شد.", { style: errorStyle });
    } finally {
      setConfirmModalOpen(false);
    }
  };

  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-2xl">
            {/* Header */}
            <div className="w-full">
              <div className="w-full flex items-center justify-between px-6 py-3">
                <div className="flex flew-nowrap gap-1 flex-1">
                  {filterChips.map(({ key, label }) => (
                    <Button
                      key={key}
                      className="bg-transparent border border-[#09a1a4] text-[#09a1a4] 2xl:py-0 h-10 2xl:px-2 flex justify-center items-center gap-2"
                      onClick={() => removeFilter(key)}
                    >
                      <span>{toPersianDigits(label)}</span>
                      <span>
                        <IoMdClose size={24} />
                      </span>
                    </Button>
                  ))}

                  {!hasActiveFilters && (
                    <h1 className="text-2xl font-semibold">همه رویدادها</h1>
                  )}
                </div>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    onClick={() => setInactiveModalOpen(true)}
                    className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center"
                  >
                    لیست شعبات غیرفعال
                  </Button>
                  <Button
                    onClick={() => setReportOpen(true)}
                    className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center gap-2"
                  >
                    <FaDownload size={20} /> دریافت فایل
                  </Button>
                  <Button
                    onClick={() => setFilterDrawerOpen(true)}
                    className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center gap-2"
                  >
                    <LuFilter size={22} /> <span>فیلتر</span>
                  </Button>
                  <Button
                    onClick={() => setColumnDrawerOpen(true)}
                    className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center"
                  >
                    <FiSettings size={22} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="w-full h-full flex flex-col">
              <EventTable<EnrichedEvent>
                columns={columns}
                data={(events as EnrichedEvent[]) ?? []}
                isLoading={!!loading}
                bodyHeight="max-h-[74vh]"
                onHeaderClick={(column) => setFilterModalColumn(column)}
                meta={{
                  openConfirmationModal: (eventIds: string[]) => {
                    setSelectedEventIds(eventIds);
                    setConfirmModalOpen(true);
                  },
                }}
              />
            </div>

            {/* Footer */}
            <div className="w-full">
              {/* NOTE: If Pagination expects total items, use totalRecords instead of totalPages */}
              <Pagination
                currentPage={page}
                pageSize={limit}
                totalItems={totalPages}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(sz) => {
                  setLimit(sz);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {isInactiveModalOpen && (
        <InActiveBranchModal
          isOpen
          onClose={() => setInactiveModalOpen(false)}
          className="bg-white rounded-[15px] py-4 px-3 w-[75%] h-[80%] max-h-[80%] font-[iransans] outline-none"
          overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        />
      )}

      {confirmModalOpen && (
        <ConfirmationModal
          isOpen={confirmModalOpen}
          onCancel={() => setConfirmModalOpen(false)}
          onConfirm={onConfirm}
          title="تأیید رویداد"
          message={`آیا از تایید این رویداد مطمئن هستید؟ (این عملیات برگشت پذیر نمیباشد.)`}
          confirmLabel={confirming ? "در حال تایید..." : "تایید"}
          cancelLabel="انصراف"
        />
      )}

      <Tooltip
        id="confermationStatus"
        place="bottom"
        style={{ direction: "rtl", fontFamily: "iransans" }}
      />
      <Tooltip
        id="description-tooltip"
        place="bottom"
        style={{ direction: "rtl", fontFamily: "iransans" }}
      />

      <SettingColumnDrawer
        isOpen={isColumnDrawerOpen}
        onClose={() => setColumnDrawerOpen(false)}
        onSuccess={() => {}}
      />

      <FilterEventDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      <FormModal<BranchInput>
        key={formKey}
        isOpen={isFormOpen}
        onRequestClose={() => setFormOpen(false)}
        title={"ایجاد شعبه"}
        schema={dynamicBranchSchema}
        initialData={editingBranch ?? undefined}
        onSubmit={handleSubmit}
      />

      {isReportOpen && (
        <EventReportModal isOpen onClose={() => setReportOpen(false)} />
      )}
    </>
  );
};

export default Events;

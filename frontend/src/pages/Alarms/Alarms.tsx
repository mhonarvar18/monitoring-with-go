import React, { useCallback, useMemo, useRef, useState } from "react";
import { useAlarms } from "../../hooks/useAlarmsReturn";
import Pagination from "../../components/Paginations/Paginations";
import EventTable from "../../components/Table/EventTable";
import { alarmColumns } from "../../components/Columns/AlarmColumns";
import {
  updateAlarm,
  searchAlarms,
  type AlarmData,
  type AlarmInput,
} from "../../services/alarms.service";
import { useAlarmCategories } from "../../hooks/useAlarmCategories";
import FormModal from "../../components/Modals/FormModal";
import { alarmSchema } from "../../formSchema/alarmSchema";
import toast from "react-hot-toast";
import { successStyle, errorStyle } from "../../types/stylesToast";
import { buildPatch } from "../../utils/buildPatch";
import { toEnglishDigits } from "../../utils/numberConvert";
import { FaFilter } from "react-icons/fa6";

const Alarms: React.FC = () => {
  const {
    data: alarms,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    refetch,
  } = useAlarms(1, 20);
  const { data: categories } = useAlarmCategories(1, 200);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AlarmData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<AlarmData | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const originalFormRef = useRef<AlarmData | null>(null);

  // Build category select options
  const categoryOptions = useMemo(
    () =>
      (categories || []).map((cat) => ({
        value: cat.id,
        label: cat.label,
      })),
    [categories]
  );

  const columns = useMemo(
    () =>
      alarmColumns({
        onEdit: (row: AlarmData) => {
          setEditingAlarm(row);
          originalFormRef.current = row;
          setModalKey((prev) => prev + 1);
          setEditModalOpen(true);
        },
      }),
    []
  );

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchAlarms(query);
      setSearchResults(results.data || []);
    } catch (err: any) {
      setSearchError(err?.response?.data?.message || "خطا در جستجو");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawQuery = e.target.value;
    const query = toEnglishDigits(rawQuery);
    setSearchQuery(query);

    // Debounced search - you might want to add debouncing here
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
  };

  const handleSubmit = async (formData: AlarmInput) => {
    if (editingAlarm?.id) {
      try {
        const base = originalFormRef.current as any;
        const patch = buildPatch(base, formData as any, {
          ignoreKeys: ["undefined"],
          skipEmptyStrings: true,
        }) as Partial<AlarmInput>;

        // Merge patch with original data to ensure all required fields are present
        const fullPayload: AlarmInput = {
          ...normalizeAlarmInput(editingAlarm),
          ...patch,
        };

        const res = await updateAlarm(editingAlarm.id, fullPayload);
        toast.success(res?.message || "آلارم با موفقیت ویرایش شد.", {
          style: successStyle,
        });

        setEditModalOpen(false);
        setEditingAlarm(null);
        refetch();

        // Refresh search results if there's an active search
        if (searchQuery.trim()) {
          handleSearch(searchQuery);
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "خطا در ویرایش آلارم.", {
          style: errorStyle,
        });
      }
    }
  };

  if (error) {
    return (
      <div
        className="w-full h-full flex items-center justify-center font-[iransans]"
        dir="rtl"
      >
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const normalizeAlarmInput = (alarm: AlarmData): AlarmInput => {
    return {
      code: alarm.code,
      label: alarm.label,
      protocol: alarm.protocol === "IP" ? "IP" : "TELL",
      categoryId: alarm.categoryId,
      type: alarm.type === "USER" ? "USER" : "ZONE",
      description: alarm.description ?? "",
    };
  };

  const displayData = searchQuery.trim() ? searchResults : alarms;
  const isDisplayingSearchResults = searchQuery.trim().length > 0;

  return (
    <div className="w-full h-full font-[iransans]" dir="rtl">
      <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
        <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-2xl pb-1">
          {/* ─── Page header (title + search bar) ─── */}
          <div className="w-full">
            <div className="w-full flex items-center justify-between px-6 py-3">
              <h1 className="text-2xl font-semibold">آلارم ها</h1>
              <div className="flex justify-between items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو در آلارم ها..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09a1a4] focus:border-transparent w-64"
                    dir="rtl"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    ) : (
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </div>
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  className="bg-[#09A1A4] px-3 py-3 rounded-lg"
                  // onClick={filterClick}
                >
                  <FaFilter color="#FFF" />
                </button>
              </div>
            </div>
          </div>

          {/* ─── EventTable shows only the paginated slice ─── */}
          <div className="w-full h-full flex flex-col">
            <EventTable<AlarmData>
              columns={columns}
              data={displayData}
              isLoading={loading || isSearching}
              bodyHeight="max-h-[74vh]"
            />
          </div>

          {/* ─── Pagination controls ─── */}
          {!isDisplayingSearchResults && (
            <div className="w-full">
              <Pagination
                currentPage={page}
                pageSize={limit}
                totalItems={totalPages}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setLimit(size);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <FormModal<AlarmInput>
        key={modalKey}
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        title="ویرایش آلارم"
        schema={alarmSchema(categoryOptions)}
        initialData={
          editingAlarm ? normalizeAlarmInput(editingAlarm) : undefined
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Alarms;
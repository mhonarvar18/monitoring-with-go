import { useCallback, useMemo, useState } from "react";
import {
  useLocationsByType,
  useLocationsMutations,
} from "../../hooks/useLocationsByType";
import EventTable from "../../components/Table/EventTable";
import { provinceColumns } from "../../components/Columns/ProvinceColumns";
import { cityColumns } from "../../components/Columns/CityColumns";
import { districtColumns } from "../../components/Columns/DistrictColumn";
import type { Location, LocationInput } from "../../hooks/useLocationsByType";
import Pagination from "../../components/Paginations/Paginations";
import FormModal from "../../components/Modals/FormModal";
import { LocationSchema } from "../../formSchema/locationSchema";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";

const Locations: React.FC = () => {
  // Selection and pagination
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | number | null>(null);
  const [cityPage, setCityPage] = useState(1);
  const [cityLimit, setCityLimit] = useState(10);
  const [selectedCityId, setSelectedCityId] = useState<string | number | null>(
    null
  );
  const [districtPage, setDistrictPage] = useState(1);
  const [districtLimit, setDistrictLimit] = useState(10);

  // Refresh keys
  const [cityRefreshKey, setCityRefreshKey] = useState(0);
  const [districtRefreshKey, setDistrictRefreshKey] = useState(0);

  // Modal states
  const [cityModalKey, setCityModalKey] = useState<number>(1);
  const [districtModalKey, setDistrictModalKey] = useState<number>(1);
  const [openCityFormModal, setOpenCityFormModal] = useState<boolean>(false);
  const [openDistrictFormModal, setOpenDistrictFormModal] =
    useState<boolean>(false);

  // Confirmation modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [pendingDelete, setPendingDelete] = useState<{
    type: "city" | "district";
    id: string | number;
  } | null>(null);

  // Edit states
  const [editingLocation, setEditingLocation] = useState<LocationInput | null>(
    null
  );

  // Data hooks
  const { data: provinces, loading } = useLocationsByType("STATE");
  const {
    data: cities,
    loading: loadingCities,
    total: cityTotalPages,
  } = useLocationsByType(
    "CITY",
    selectedProvinceId ?? undefined,
    cityLimit,
    cityPage,
    cityRefreshKey
  );
  const {
    data: districts,
    loading: loadingDistricts,
    total: districtTotalPages,
  } = useLocationsByType(
    "DISTRICT",
    selectedCityId ?? undefined,
    districtLimit,
    districtPage,
    districtRefreshKey
  );

  // Mutations (reuse for both city & district)
  const { create, update, remove, mutating } = useLocationsMutations();

  // ====== City handlers ======
  const openCityCreate = useCallback(() => {
    setEditingLocation(null);
    setCityModalKey((prev) => prev + 1);
    setOpenCityFormModal(true);
  }, []);
  const handleCityEdit = useCallback((row: Location) => {
    setEditingLocation({
      id: row.id,
      label: row.label,
      type: row.type as "CITY", // اگر مطمئن هستی این شهره
      parentId: row.parentId,
    });
    setCityModalKey((prev) => prev + 1);
    setOpenCityFormModal(true);
  }, []);

  const handleCityDelete = useCallback((row: Location) => {
    setPendingDelete({ type: "city", id: row.id });
    setConfirmOpen(true);
  }, []);
  const handleCityFormSubmit = async (values: LocationInput) => {
    if (editingLocation) {
      await update(editingLocation.id!, {
        parentId: selectedProvinceId!,
        type: "CITY",
        label: values.label,
      });
    } else {
      await create({
        parentId: selectedProvinceId!,
        type: "CITY",
        label: values.label,
      });
    }
    setCityRefreshKey((k) => k + 1); // <-- Refetch cities after mutation
    setOpenCityFormModal(false);
    setEditingLocation(null);
  };
  const cityColumn = useMemo(
    () =>
      cityColumns({
        onCreate: openCityCreate,
        onEdit: handleCityEdit,
        onDelete: handleCityDelete,
      }),
    [openCityCreate, handleCityEdit, handleCityDelete]
  );

  // ====== District handlers ======
  const openDistrictCreate = useCallback(() => {
    setEditingLocation(null);
    setDistrictModalKey((prev) => prev + 1);
    setOpenDistrictFormModal(true);
  }, []);
  const handleDistrictEdit = useCallback((row: Location) => {
    setEditingLocation({
      id: row.id,
      label: row.label,
      type: row.type as "DISTRICT",
      parentId: row.parentId,
    });
    setDistrictModalKey((prev) => prev + 1);
    setOpenDistrictFormModal(true);
  }, []);
  const handleDistrictDelete = useCallback((row: Location) => {
    setPendingDelete({ type: "district", id: row.id });
    setConfirmOpen(true);
  }, []);
  const handleDistrictFormSubmit = async (values: LocationInput) => {
    if (editingLocation) {
      await update(editingLocation.id!, {
        parentId: selectedCityId!,
        type: "DISTRICT",
        label: values.label,
      });
    } else {
      await create({
        parentId: selectedCityId!,
        type: "DISTRICT",
        label: values.label,
      });
    }
    setDistrictRefreshKey((k) => k + 1); // <-- Refetch districts after mutation
    setOpenDistrictFormModal(false);
    setEditingLocation(null);
  };
  const districtCols = useMemo(
    () =>
      districtColumns({
        onCreate: openDistrictCreate,
        onEdit: handleDistrictEdit,
        onDelete: handleDistrictDelete,
      }),
    [openDistrictCreate, handleDistrictEdit, handleDistrictDelete]
  );

  // ====== Confirmation modal handler ======
  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;

    try {
      await remove(pendingDelete.id);

      if (pendingDelete.type === "city") setCityRefreshKey((k) => k + 1);
      if (pendingDelete.type === "district")
        setDistrictRefreshKey((k) => k + 1);

      setConfirmOpen(false);
      setPendingDelete(null);
    } catch (err) {
      console.error("خطا در حذف آیتم:", err);
    }
  }, [pendingDelete, remove]);

  // ====== JSX ======
  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex justify-between items-center gap-2">
            <div className="w-1/2 h-full bg-white rounded-lg province overflow-hidden">
              <EventTable<Location>
                columns={provinceColumns}
                data={provinces}
                bodyHeight="max-h-[85vh]"
                isLoading={loading}
                onRowClick={(province) => {
                  setSelectedProvinceId(province.id);
                  setCityPage(1);
                }}
                selectedRowId={selectedProvinceId}
              />
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center items-center gap-2">
              <div className="w-full h-1/2 bg-white rounded-lg city overflow-hidden flex flex-col">
                <div className="w-full h-full">
                  <EventTable<Location>
                    columns={cityColumn}
                    data={cities}
                    bodyHeight="max-h-[35vh]"
                    isLoading={loadingCities}
                    onRowClick={(city) => {
                      setSelectedCityId(city.id);
                      setDistrictPage(1);
                    }}
                    selectedRowId={selectedCityId}
                  />
                </div>
                <div className="w-full">
                  <Pagination
                    currentPage={cityPage}
                    pageSize={cityLimit}
                    totalItems={cityTotalPages}
                    onPageChange={setCityPage}
                    onPageSizeChange={(size) => {
                      setCityLimit(size);
                      setCityPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="w-full h-1/2 bg-white rounded-lg district flex flex-col overflow-hidden">
                <div className="w-full h-full">
                  <EventTable<Location>
                    columns={districtCols}
                    data={districts}
                    bodyHeight="max-h-[35vh]"
                    isLoading={loadingDistricts}
                  />
                </div>
                <div className="w-full">
                  <Pagination
                    currentPage={districtPage}
                    pageSize={districtLimit}
                    totalItems={districtTotalPages}
                    onPageChange={setDistrictPage}
                    onPageSizeChange={(size) => {
                      setDistrictLimit(size);
                      setDistrictPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* City Modal */}
      <FormModal<LocationInput>
        key={cityModalKey}
        isOpen={openCityFormModal}
        onRequestClose={() => setOpenCityFormModal(false)}
        title={editingLocation ? "ویرایش شهر" : "ایجاد شهر"}
        schema={LocationSchema}
        initialData={editingLocation ?? undefined}
        onSubmit={handleCityFormSubmit}
      />
      {/* District Modal */}
      <FormModal<LocationInput>
        key={districtModalKey}
        isOpen={openDistrictFormModal}
        onRequestClose={() => setOpenDistrictFormModal(false)}
        title={editingLocation ? "ویرایش منطقه" : "ایجاد منطقه"}
        schema={LocationSchema}
        initialData={editingLocation ?? undefined}
        onSubmit={handleDistrictFormSubmit}
      />
      {/* Confirmation Modal */}
      {confirmOpen && (
        <ConfirmationModal
          isOpen={confirmOpen}
          onCancel={() => {
            setConfirmOpen(false);
            setPendingDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title={
            pendingDelete?.type === "city" ? "تأیید حذف شهر" : "تأیید حذف منطقه"
          }
          message="آیا مطمئنید که می‌خواهید این مورد را حذف کنید؟ این عمل قابل بازگشت نیست."
          confirmLabel="حذف"
          cancelLabel="انصراف"
          danger
        />
      )}
    </>
  );
};

export default Locations;

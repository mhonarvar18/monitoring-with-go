import React, { useMemo, useState } from "react";
import { useZoneTypes } from "../../hooks/useZoneTypes";
import Pagination from "../../components/Paginations/Paginations";
import EventTable from "../../components/Table/EventTable";
import Button from "../../components/Button";
import { zoneTypeColumns } from "../../components/Columns/ZoneTypeColumns";
import { FiSettings } from "react-icons/fi";
import type { ZoneTypeData } from "../../services/zoneType.service";
import { useZoneTypeCrud } from "../../hooks/useZoneTypeCurd";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import type { ZoneTypeInput } from "../../services/zoneTypeCrud.service";
import FormModal from "../../components/Modals/FormModal";
import { zoneTypeSchema } from "../../formSchema/zoneTypeSchema";
import { RequirePermission } from "../../components/RequirePermission/RequirePermission";

const ZoneTypes: React.FC = () => {
  const {
    data: zoneTypes,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    refetch,
  } = useZoneTypes({ initialPage: 1, initialLimit: 20 });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneTypeData | null>(null);
  const [openZoneTypeModal, setOpenZoneTypeModal] = useState<boolean>(false);
  const [FormModalKey, setFormModalKey] = useState<number>(0);
  const [editingZoneType, setEditingZoneType] = useState<
    (ZoneTypeInput & { id?: number }) | null
  >(null);
  const [modalKey, setModalKey] = useState<number>(1);
  const {
    createZoneType,
    updateZoneType,
    deleteZoneType,
    loading: CrudLoading,
    error: CurdError,
    resetError,
  } = useZoneTypeCrud();
  
  const openCreate = () => {
    setEditingZoneType(null);
    setFormModalKey((k) => k + 1);
    setOpenZoneTypeModal(true);
    setModalKey((k) => k + 1);
    resetError();
  };
  const openEdit = (zoneType: ZoneTypeInput) => {
    setEditingZoneType({
      ...zoneType,
    });
    setFormModalKey((k) => k + 1);
    setOpenZoneTypeModal(true);
    setModalKey((k) => k + 1);
    resetError();
  };
  const handleSubmit = async (data: Record<string, any>) => {
    const dto = data as ZoneTypeInput;
    if (editingZoneType?.id) {
      await updateZoneType(editingZoneType.id, dto);
      setOpenZoneTypeModal(false)
      refetch();
    } else {
      await createZoneType(dto);
      setOpenZoneTypeModal(false)
      refetch();
    }
  };
  const columns = useMemo(
    () =>
      zoneTypeColumns({
        onEdit: (row) => {
          openEdit(row);
        },
        onDelete: (row) => {
          setSelectedZone(row);
          setConfirmModalOpen(true);
        },
      }),
    []
  );
  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex flex-col justify-start items-center bg-white rounded-2xl">
            {/* Header */}
            <div className="w-full">
              <div className="w-full flex items-center justify-between px-6 py-3">
                <h1 className="text-2xl font-semibold">نوع زون ها</h1>
                <div className="flex justify-between items-center gap-2">
                  <RequirePermission perm="zonetype:create">
                    <Button
                      onClick={openCreate}
                      className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center"
                    >
                      ایجاد نوع زون
                    </Button>
                  </RequirePermission>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="w-full h-full flex flex-col">
              <EventTable<ZoneTypeData>
                columns={columns}
                data={zoneTypes}
                isLoading={loading}
                bodyHeight="max-h-[74vh]"
              />
            </div>

            {/* Pagination */}
            <div className="w-full px-6">
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
          </div>
        </div>
      </div>
      {confirmModalOpen && selectedZone && (
        <ConfirmationModal
          isOpen
          onCancel={() => setConfirmModalOpen(false)}
          onConfirm={async () => {
            await deleteZoneType(selectedZone.id);
            refetch();
            setConfirmModalOpen(false);
          }}
          title="حذف نوع زون"
          message={`آیا از حذف زون ${selectedZone.label} مطمئن هستید؟ (این عملیات برگشت پذیر نمیباشد)`}
          confirmLabel="حذف"
          cancelLabel="انصراف"
        />
      )}

      <FormModal<ZoneTypeInput>
        key={modalKey}
        isOpen={openZoneTypeModal}
        onRequestClose={() => setOpenZoneTypeModal(false)}
        title={editingZoneType ? "ویرایش نوع زون" : "ایجاد نوع زون"}
        schema={zoneTypeSchema}
        initialData={editingZoneType ?? undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ZoneTypes;

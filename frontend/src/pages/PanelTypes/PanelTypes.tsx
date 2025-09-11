import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePanelTypeCrud } from "../../hooks/usePanelTypeCrud";
import Pagination from "../../components/Paginations/Paginations";
import EventTable from "../../components/Table/EventTable";
import Button from "../../components/Button";
import type { PanelTypeData } from "../../services/panelType.service";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import FormModal from "../../components/Modals/FormModal";
import { panelTypeSchema } from "../../formSchema/panelTypeSchema";
import type { PanelTypeInput } from "../../services/panelType.service";
import { panelTypeColumns } from "../../components/Columns/panelTypeColumns";
import { RequirePermission } from "../../components/RequirePermission/RequirePermission";
import { buildPatch } from "../../utils/buildPatch";
import toast from "react-hot-toast";
import { errorStyle } from "../../types/stylesToast";
const PanelTypes: React.FC = () => {
  const {
    data: panelTypes,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    refetch,
    createPanelType,
    updatePanelType,
    deletePanelType,
  } = usePanelTypeCrud(1, 20);
  const [modalKey, setModalKey] = useState(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPanelType, setSelectedPanelType] =
    useState<PanelTypeData | null>(null);
  const [openPanelTypeModal, setOpenPanelTypeModal] = useState<boolean>(false);
  const originalFormRef = useRef<PanelTypeData | null>(null);
  const [editingPanelType, setEditingPanelType] = useState<
    (PanelTypeInput & { id?: string | number }) | null
  >(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const openCreate = () => {
    setEditingPanelType(null);
    originalFormRef.current = null;
    setModalKey((prev) => prev + 1);
    setOpenPanelTypeModal(true);
  };

  const openEdit = (panelType: PanelTypeData) => {
    setEditingPanelType({
      ...panelType,
    });
    originalFormRef.current = panelType;
    setModalKey((prev) => prev + 1);
    setOpenPanelTypeModal(true);
  };

  const handleSubmit = async (data: Record<string, any>) => {
    const dto = data as PanelTypeInput;

    if (editingPanelType?.id) {
      const base = originalFormRef.current as any;

      const patch = buildPatch(base, dto, {
        skipEmptyStrings: true,
      }) as Partial<PanelTypeInput>;

      //  block nulls
      const hasNull = Object.values(patch).some((v) => v === null);
      if (hasNull || Object.keys(patch).length === 0) {
        toast("فیلدی نمیتواند خالی باشد", { style: errorStyle });
        return; // keep modal open on validation error
      }

      await updatePanelType(editingPanelType.id, patch, {
        onSuccess: () => {
          setOpenPanelTypeModal(false);
        },
      });
    } else {
      await createPanelType(dto, {
        onSuccess: () => {
          setOpenPanelTypeModal(false);
        },
      });
    }
  };

  const columns = useMemo(
    () =>
      panelTypeColumns({
        onEdit: (row) => {
          console.log(row);
          openEdit(row);
        },
        onDelete: (row) => {
          setSelectedPanelType(row);
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
                <h1 className="text-2xl font-semibold">انواع پنل</h1>
                <div className="flex justify-between items-center gap-2">
                  <RequirePermission perm="paneltype:create">
                    <Button
                      onClick={openCreate}
                      className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center"
                    >
                      ایجاد نوع پنل
                    </Button>
                  </RequirePermission>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="w-full h-full flex flex-col">
              <EventTable<PanelTypeData>
                columns={columns}
                data={panelTypes}
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
      {confirmModalOpen && selectedPanelType && (
        <ConfirmationModal
          isOpen
          onCancel={() => setConfirmModalOpen(false)}
          onConfirm={async () => {
            await deletePanelType(selectedPanelType.id);
            refetch();
            setConfirmModalOpen(false);
          }}
          title="حذف نوع پنل"
          message={`آیا از حذف پنل ${selectedPanelType.name} مطمئن هستید؟ (این عملیات برگشت پذیر نمیباشد)`}
          confirmLabel="حذف"
          cancelLabel="انصراف"
        />
      )}

      <FormModal<PanelTypeInput>
        key={modalKey}
        isOpen={openPanelTypeModal}
        onRequestClose={() => setOpenPanelTypeModal(false)}
        title={editingPanelType ? "ویرایش نوع پنل" : "ایجاد نوع پنل"}
        schema={panelTypeSchema(editingPanelType ? true : false)}
        initialData={editingPanelType ?? undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PanelTypes;

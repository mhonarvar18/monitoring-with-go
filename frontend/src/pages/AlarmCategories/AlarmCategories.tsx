import React, { useMemo, useRef, useState } from "react";
import { useAlarmCategories } from "../../hooks/useAlarmCategories";
import Pagination from "../../components/Paginations/Paginations";
import EventTable from "../../components/Table/EventTable";
import Button from "../../components/Button";
import { FiSettings } from "react-icons/fi";
import type { CategoryData } from "../../services/alarmCategory.service";
import { alarmCategoryColumn } from "../../components/Columns/AlarmCategoryColumns";
import { useAlarmCategoryCrud } from "../../hooks/useAlarmCategoryCrud";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import type { AlarmCategoryInput } from "../../services/alarmCategoriesCrud.service";
import FormModal from "../../components/Modals/FormModal";
import { alarmCategorySchema } from "../../formSchema/alarmCategorySchema";
import { RequirePermission } from "../../components/RequirePermission/RequirePermission";
import { buildPatch } from "../../utils/buildPatch";

const AlarmCategories: React.FC = () => {
  const [modalKey, setModalKey] = useState(1);

  // ─── Fetch categories via hook ───
  const {
    data: categories,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    refetch,
  } = useAlarmCategories(1, 10);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAlarmCategory, setSelectedAlarmCategory] =
    useState<CategoryData | null>(null);
  const [openAlarmCategoryModal, setOpenAlarmCategoryModal] = useState(false);
  const [editingAlarmCategory, setEditingAlarmCategory] =
    useState<AlarmCategoryInput | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const originalFormRef = useRef<AlarmCategoryInput | null>(null);

  const {
    createAlarmCategory,
    updateAlarmCategory,
    deleteAlarmCategory,
    loading: crudLoading,
    error: errorLoading,
    resetError,
  } = useAlarmCategoryCrud();
  const openCreate = () => {
    setEditingAlarmCategory(null);
    originalFormRef.current = null;
    setOpenAlarmCategoryModal(true);
    setModalKey((k) => k + 1);
    resetError();
  };

  const openEdit = (row: CategoryData) => {
    setEditingAlarmCategory({
      code: row.code,
      label: row.label,
      priority: row.priority,
      needsApproval: row.needsApproval,
    });
    originalFormRef.current = row;
    setEditingId(row.id);
    setOpenAlarmCategoryModal(true);
    setModalKey((k) => k + 1);
    resetError();
  };

  const handleSubmit = async (data: Record<string, any>) => {
    const trueValues = [true, "true", "دارد"];
    const falseValues = [false, "false", "ندارد"];

    const base = originalFormRef.current as any;

    const dto = {
      ...data,
      needsApproval: trueValues.includes(data.needsApproval)
        ? true
        : falseValues.includes(data.needsApproval)
        ? false
        : false,
    } as AlarmCategoryInput;

    const patch = buildPatch(base, dto as any, {
      ignoreKeys: ["undefined"],
      skipEmptyStrings: true,
    }) as Partial<AlarmCategoryInput>;

    if (editingId) {
      await updateAlarmCategory(editingId, patch);
      setEditingId(null);
    } else {
      await createAlarmCategory(dto);
    }
    refetch();
    setOpenAlarmCategoryModal(false);
  };
  const columns = useMemo(
    () =>
      alarmCategoryColumn({
        onEdit: (row) => openEdit(row),
        onDelete: (row) => {
          setSelectedAlarmCategory(row);
          setConfirmModalOpen(true);
        },
      }),
    []
  );

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

  // ─── Main render ───
  return (
    <div className="w-full h-full font-[iransans]" dir="rtl">
      <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
        <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-2xl">
          {/* ─── Page header ─── */}
          <div className="w-full">
            <div className="w-full flex items-center justify-between px-6 py-3">
              <h1 className="text-2xl font-semibold">دسته بندی آلارم</h1>
              <div className="flex justify-between items-center gap-2">
                <RequirePermission perm="alarmcategory:create">
                  <Button
                    onClick={openCreate}
                    className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center"
                  >
                    ایجاد دسته بندی آلارم
                  </Button>
                </RequirePermission>
              </div>
            </div>
          </div>

          {/* ─── Table ─── */}
          <div className="w-full h-full flex flex-col">
            <EventTable<CategoryData>
              columns={columns}
              data={categories}
              isLoading={loading}
              bodyHeight="max-h-[74vh]"
            />
          </div>

          {/* ─── Pagination footer ─── */}
          <div className="w-full px-6 py-4">
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
      {confirmModalOpen && (
        <ConfirmationModal
          isOpen
          onCancel={() => setConfirmModalOpen(false)}
          onConfirm={async () => {
            if (!selectedAlarmCategory) return;
            await deleteAlarmCategory(selectedAlarmCategory.id);
            refetch();
            setConfirmModalOpen(false);
          }}
          title="حذف دسته بندی آلارم"
          message={`آیا از حذف دسته بندی آلارم  " ${
            selectedAlarmCategory?.label ?? ""
          } " مطمئن هستید؟ (این عملیات برگشت پذیر نمیباشد)`}
          confirmLabel="حذف"
          cancelLabel="انصراف"
        />
      )}
      <FormModal<AlarmCategoryInput>
        key={modalKey}
        isOpen={openAlarmCategoryModal}
        onRequestClose={() => {
          setOpenAlarmCategoryModal(false);
          setEditingId(null); // <-- Reset editingId!
        }}
        title={
          editingAlarmCategory
            ? "ویرایش دسته بندی آلارم"
            : "ایجاد دسته بندی آلارم"
        }
        schema={alarmCategorySchema(editingAlarmCategory ? true : false)}
        initialData={editingAlarmCategory ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AlarmCategories;

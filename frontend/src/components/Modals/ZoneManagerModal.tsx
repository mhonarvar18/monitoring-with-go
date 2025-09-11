import { useMemo, useState } from "react";
import { useZoneByBranch } from "../../hooks/useZoneByBranch";
import { zoneColumns } from "../Columns/ZoneColumn";
import DynamicModal from "./DyanamicModal";
import ConfirmationModal from "./ConfirmationModal";
import FormModal from "./FormModal";
import type { ZoneInput } from "../../services/zone.service";
import { zoneCrudService } from "../../services/zoneCrud.service";
import { zoneSchema } from "../../formSchema/zoneSchema";
import { usePartitionByBranch } from "../../hooks/usePartitionByBranch";
import { useZoneTypes } from "../../hooks/useZoneTypes";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";

export function ZoneManagerModal({ branchId, isOpen, onClose }) {
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalKey, setModalKey] = useState(1);

  // CRUD states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneInput | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deletingZone, setDeletingZone] = useState<any>(null);

  const { zones, loading, total, totalPages, refetch } = useZoneByBranch({
    branchId,
    page: page,
    limit: limit,
  });

  const { partitions, loading: partitionsLoading } = usePartitionByBranch({
    branchId,
    page: 1,
    limit: 100,
  });

  // Fetch all zone types
  const { data: zoneTypes, loading: zoneTypesLoading } = useZoneTypes({
    initialPage: 1,
    initialLimit: 100,
  });

  // Convert to FieldOption[]
  const partitionOptions = partitions.map((p) => ({
    value: p.id,
    label: p.label,
  }));
  const zoneTypeOptions = (zoneTypes || []).map((z) => ({
    value: z.id,
    label: z.label,
  }));

  // HANDLERS
  const handleFormSubmit = async (values: ZoneInput) => {
    const fixedValues = {
      ...values,
      partitionId: values.partitionId,
      zoneTypeId: values.zoneTypeId,
    };
    try {
      let res;
      if (editingZone && editingZone.id) {
        res = await zoneCrudService.updateZone(editingZone.id, fixedValues);
      } else {
        res = await zoneCrudService.createZone(fixedValues);
      }
      setEditModalOpen(false);
      setEditingZone(null);
      refetch();

      // Show success message (use server response message if available)
      toast.success(res?.data?.message || "عملیات با موفقیت انجام شد.", {
        style: successStyle,
      });
    } catch (err: any) {
      // Show error message (use server response message if available)
      const msg =
        err?.response?.data?.message || err?.message || "خطا در ذخیره زون.";
      toast.error(msg, {
        style: errorStyle,
      });
    } finally {
      setEditModalOpen(false);
    }
  };
  const handleDelete = async () => {
    if (deletingZone && deletingZone.id) {
      try {
        const res = await zoneCrudService.deleteZone(deletingZone.id);
        toast.success(res?.data?.message || "زون با موفقیت حذف شد.", {
          style: successStyle,
        });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "خطا در حذف زون.", {
          style: errorStyle,
        });
      } finally {
        setConfirmModalOpen(false);
        setDeletingZone(null);
        refetch();
      }
    }
  };

  // TABLE COLUMNS
  const columns = useMemo(
    () =>
      zoneColumns({
        onEdit: (row) => {
          setEditingZone(row);
          setModalKey((k) => k + 1);
          setEditModalOpen(true);
        },
        onDelete: (row) => {
          setDeletingZone(row);
          setConfirmModalOpen(true);
        },
      }),
    []
  );

  return (
    <>
      <DynamicModal
        modelName="zone"
        isOpen={isOpen}
        onClose={onClose}
        title="مدیریت زون‌ها"
        className="bg-white rounded-[15px] py-6 px-3 w-[75%] h-[75%] max-h-[75%] font-[iransans] outline-none"
        overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        columns={columns}
        dataTable={zones}
        loading={loading}
        buttonTitle="ایجاد زون"
        reciveButtonTitle="دریافت زون ها از پنل"
        onClickButton={() => {
          setEditingZone(null);
          setModalKey((k) => k + 1);
          setEditModalOpen(true);
        }}
        currentPage={page}
        pageSize={limit}
        totalItems={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setLimit(sz);
          setPage(1);
        }}
      />
      {/* Edit/Create Form */}
      <FormModal<ZoneInput>
        key={modalKey}
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        title={editingZone ? "ویرایش زون" : "ایجاد زون"}
        schema={zoneSchema(partitionOptions, zoneTypeOptions)}
        initialData={editingZone ?? undefined}
        onSubmit={handleFormSubmit}
      />
      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onCancel={() => {
          setConfirmModalOpen(false);
          setDeletingZone(null);
        }}
        onConfirm={handleDelete}
        title="حذف زون"
        message={`آیا از حذف "${deletingZone?.label}" مطمئن هستید؟`}
        confirmLabel="حذف"
        cancelLabel="انصراف"
      />
    </>
  );
}

import { useMemo, useState } from "react";
import { usePartitionByBranch } from "../../hooks/usePartitionByBranch";
import { partitionColumns } from "../Columns/PartitionColumn";
import DynamicModal from "./DyanamicModal";
import {
  createPartition,
  deletePartition,
  updatePartition,
  type PartitionInput,
} from "../../services/partition.service";
import ConfirmationModal from "./ConfirmationModal";
import FormModal from "./FormModal";
import { partitionSchema } from "../../formSchema/partitionSchema";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";

export function PartitionManagerModal({ branchId, isOpen, onClose }) {
  // Pagination state (you can lift it to parent if you want)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalKey, setModalKey] = useState(1);

  // CRUD states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPartition, setEditingPartition] =
    useState<PartitionInput | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deletingPartition, setDeletingPartition] =
    useState<PartitionInput | null>(null);

  const { partitions, loading, total, totalPages, refetch } =
    usePartitionByBranch({ branchId, page, limit });

  const handleFormSubmit = async (values: PartitionInput) => {
    try {
      let res;
      if (editingPartition) {
        res = await updatePartition(editingPartition.id, {
          ...values,
          branchId,
        });
      } else {
        res = await createPartition({ ...values, branchId });
      }
      toast.success(res?.data?.message || "عملیات با موفقیت انجام شد.", {
        style: successStyle,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "خطا در ثبت اطلاعات.", {
        style: errorStyle,
      });
    } finally {
      setEditModalOpen(false);
      setEditingPartition(null);
      refetch();
    }
  };
  const handleDelete = async () => {
    if (!deletingPartition) return;
    try {
      const res = await deletePartition(deletingPartition.id);
      toast.success("پارتیشن با موفقیت حذف شد.", {
        style: successStyle,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "خطا در حذف پارتیشن.", {
        style: errorStyle,
      });
    } finally {
      setConfirmModalOpen(false);
      setDeletingPartition(null);
      refetch();
    }
  };
  const columns = useMemo(
    () =>
      partitionColumns({
        onEdit: (row) => {
          setEditingPartition(row);
          setModalKey((k) => k + 1);
          setEditModalOpen(true);
        },
        onDelete: (row) => {
          setDeletingPartition(row);
          setConfirmModalOpen(true);
        },
      }),
    []
  );

  return (
    <>
      <DynamicModal
        modelName="partition"
        isOpen={isOpen}
        onClose={onClose}
        title="مدیریت پارتیشن‌ها"
        className="bg-white rounded-[15px] py-6 px-3 w-[75%] h-[75%] max-h-[75%] font-[iransans] outline-none"
        overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        columns={columns}
        dataTable={partitions}
        loading={loading}
        buttonTitle="ایجاد پارتیشن"
        reciveButtonTitle="دریافت پارتیشن‌ها از پنل"
        onClickButton={() => {
          setEditingPartition(null);
          setModalKey((k) => k + 1);
          setEditModalOpen(true);
        }} // برای ایجاد شعبه
        currentPage={page}
        pageSize={limit}
        totalItems={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setLimit(sz);
          setPage(1);
        }}
      />
      <FormModal
      key={modalKey}
        isOpen={editModalOpen}
        onRequestClose={() => {
          setEditModalOpen(false);
          setEditingPartition(null);
        }}
        title={editingPartition ? "ویرایش پارتیشن" : "ایجاد پارتیشن"}
        schema={partitionSchema}
        initialData={editingPartition ?? undefined}
        onSubmit={handleFormSubmit}
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onCancel={() => {
          setConfirmModalOpen(false);
          setDeletingPartition(null);
        }}
        onConfirm={handleDelete}
        title="حذف پارتیشن"
        message={`آیا از حذف "${deletingPartition?.label}" مطمئن هستید؟`}
        confirmLabel="حذف"
        cancelLabel="انصراف"
      />
    </>
  );
}

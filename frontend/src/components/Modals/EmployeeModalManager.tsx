import { useMemo, useRef, useState } from "react";
import { useEmployeeByBranch } from "../../hooks/useEmployeeByBranch";
import { employeeColumns } from "../Columns/EmployeeColumn";
import DynamicModal from "./DyanamicModal";
import FormModal from "./FormModal";
import ConfirmationModal from "./ConfirmationModal";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employee.service";
import { employeeSchema } from "../../formSchema/employeeSchema";
import type { EmployeeInput } from "../../services/employee.service";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";
import { buildPatch } from "../../utils/buildPatch";

export function EmployeeManagerModal({ branchId, isOpen, onClose }) {
  // Pagination state
  const [employeePage, setEmployeePage] = useState(1);
  const [employeeLimit, setEmployeeLimit] = useState(10);
  const [modalKey, setModalKey] = useState(1);

  // CRUD modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeInput | null>(
    null
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] =
    useState<EmployeeInput | null>(null);

  const originalFormRef = useRef<EmployeeInput | null>(null);

  // Fetch employees for this branch
  const {
    employeeUsers,
    loading,
    error,
    total,
    totalPages,
    refetch,
    page,
    limit,
    setPage,
    setLimit,
  } = useEmployeeByBranch({
    branchId,
    initialPage: employeePage,
    initialLimit: employeeLimit,
  });

  // Column handlers
  const columns = useMemo(
    () =>
      employeeColumns({
        onEdit: (row) => {
          setEditingEmployee(row);
          originalFormRef.current = row;
          setModalKey((k) => k + 1);
          setEditModalOpen(true);
        },
        onDelete: (row) => {
          setDeletingEmployee(row);
          setConfirmModalOpen(true);
        },
      }),
    []
  );

  // Handle form submit (create or update)
  const handleFormSubmit = async (values: EmployeeInput) => {
    try {
      let res;
      if (editingEmployee && editingEmployee.id) {
        const base = originalFormRef.current as any;

        const patch = buildPatch(base, values as EmployeeInput, {
          ignoreKeys: ["undefined"],
          skipEmptyStrings: true,
        }) as Partial<EmployeeInput>;

        res = await updateEmployee(editingEmployee.id, patch);

        // res = await updateEmployee(editingEmployee.id, {
        //   name: values.name,
        //   lastName: values.lastName,
        //   localId: values.localId,
        //   branchId: values.branchId,
        // });
      } else {
        res = await createEmployee(branchId, values);
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
      setEditingEmployee(null);
      refetch();
    }
  };

  // Handle delete confirm
  const handleDelete = async () => {
    if (!deletingEmployee || !deletingEmployee.id) return;
    try {
      const res = await deleteEmployee(deletingEmployee.id);
      toast.success(res?.data?.message || "کارمند با موفقیت حذف شد.", {
        style: successStyle,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "خطا در حذف کارمند.", {
        style: errorStyle,
      });
    } finally {
      setConfirmModalOpen(false);
      setDeletingEmployee(null);
      refetch();
    }
  };

  return (
    <>
      <DynamicModal
        modelName="employee"
        isOpen={isOpen}
        onClose={onClose}
        title="مدیریت کارمندان شعبه"
        className="bg-white rounded-[15px] py-6 px-3 w-[75%] h-[75%] max-h-[75%] font-[iransans] outline-none"
        overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        columns={columns}
        dataTable={employeeUsers}
        loading={loading}
        buttonTitle="ایجاد کارمند"
        reciveButtonTitle="دریافت کاربران از پنل"
        onClickButton={() => {
          setEditingEmployee(null);
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
      <FormModal<EmployeeInput>
        key={modalKey}
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        title={editingEmployee ? "ویرایش کارمند" : "افزودن کارمند"}
        schema={employeeSchema(!!editingEmployee)}
        initialData={editingEmployee ?? undefined}
        onSubmit={handleFormSubmit}
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onCancel={() => {
          setConfirmModalOpen(false);
          setDeletingEmployee(null);
        }}
        onConfirm={handleDelete}
        title="حذف کارمند"
        message={`آیا از حذف "${deletingEmployee?.name ?? ""} ${
          deletingEmployee?.lastName ?? ""
        }" مطمئن هستید؟`}
        confirmLabel="حذف"
        cancelLabel="انصراف"
      />
    </>
  );
}

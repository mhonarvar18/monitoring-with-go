import { useMemo, useRef, useState } from "react";
import Pagination from "../../components/Paginations/Paginations";
import EventTable from "../../components/Table/EventTable";
import type { PendingUser } from "../../services/reqRegister.service";
import { reqRegisterColumns } from "../../components/Columns/ReqRegisterColumn";
import { usePendingRequests } from "../../hooks/useReqRegister";
import { usePendingUserActions } from "../../hooks/usePendingUserActions";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import FormModal from "../../components/Modals/FormModal";
import { userSchema } from "../../formSchema/userSchema";
import type { UserInput } from "../../services/users.service";
import { buildPatch } from "../../utils/buildPatch";
import toast from "react-hot-toast";
import { errorStyle } from "../../types/stylesToast";
import { toPendingUserUpdate } from "../../utils/toPendingReqUserUpdate";

const ReqRegister: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [modalAction, setModalAction] = useState<
    "edit" | "confirm" | "reject" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const originalFormRef = useRef<PendingUser | null>(null);

  const { confirmUser, rejectUser, editUser } = usePendingUserActions();
  const {
    data: pendingUsers,
    refetch,
    isLoading,
  } = usePendingRequests(page, limit);

  const paginatedUsers = useMemo<PendingUser[]>(() => {
    return pendingUsers?.data?.data ?? [];
  }, [pendingUsers]);

  const totalItems = pendingUsers?.data?.total ?? 0;

  const openModal = (
    action: "edit" | "confirm" | "reject",
    user: PendingUser
  ) => {
    setModalAction(action);
    originalFormRef.current = user;
    setSelectedUser(user);
  };

  const closeModal = () => {
    setModalAction(null);
    originalFormRef.current = null;
    setSelectedUser(null);
  };

  const handleConfirmAction = async (updatedData?: UserInput) => {
    if (!selectedUser) return;

    try {
      if (modalAction === "confirm") {
        await confirmUser(selectedUser.id);
        closeModal();
      } else if (modalAction === "reject") {
        await rejectUser(selectedUser.id);
        closeModal();
      } else if (modalAction === "edit" && updatedData) {
        const base = originalFormRef.current;

        // Build diff from original user → updated form data
        const rawPatch = buildPatch(base as any, updatedData as any, {
          ignoreKeys: ["undefined"], // optional; remove if not needed
          skipEmptyStrings: true,
        }) as Partial<UserInput>;

        // Block nulls + no-change
        const hasNull = Object.values(rawPatch).some((v) => v === null);
        if (hasNull || Object.keys(rawPatch).length === 0) {
          toast("A field cannot be empty.", { style: errorStyle });
          return;
        }

        // Convert to what the API expects (Partial<PendingUser>)
        const patchForPending = toPendingUserUpdate(
          rawPatch,
          base || undefined
        );
        if (Object.keys(patchForPending).length === 0) {
          toast("No changes to apply.", { style: errorStyle });
          return;
        }

        await editUser(selectedUser.id, patchForPending);
        closeModal();
      }

      await refetch();
    } catch (e: any) {
      toast(e?.message || "Error", { style: errorStyle });
    }
  };

  const columns = useMemo(
    () =>
      reqRegisterColumns({
        onConfirm: (data) => openModal("confirm", data),
        onDelete: (data) => openModal("reject", data),
        onEdit: (data) => openModal("edit", data),
      }),
    []
  );

  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-2xl pb-1">
            {/* Header */}
            <div className="w-full flex items-center justify-between px-6 py-3">
              <h1 className="text-2xl font-semibold">درخواست ثبت نام</h1>
              <div className="flex justify-between items-center gap-2"></div>
            </div>

            {/* Table */}
            <div className="w-full h-full flex flex-col">
              <EventTable<PendingUser>
                columns={columns}
                data={paginatedUsers}
                isLoading={isLoading}
                bodyHeight="max-h-[74vh]"
              />
            </div>

            {/* Pagination */}
            {paginatedUsers.length > limit && (
              <div className="w-full">
                <Pagination
                  currentPage={page}
                  pageSize={limit}
                  totalItems={totalItems}
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newSize) => {
                    setLimit(newSize);
                    setPage(1);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalAction && modalAction !== "edit" && selectedUser && (
        <ConfirmationModal
          isOpen={true}
          title={`${modalAction === "confirm" ? "تأیید کاربر" : "رد کاربر"}`}
          message={`آیا از ${
            modalAction === "confirm" ? "تأیید" : "رد"
          } این کاربر مطمئن هستید؟`}
          onCancel={closeModal}
          onConfirm={handleConfirmAction}
        />
      )}
      {modalAction === "edit" && selectedUser && (
        <FormModal<UserInput>
          isOpen={true}
          onRequestClose={closeModal}
          title="ویرایش کاربر"
          schema={userSchema(modalAction === "edit", true)}
          initialData={{
            ...selectedUser,
            location: {
              ...selectedUser?.location,
              parent: {
                ...selectedUser?.location?.parent,
                type: selectedUser?.location?.parent?.type ?? "STATE",
              },
            },
          }}
          onSubmit={handleConfirmAction}
        />
      )}
    </>
  );
};

export default ReqRegister;

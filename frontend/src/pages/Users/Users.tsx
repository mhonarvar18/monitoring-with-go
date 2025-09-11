import { useMemo, useRef, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import EventTable from "../../components/Table/EventTable";
import Pagination from "../../components/Paginations/Paginations";
import { userColumns } from "../../components/Columns/UsersColumn";
import {
  createUser,
  deleteUser,
  updateUser,
  type User,
  type UserInput,
} from "../../services/users.service";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import FormModal from "../../components/Modals/FormModal";
import { userSchema } from "../../formSchema/userSchema";
import { errorStyle, successStyle } from "../../types/stylesToast";
import PermissionModal from "../../components/Modals/PermissionModal";
import { buildPatch } from "../../utils/buildPatch";

const Users: React.FC = () => {
  const {
    users,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    refetch,
  } = useUsers(1, 20);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
  const [userId, setUserId] = useState<string | number | null>(null);
  const [formModalKey, setFromModalKey] = useState<number>(0);
  const originalFormRef = useRef<UserInput | null>(null);

  const openCreateModal = () => {
    setEditingUser(null);
    originalFormRef.current = null;
    setFromModalKey((k) => k + 1);
    setEditModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    originalFormRef.current = userToUserInput(user);
    setFromModalKey((k) => k + 1);
    setEditModalOpen(true);
  };

  function userToUserInput(user: User): UserInput {
    return {
      // id: user.id, // remove id for creation, only needed for edit
      fullname: user.fullname ?? "",
      fatherName: user.fatherName ?? "",
      username: user.username ?? "",
      nationalityCode: user.nationalityCode ?? "",
      password: "", // always blank on edit
      personalCode: user.personalCode ?? "",
      phoneNumber: user.phoneNumber ?? "",
      type: user.type as UserInput["type"],
      address: user.address ?? "",
      ip: user.ip ?? "",
      locationId: user.locationId ?? user.location?.id ?? 0,
      location: user.location,
    };
  }

  const handleFormSubmit = async (values: UserInput) => {
    try {
      if (editingUser) {
        const base = originalFormRef.current ?? userToUserInput(editingUser);

        const patch = buildPatch(base, values, {
          ignoreKeys: ["password"], // will handle separately
          skipEmptyStrings: true,
        });

        if (values.password && values.password.trim() !== "") {
          patch.password = values.password;
        }

        const payload = Object.fromEntries(
          Object.entries(patch).filter(([key, value]) => value !== null)
        );

        const response = await updateUser(editingUser.id, payload);
        toast(response.message , {style : successStyle});
      } else {
        // create
        const { id, ...cleanValues } = values;

        const payload = {
          ...cleanValues,
          //   locationId:
          //     typeof cleanValues.locationId === "string"
          //       ? parseInt(cleanValues.locationId, 10)
          //       : cleanValues.locationId,
        };

        await createUser(payload);
        toast.success("کاربر با موفقیت ایجاد شد.", {
          style: successStyle,
        });
      }
      setEditModalOpen(false);
      setEditingUser(null);

      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "خطا در ثبت کاربر.", {
        style: errorStyle,
      });
    }
  };
  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        toast.success("کاربر با موفقیت حذف شد.", {
          style: successStyle,
        });

        refetch();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "خطا در حذف کاربر.", {
          style: errorStyle,
        });
      } finally {
        setConfirmModalOpen(false);
        setSelectedUser(null);
      }
    }
  };
  
  const columns = useMemo(
    () =>
      userColumns({
        onEdit: openEditModal, // or open modal, etc
        onDelete: (user) => {
          setSelectedUser(user);
          setConfirmModalOpen(true);
        },
        onPermission: (user) => {
          setOpenPermissionModal(true);
          setUserId(user.id);
        },
      }),
    []
  );

  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-2xl pb-1">
            {/* ─── Page header (title + buttons) ─── */}
            <div className="w-full">
              <div className="w-full flex items-center justify-between px-6 py-3">
                <h1 className="text-2xl font-semibold">کاربران مانیتورینگ</h1>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    onClick={openCreateModal}
                    className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center gap-2"
                  >
                    <span>ایجاد کاربر</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* ─── EventTable shows only the paginated slice ─── */}
            <div className="w-full h-full flex flex-col">
              <EventTable<User>
                columns={columns}
                data={users}
                isLoading={loading}
                bodyHeight="max-h-[74vh]"
              />
            </div>

            {/* ─── Pagination controls ─── */}
            <div className="w-full">
              <Pagination
                currentPage={page}
                pageSize={limit}
                totalItems={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setLimit(newSize);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {confirmModalOpen && (
        <ConfirmationModal
          isOpen={confirmModalOpen}
          onCancel={() => {
            setConfirmModalOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDelete}
          title="حذف کاربر"
          message={
            selectedUser
              ? `آیا از حذف کاربر "${selectedUser.fullname}" مطمئن هستید؟`
              : ""
          }
          confirmLabel="حذف"
          cancelLabel="انصراف"
        />
      )}
      <FormModal<UserInput>
        key={formModalKey}
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        title={editingUser ? "ویرایش کاربر" : "ایجاد کاربر"}
        schema={userSchema(editingUser ? true : false)}
        initialData={editingUser ? userToUserInput(editingUser) : undefined}
        onSubmit={handleFormSubmit}
      />
      {openPermissionModal && (
        <PermissionModal
          isOpen={openPermissionModal}
          onRequestClose={() => setOpenPermissionModal(false)}
          userId={userId || null}
        />
      )}
    </>
  );
};

export default Users;

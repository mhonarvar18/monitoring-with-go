import ReactModal from "react-modal";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  usePermissionAssignment,
  usePermissions,
  useUserAssignedPermissions,
} from "../../hooks/usePermissions";
import { useEffect, useState } from "react";
import {
  deletePermissions,
  type Permission,
  type UserAssignedPermission,
} from "../../services/permission.service";
import LoadingSpinner from "../LoadingSpinner";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";
import { RequirePermission } from "../RequirePermission/RequirePermission";

ReactModal.setAppElement("#root");

interface PermissionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userId: string | number | null;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onRequestClose,
  userId,
}) => {
  const { permissions, loading } = usePermissions();
  const {
    assignedPermissions: initialAssignedPermissions,
    loading: assignedLoading,
  } = useUserAssignedPermissions(userId);

  const {
    savePermissions,
    loading: saving,
    error: saveError,
  } = usePermissionAssignment();

  // These hold the "permission ids" currently assigned (for compare)
  const [prevAssignedIds, setPrevAssignedIds] = useState<(string | number)[]>([]);
  // These hold the "assignment row ids" (UserAssignedPermission.id) for removals
  const [prevAssignedRowIds, setPrevAssignedRowIds] = useState<(string | number)[]>([]);

  // Local state for available and assigned lists
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<UserAssignedPermission[]>([]);

  // UI state: which are checked for moving
  const [selectedAvailable, setSelectedAvailable] = useState<Set<string | number>>(new Set());
  const [selectedAssigned, setSelectedAssigned] = useState<Set<string | number>>(new Set());

  // Sync state on open/load
  useEffect(() => {
    if (!isOpen || !permissions) return;
    if (loading || assignedLoading) return;

    setAssignedPermissions(initialAssignedPermissions);

    // Previous (original) assigned permissionIds for diffing on save
    setPrevAssignedIds(initialAssignedPermissions.map((a) => a.permission.id));
    setPrevAssignedRowIds(initialAssignedPermissions.map((a) => a.id));

    // Available = not assigned (compare by permission.id)
    const assignedPermissionIds = new Set(initialAssignedPermissions.map((a) => a.permission.id));
    setAvailablePermissions(
      permissions.filter((p) => !assignedPermissionIds.has(p.id))
    );

    setSelectedAvailable(new Set());
    setSelectedAssigned(new Set());
  }, [isOpen, permissions, initialAssignedPermissions, loading, assignedLoading]);

  // Move selected from available → assigned
  const assignSelected = () => {
    if (!permissions) return;
    const toAssign = availablePermissions.filter((p) => selectedAvailable.has(p.id));
    // Add as *local* assignment (simulate, since no row id yet)
    setAssignedPermissions((prev) => [
      ...prev,
      ...toAssign.map((perm) => ({
        id: -1 * Number(perm.id), // temporary negative id to avoid collision
        userId: userId!,
        permissionId: perm.id,
        modelId: null,
        permission: perm,
      })),
    ]);
    setAvailablePermissions((prev) =>
      prev.filter((p) => !selectedAvailable.has(p.id))
    );
    setSelectedAvailable(new Set());
  };

  // Move selected from assigned → available
  const unassignSelected = () => {
    const toUnassign = assignedPermissions.filter((a) =>
      selectedAssigned.has(a.id)
    );
    setAvailablePermissions((prev) => [
      ...prev,
      ...toUnassign.map((a) => a.permission),
    ]);
    setAssignedPermissions((prev) =>
      prev.filter((a) => !selectedAssigned.has(a.id))
    );
    setSelectedAssigned(new Set());
  };

  // Select all
  const handleSelectAllAvailable = (checked: boolean) => {
    setSelectedAvailable(
      checked ? new Set(availablePermissions.map((p) => p.id)) : new Set()
    );
  };
  const handleSelectAllAssigned = (checked: boolean) => {
    setSelectedAssigned(
      checked ? new Set(assignedPermissions.map((a) => a.id)) : new Set()
    );
  };

  // Single toggles
  const toggleAvailable = (id: string | number) => {
    setSelectedAvailable((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };
  const toggleAssigned = (id: string | number) => {
    setSelectedAssigned((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  // Saving: calculate what to assign and what to remove
  const handleSave = async () => {
    if (!userId) return;
    const newIds = assignedPermissions.map((a) => a.permission.id);
    const toRemove = initialAssignedPermissions
      .filter((a) => !newIds.includes(a.permission.id))
      .map((a) => a.id);
    const toAssign = newIds.filter((id) => !prevAssignedIds.includes(id));
    let success = true;
    try {
      if (toAssign.length > 0) {
        await savePermissions({
          userId,
          newIds,
        });
      }
      if (toRemove.length > 0) {
        await deletePermissions(toRemove);
      }
    } catch {
      success = false;
    }
    if (success) {
      toast.success("مجوزها با موفقیت ذخیره شدند", { style: successStyle });
      onRequestClose();
    } else {
      toast.error(saveError || "خطا در ذخیره مجوزها", { style: errorStyle });
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Permission Modal"
      overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      className="bg-white rounded-[15px] py-5 px-3 w-[70%] h-[86%] font-[iransans] rtl outline-none"
    >
      <div
        className="w-full h-full flex flex-col justify-start items-center gap-2"
        dir="rtl"
      >
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg">مدیریت سطح دسترسی</h2>
          <div className="w-1/2 flex justify-end items-center">
            <span
              className="cursor-pointer hover:text-red-600 transition-all"
              onClick={onRequestClose}
            >
              <IoMdClose size={28} />
            </span>
          </div>
        </div>
        <hr className="w-full" />
        <div className="w-full h-[88%] flex justify-between items-center gap-1">
          {/* All Permissions (Available) */}
          <div className="w-full h-full border border-gray-300 rounded overflow-hidden flex flex-col justify-start items-center all-permission ga">
            <div className="w-full bg-gray-200 py-2 px-4 flex justify-center items-center sticky top-0 z-10">
              <span>کلیه مجوز ها</span>
            </div>
            <label className="w-full flex items-center justify-between border-b last:border-b-0 px-4 py-2 hover:bg-gray-50 transition">
              <span className="text-sm font-medium">انتخاب همه مجوزها</span>
              <input
                type="checkbox"
                checked={
                  availablePermissions.length > 0 &&
                  selectedAvailable.size === availablePermissions.length
                }
                onChange={(e) => handleSelectAllAvailable(e.target.checked)}
              />
            </label>
            <div
              className="w-full flex-1 overflow-y-auto"
              style={{ maxHeight: "99%" }}
            >
              {loading ? (
                <div className="py-8 text-center text-gray-500">
                  <LoadingSpinner />
                </div>
              ) : availablePermissions.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  موردی یافت نشد
                </div>
              ) : (
                <ul className="w-full">
                  {availablePermissions.map((perm) => (
                    <li
                      key={perm.id}
                      className="flex items-center justify-between border-b last:border-b-0 px-4 py-2 hover:bg-gray-50 transition"
                    >
                      <span className="text-sm font-medium">
                        {perm.description}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedAvailable.has(perm.id)}
                        onChange={() => toggleAvailable(perm.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Chevron buttons */}
          <div className="w-[8%] h-full flex flex-col justify-center items-center gap-2">
            <RequirePermission perm="permission:assign">
              <Button
                className="w-full py-4 flex justify-center items-center border border-gray-300 hover:bg-green-600 hover:border-green-600 transition-all group"
                disabled={selectedAvailable.size === 0}
                onClick={assignSelected}
                type="button"
              >
                <FaChevronLeft
                  size={20}
                  className="text-black group-hover:text-white transition-colors duration-200"
                />
              </Button>
            </RequirePermission>
            <RequirePermission perm="permission:revoke">
              <Button
                className="w-full py-4 flex justify-center items-center border border-gray-300 hover:bg-red-600 hover:border-red-600 transition-all group"
                disabled={selectedAssigned.size === 0}
                onClick={unassignSelected}
                type="button"
              >
                <FaChevronRight
                  size={20}
                  className="text-black group-hover:text-white transition-colors duration-200"
                />
              </Button>
            </RequirePermission>
          </div>

          {/* Assigned Permissions */}
          <div className="w-full h-full border border-gray-300 rounded overflow-hidden flex flex-col justify-start items-center">
            <div className="w-full bg-gray-200 py-2 px-4 flex justify-center items-center sticky top-0 z-10">
              <span>مجوز های اعطا شده</span>
            </div>
            <label className="w-full flex items-center justify-between border-b last:border-b-0 px-4 py-2 hover:bg-gray-50 transition">
              <span className="text-sm font-medium">
                انتخاب همه مجوزهای اعطا شده
              </span>
              <input
                type="checkbox"
                checked={
                  assignedPermissions.length > 0 &&
                  selectedAssigned.size === assignedPermissions.length
                }
                onChange={(e) => handleSelectAllAssigned(e.target.checked)}
              />
            </label>
            <div
              className="w-full flex-1 overflow-y-auto"
              style={{ maxHeight: "99%" }}
            >
              {assignedPermissions.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  موردی یافت نشد
                </div>
              ) : (
                <ul className="w-full">
                  {assignedPermissions.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between border-b last:border-b-0 px-4 py-2 hover:bg-gray-50 transition"
                    >
                      <span className="text-sm font-medium">
                        {a.permission.description}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedAssigned.has(a.id)}
                        onChange={() => toggleAssigned(a.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-1">
          <Button
            className="w-[14%] bg-btns text-white px-4 py-2 rounded"
            onClick={handleSave}
            disabled={saving}
          >
            ذخیره تغییرات
          </Button>
          <Button className="w-[14%] bg-transparent border-[#09a1a4] text-[#09a1a4] px-4 py-2 rounded hover:bg-btns hover:text-white transition-all">
            <span className="text-black">بازنشانی تغییرات</span>
          </Button>
          <Button
            className="w-[14%] bg-transparent border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-all"
            onClick={onRequestClose}
          >
            انصراف
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default PermissionModal;

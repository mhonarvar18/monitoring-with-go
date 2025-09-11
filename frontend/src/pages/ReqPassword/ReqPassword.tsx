import { useMemo, useState } from "react";
import { usePendingPasswordResets } from "../../hooks/usePendingPasswordResets";
import EventTable from "../../components/Table/EventTable";
import Pagination from "../../components/Paginations/Paginations";
import { getReqPasswordColumns } from "../../components/Columns/ReqPasswordColumn";
import toast from "react-hot-toast";
import {
  useConfirmResetPass,
  useRejectResetPass,
} from "../../hooks/useResetPassword";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import { errorStyle, successStyle } from "../../types/stylesToast";

const ReqPassword: React.FC = () => {
  // Modal state for confirmation dialog
  const [modalOpen, setModalOpen] = useState(false); // modal visibility
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null); // stores selected username for action
  const [modalAction, setModalAction] = useState<"confirm" | "reject" | null>(
    null
  ); // stores current action type

  // Fetch pending password reset requests with pagination
  const {
    data,
    total,
    page,
    limit,
    totalPages,
    loading,
    setPage,
    setLimit,
    refetch,
  } = usePendingPasswordResets(1, 10); // custom hook to get reset requests

  // Mutation to confirm password reset
  const { mutate: confirmResetPassMutation } = useConfirmResetPass({
    onSuccess: (response) => {
      toast.success(response?.data?.data, { style: successStyle }); // show success toast
      refetch(); // refresh list after success
    },
    onError: (error) =>
      toast(error?.response?.data?.message, { style: errorStyle }), // show error toast
  });

  // Mutation to reject password reset
  const { mutate: rejectPassMutation } = useRejectResetPass({
    onSuccess: (response) => {
      toast.success(response?.data?.message, { style: successStyle }); // show success toast
      refetch(); // refresh list after success
    },
    onError: (error) =>
      toast(error?.response?.data?.message, { style: errorStyle }), // show error toast
  });

  // Opens confirmation modal with selected username and action
  const openConfirmModal = (username: string, action: "confirm" | "reject") => {
    setSelectedUsername(username); // store username
    setModalAction(action); // store action type
    setModalOpen(true); // open modal
  };

  // Called when user confirms action in the modal
  const handleModalConfirm = () => {
    if (!selectedUsername || !modalAction) return; // guard clause

    if (modalAction === "confirm") {
      confirmResetPassMutation({ requestId: selectedUsername }); // confirm mutation
    } else {
      rejectPassMutation({ requestId: selectedUsername }); // reject mutation
      refetch(); // refresh list after rejection
    }

    setModalOpen(false); // close modal
  };

  const columns = useMemo(() => getReqPasswordColumns(openConfirmModal), []);

  return (
    <div className="w-full h-full font-[iransans]" dir="rtl">
      <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
        <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-2xl pb-1">
          {/* Page header */}
          <div className="w-full">
            <div className="w-full flex items-center justify-between px-6 py-3">
              <h1 className="text-2xl font-semibold">
                درخواست فراموشی رمز عبور
              </h1>
            </div>
          </div>

          {/* Table */}
          <div className="w-full h-full flex flex-col">
            <EventTable
              columns={columns}
              data={data || []}
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

      {/* Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalOpen(false)}
        message={
          modalAction === "confirm"
            ? "آیا از تأیید این درخواست اطمینان دارید؟"
            : "آیا از رد این درخواست اطمینان دارید؟"
        }
      />
    </div>
  );
};

export default ReqPassword;

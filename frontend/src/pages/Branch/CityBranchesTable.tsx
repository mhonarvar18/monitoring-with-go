import { useBranchesByCity } from "../../hooks/useBranchByCities";
import type { BranchAll, Location } from "../../types/BranchAll";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import Pagination from "../../components/Paginations/Paginations";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { FaNetworkWired, FaUser } from "react-icons/fa6";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import type { EmployeeDataResponse } from "../../services/employee.service";
import {
  MdOutlineAssessment,
  MdOutlineSettingsInputComponent,
} from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { PartitionManagerModal } from "../../components/Modals/PartitionManagerModal";
import { ZoneManagerModal } from "../../components/Modals/ZoneManagerModal";
import { EmployeeManagerModal } from "../../components/Modals/EmployeeModalManager";
import { RequirePermission } from "../../components/RequirePermission/RequirePermission";
import BranchReportModal from "../../components/Modals/BranchReportModal";
import EventTable from "../../components/Table/EventTable";

interface Props {
  cityId: string | number;
  onEdit: (branch: BranchAll) => void;
  cityBranchesRef?: any;
  onDelete: (branchId: string | number) => void;
}

export interface CityBranchesTableHandle {
  fetchAllBranches: () => Promise<BranchAll[]>;
}

const CityBranchesTable = forwardRef<CityBranchesTableHandle, Props>(
  ({ cityId, onEdit, onDelete, cityBranchesRef }, ref) => {
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<
      string | number | null
    >(null);
    const [partitionBranchId, setPartitionBranchId] = useState<
      string | number | null
    >(null);
    const [zoneBranchId, setZoneBranchId] = useState<string | number | null>(
      null
    );
    const [employeeBranchId, setEmployeeBranchId] = useState<
      string | number | null
    >(null);
    const [reportBranchId, setReportBranchId] = useState<
      string | number | null
    >(null);
    const [branchReportParams, setBranchReportParams] = useState<{
      locationType: string;
      parentId: string | number;
      branchId: string | number;
    } | null>(null);

    const {
      branches,
      loading,
      error,
      page,
      limit,
      totalItems,
      setPage,
      setLimit,
      refetch,
      fetchAllBranches,
    } = useBranchesByCity({ cityId, initialLimit: 20 });

    useEffect(() => {
      if (cityBranchesRef) {
        cityBranchesRef.current = { refetch };
      }
    }, [cityBranchesRef, refetch]);

    const openBranchReport = (branchId: string | number) => {
      setBranchReportParams({
        locationType: "CITY",
        parentId: cityId,
        branchId,
      });
    };
    
    const columns = useMemo<ColumnDef<BranchAll>[]>(
      () => [
        { accessorKey: "name", header: "نام شعبه", size: 20 },

        { accessorKey: "code", header: "کد", size: 5 },
        {
          id: "district",
          header: "منطقه",
          cell: ({ row }) => {
            const loc = row.original.location as Location | undefined;
            if (!loc) return null;
            return loc.type === "DISTRICT" ? (
              <span>{loc.label}</span>
            ) : (
              <span></span>
            );
          },
          size: 15,
        },
        {
          accessorKey: "address",
          header: "آدرس",
          size: 30,
          cell: ({ row }) => {
            const address = row.original.address || "";
            const display =
              address.length > 10 ? address.slice(0, 10) + "…" : address;
            return (
              <div className="w-full h-full flex justify-center items-center">
                {display}
              </div>
            );
          },
        },
        { accessorKey: "phoneNumber", header: "شماره تماس", size: 20 },
        { accessorKey: "panelType.name", header: "نوع پنل", size: 20 },
        {
          accessorKey: "mainPartition",
          header: "پارتیشن مرجع",
          cell: ({ row }) => {
            const label = row.original.mainPartition?.label;
            return <span>{label}</span>;
          },
          size: 20,
        },
        { accessorKey: "panelIp", header: "آیپی", size: 30 },
        {
          accessorKey: "action",
          header: "تنظیمات",
          size: 50,
          cell: ({ row }) => {
            const branch = row.original;
            return (
              <>
                <div className="w-full h-full flex justify-center items-center gap-2">
                  <RequirePermission perm="partition:read">
                    <div
                      className="border border-[#3b82f6] rounded-[10px] p-2 cursor-pointer"
                      data-tooltip-id="icons"
                      data-tooltip-content="پارتیشن ها"
                      onClick={() => setPartitionBranchId(branch.id)}
                    >
                      <FaNetworkWired color="3b82f6" />
                    </div>
                  </RequirePermission>
                  <RequirePermission perm="zone:read">
                    <div
                      className="border border-[#3b82f6] rounded-[10px] p-2 cursor-pointer"
                      data-tooltip-id="icons"
                      data-tooltip-content="زون ها"
                      onClick={() => setZoneBranchId(branch.id)}
                    >
                      <MdOutlineSettingsInputComponent color="3b82f6" />
                    </div>
                  </RequirePermission>
                  <RequirePermission perm="employee:read">
                    <div
                      className="border border-[#16a34a] rounded-[10px] p-2 cursor-pointer text-gre"
                      data-tooltip-id="icons"
                      data-tooltip-content="کارمندان شعبه"
                      onClick={() => setEmployeeBranchId(branch.id)}
                    >
                      <FaUser color="16a34a" />
                    </div>
                  </RequirePermission>
                  <RequirePermission perm="branch:update">
                    <div
                      className="border border-[#FF9F1C] rounded-[10px] p-2 cursor-pointer"
                      onClick={() => onEdit(branch)}
                      data-tooltip-id="icons"
                      data-tooltip-content="ویرایش"
                    >
                      <EditIcon />
                    </div>
                  </RequirePermission>
                  <RequirePermission perm="branch:delete">
                    <div
                      onClick={() => {
                        setPendingDeleteId(branch.id); // Set the id you want to delete
                        setConfirmOpen(true); // Show the modal
                      }}
                      className="p-2 border border-red-500 rounded-[10px] cursor-pointer"
                      data-tooltip-id="icons"
                      data-tooltip-content="حذف"
                    >
                      <TrashIcon />
                    </div>
                  </RequirePermission>
                  <div
                    className="border border-[#0ea5e9] rounded-[10px] p-2 cursor-pointer"
                    data-tooltip-id="icons"
                    data-tooltip-content="گزارش رویدادها"
                    onClick={() => openBranchReport(branch.id)}
                  >
                    <MdOutlineAssessment color="#0ea5e9" />
                  </div>
                </div>
              </>
            );
          },
        },
      ],
      [onEdit]
    );

    useImperativeHandle(
      ref,
      () => ({
        fetchAllBranches,
      }),
      [fetchAllBranches]
    );

    if (error) {
      return <p className="text-red-500">خطا: {error}</p>;
    }

    return (
      <>
        <div className="w-full h-full flex flex-col justify-between items-center gap-1">
          <div className="w-full h-full overflow-hidden">
            <EventTable<BranchAll>
              data={branches}
              columns={columns}
              isLoading={loading}
              bodyHeight="max-h-[68vh]"
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <Pagination
              currentPage={page}
              pageSize={limit}
              totalItems={totalItems}
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(size) => setLimit(size)}
              classNames=""
              rowPageClassNames=""
            />
          </div>
        </div>
        {confirmOpen && (
          <ConfirmationModal
            isOpen
            onCancel={() => {
              setConfirmOpen(false);
              setPendingDeleteId(null);
            }}
            onConfirm={() => {
              if (pendingDeleteId != null) {
                onDelete(pendingDeleteId);
              }
              setConfirmOpen(false);
              setPendingDeleteId(null);
            }}
            title="تأیید حذف شعبه"
            message="آیا مطمئنید که می‌خواهید این شعبه را حذف کنید؟ این عمل قابل بازگشت نیست."
            confirmLabel="حذف"
            cancelLabel="انصراف"
            danger
          />
        )}
        {partitionBranchId !== null && (
          <PartitionManagerModal
            branchId={partitionBranchId}
            isOpen={partitionBranchId !== null}
            onClose={() => setPartitionBranchId(null)}
          />
        )}
        {zoneBranchId !== null && (
          <ZoneManagerModal
            branchId={zoneBranchId}
            isOpen={zoneBranchId !== null}
            onClose={() => setZoneBranchId(null)}
          />
        )}
        {employeeBranchId !== null && (
          <EmployeeManagerModal
            branchId={employeeBranchId}
            isOpen={employeeBranchId !== null}
            onClose={() => setEmployeeBranchId(null)}
          />
        )}
        <BranchReportModal
          isOpen={!!branchReportParams}
          onClose={() => setBranchReportParams(null)}
          locationType={branchReportParams?.locationType || "CITY"}
          parentId={branchReportParams?.parentId || 0}
          branchId={branchReportParams?.branchId || 0}
        />
        <Tooltip id="icons" place="bottom" />
      </>
    );
  }
);

export default CityBranchesTable;

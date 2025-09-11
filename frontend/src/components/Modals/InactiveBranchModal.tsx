import ReactModal from "react-modal";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UseWrongFormatEvent } from "../../hooks/useWrongFormatEvent";
import type { MyColumnDef } from "../Columns/EventColumns";
import type { WrongFormatEvent } from "../../services/wrongFormat.service";
import EventTable from "../Table/EventTable";
import type { BranchAll } from "../../types/BranchAll";
import { branchColumn } from "../Columns/BranchColumn";
import { fetchInactiveBranches } from "../../services/inactivateBranches.service";
import type {
  InactiveBranchesRequest,
  InactiveBranchesRequestBase,
} from "../../services/inactivateBranches.service";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useLocationsByType } from "../../hooks/useLocationsByType";

ReactModal.setAppElement("#root");

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  overlayClassName: string;
  darkMode?: boolean;
}
// shape for each table row
interface WrongFormatRow {
  id: number;
  raw: string;
}
const InActiveBranchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  className,
  overlayClassName,
  darkMode,
}) => {
  const [selectedTab, setSelectedTab] = useState<
    "inActiveBranch" | "wrongEventFormat"
  >("inActiveBranch");
  const [hour, setHour] = useState<number>(12);
  const [filterAction, setFilterAction] = useState<
    "ALL" | "ACTIVE" | "INACTIVE" | "BOTH"
  >("ALL");
  const [branches, setBranches] = useState<BranchAll[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [branchesError, setBranchesError] = useState<Error | null>(null);

  const { data: countryData } = useLocationsByType("COUNTRY");

  const countryId = countryData?.[0]?.id as string;

  // fetch branches on tab change or filter change
  useEffect(() => {
    if (selectedTab !== "inActiveBranch" || !countryId) return;
    // 1️⃣ Build the body with the proper base type:
    const baseBody: InactiveBranchesRequestBase = {
      hour,
      locationId: countryId,
      allActions: false,
    };

    // 2️⃣ Now extend it with `action` only when needed:
    let body:
      | InactiveBranchesRequest<{ action?: string }>
      | InactiveBranchesRequestBase = baseBody;

    if (filterAction === "ACTIVE") {
      body = {
        ...baseBody,
        action: "ARM", // map ACTIVE → ARM
      };
    } else if (filterAction === "INACTIVE") {
      body = {
        ...baseBody,
        action: "DISARM", // map INACTIVE → DISARM
      };
    } else if (filterAction === "BOTH") {
      body = {
        ...baseBody,
        allActions: true, // BOTH → allActions=true
      };
    }
    // `filterAction === "ALL"` leaves `body = baseBody`

    setIsLoadingBranches(true);
    setBranchesError(null);

    // 3️⃣ Call the fetcher — TS now knows that `body` satisfies the request type:
    fetchInactiveBranches(body)
      .then(setBranches)
      .catch(setBranchesError)
      .finally(() => setIsLoadingBranches(false));
  }, [selectedTab, hour, filterAction , countryId]);

  const { data, isLoading, isError, error, refetch } = UseWrongFormatEvent({
    enabled: selectedTab === "wrongEventFormat",
  });

  const rows: WrongFormatRow[] = (data || []).map((line, idx) => ({
    id: idx + 1,
    raw: line,
  }));

  const wrongFormatColumn: MyColumnDef<WrongFormatRow>[] = [
    {
      accessorKey: "raw",
      header: () => {
        return (
          <>
            <span className="text-lg">فرمت اشتباه</span>
          </>
        );
      },
      cell: ({ getValue }) => (
        <>
          <span className="font-mono text-base">{getValue() as any}</span>
        </>
      ),
      size: 400,
      filterable: false,
    },
  ];

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className={className}
        overlayClassName={overlayClassName}
      >
        <div
          className="w-full h-full flex flex-col justify-start items-center gap-1"
          dir="rtl"
        >
          <div className="w-full flex justify-center items-center gap-2">
            <div className="w-1/2 flex justify-start items-center gap-2">
              <motion.button
                onClick={() => setSelectedTab("inActiveBranch")}
                className={`py-2 px-4 relative ${
                  selectedTab === "inActiveBranch"
                    ? "text-black"
                    : "text-gray-600"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                شعبات غیرفعال
                {selectedTab === "inActiveBranch" && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-0 w-full h-[3px]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => setSelectedTab("wrongEventFormat")}
                className={`py-2 px-4 relative ${
                  selectedTab === "wrongEventFormat"
                    ? "text-black"
                    : "text-gray-600"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                رویدادهای فرمت اشتباه
                {selectedTab === "wrongEventFormat" && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-0 w-full h-[3px]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            </div>
            <div className="w-1/2 flex justify-end items-center">
              <span
                className="cursor-pointer hover:text-red-600 transition-all"
                onClick={onClose}
              >
                <IoMdClose size={28} />
              </span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {selectedTab === "inActiveBranch" ? (
              <>
                <motion.div
                  key="branches"
                  className="w-full flex flex-col"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-full flex justify-start items-center gap-2 flex-row-reverse">
                    <select
                      value={hour}
                      onChange={(e) => setHour(+e.target.value)}
                      className="border border-gray-600 rounded-md p-2 text-sm outline-none"
                    >
                      {[12, 24, 48, 72].map((v) => (
                        <option key={v} value={v}>
                          {v} ساعت اخیر
                        </option>
                      ))}
                    </select>

                    <select
                      value={filterAction}
                      onChange={(e) => setFilterAction(e.target.value as any)}
                      className="border border-gray-600 rounded-md p-2 text-sm outline-none"
                    >
                      <option value="ALL">همه</option>
                      <option value="ACTIVE">مسلح</option>
                      <option value="INACTIVE">غیر مسلح</option>
                      <option value="BOTH">مسلح و غیر مسلح</option>
                    </select>
                    <span>رویداد مورد نظر: </span>
                  </div>

                  <div className="w-full mt-2 overflow-hidden rounded">
                    {/* Branches table */}
                    <EventTable<BranchAll>
                      data={branches}
                      columns={branchColumn as MyColumnDef<BranchAll>[]}
                      isLoading={isLoadingBranches}
                      bodyHeight="max-h-[62vh]"
                      className="w-full"
                    />
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  className="w-full h-auto overflow-hidden rounded-md"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventTable<WrongFormatRow>
                    data={rows}
                    columns={wrongFormatColumn}
                    isLoading={isLoading}
                    bodyHeight="max-h-[66vh]"
                    className="w-full"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </ReactModal>
    </>
  );
};

export default InActiveBranchModal;

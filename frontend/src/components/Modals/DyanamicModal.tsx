import ReactModal from "react-modal";
import type { ColumnDef } from "@tanstack/react-table";
import EventTable from "../Table/EventTable";
import Pagination from "../Paginations/Paginations";
import Button from "../Button";
import { RequirePermission } from "../RequirePermission/RequirePermission";
ReactModal.setAppElement("#root");

interface DynamicModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title?: string;
  overlayClassName?: string;
  dataTable?: T[];
  columns?: ColumnDef<T>[];
  loading?: boolean;
  currentPage?: number;
  buttonTitle?: string | null;
  reciveButtonTitle?: string;
  onClickButton?: () => void;
  pageSize?: number;
  totalItems?: number;
  onPageSizeChange?: (page: number) => void;
  onPageChange?: (page: number) => void;
  modelName?: string;
}

interface Identifiable {
  id: number | string;
}

export default function DynamicModal<T extends Identifiable>({
  isOpen,
  onClose,
  className,
  overlayClassName,
  title,
  dataTable,
  columns,
  loading,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onClickButton,
  buttonTitle,
  reciveButtonTitle,
  modelName,
}: DynamicModalProps<T>) {
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
          <div className="w-full flex justify-between items-center">
            <h2 className="w-full text-right font-semibold text-lg">{title}</h2>
            {buttonTitle != null && (
              <>
                <div className="flex justify-end items-center gap-1">
                  <Button
                  // onClick={onClickButton}
                  className="text-nowrap px-3 py-2 text-white bg-btns hover:text-[#09a1a4] hover:border-[#09a1a4] hover:bg-transparent transition-all"
                >
                  {reciveButtonTitle ?? "دریافت اطلاعات"}
                </Button>
                <RequirePermission perm={`${modelName}:create`}>
                  <Button
                    onClick={onClickButton}
                    className="text-nowrap px-3 py-2 text-white bg-btns hover:text-[#09a1a4] hover:border-[#09a1a4] hover:bg-transparent transition-all"
                  >
                    {buttonTitle}
                  </Button>
                </RequirePermission>
                </div>
              </>
            )}
          </div>
          <div className="w-full h-full flex-col overflow-hidden rounded">
            <EventTable
              data={dataTable ?? []}
              columns={columns ?? []}
              isLoading={loading}
              bodyHeight="max-h-[60vh]"
            />
          </div>
          <div className="w-full h-fit">
            <Pagination
              currentPage={currentPage ?? 1}
              pageSize={pageSize ?? 10}
              totalItems={totalItems ?? 0}
              onPageChange={onPageChange ?? (() => {})}
              onPageSizeChange={onPageSizeChange ?? (() => {})}
            />
          </div>
        </div>
      </ReactModal>
    </>
  );
}

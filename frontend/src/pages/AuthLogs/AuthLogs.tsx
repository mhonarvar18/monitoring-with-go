import { useState, useMemo } from "react";
import EventTable from "../../components/Table/EventTable";
import Pagination from "../../components/Paginations/Paginations";
import { useAuthLogs, useExportAuthLogs } from "../../hooks/useAuthLog";
import { authLogColumns } from "../../components/Columns/AuthLogColumn";
import Button from "../../components/Button";
import { FiDownload } from "react-icons/fi";
import ExportFileModal from "../../components/Modals/ExportFileModal";
import { fetchAuthLogs, type AuthLog } from "../../services/authLog.service";
import type { TableColumn } from "../../services/TablePdfDocumnet";
import authLogPdfColumn from "../../components/Columns/AuthLofPdfColumn";
import { getPdfColumns } from "../../utils/PdfUtils";

const AuthLogs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);

  const { logs, totalPages, loading } = useAuthLogs(page, limit);
  const fetchAllAuthLogs = async (): Promise<AuthLog[]> => {
    try {
      const firstPageResponse = await fetchAuthLogs(1, limit);
      const totalPagesCount = firstPageResponse.data.totalPages;
      if (totalPagesCount === 1) {
        return firstPageResponse.data.authLogs;
      }
      const pagePromises: Promise<any>[] = [Promise.resolve(firstPageResponse)];
      for (let pageNum = 2; pageNum <= totalPagesCount; pageNum++) {
        pagePromises.push(fetchAuthLogs(pageNum, limit));
      }
      const allPagesResponses = await Promise.all(pagePromises);
      const allLogs: AuthLog[] = allPagesResponses.reduce((acc, response) => {
        return [...acc, ...response.data.authLogs];
      }, []);
      // console.log(allLogs)
      return allLogs;
    } catch (error) {
      console.error("Error fetching all auth logs:", error);
      throw error;
    }
  };
  const handlePdfExport = async (): Promise<AuthLog[]> => {
    return await fetchAllAuthLogs();
  };
  const handleExcelExport = async (): Promise<AuthLog[]> => {
    return await fetchAllAuthLogs();
  };
  const columns = useMemo(() => authLogColumns, []);

  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-2xl">
            {/* ─── Page header (title + buttons) ─── */}
            <div className="w-full">
              <div className="w-full flex items-center justify-between px-6 py-3">
                <h1 className="text-2xl font-semibold">لاگ های ورود و خروج</h1>
                <div className="flex justify-between items-center gap-2">
                  <Button 
                    onClick={() => setOpenExportModal(true)}
                    className="bg-btns 2xl:py-0 h-10 2xl:px-2 text-white border-0 flex justify-center items-center gap-2">
                    <span>دریافت فایل</span>
                    <span>
                      <FiDownload size={20} />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full h-full flex flex-col">
              <EventTable
                columns={columns}
                data={logs}
                isLoading={loading}
                bodyHeight="max-h-[74vh]"
              />
            </div>
            <div className="w-full">
              <Pagination
                currentPage={page}
                pageSize={limit}
                totalItems={totalPages}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(sz) => {
                  setLimit(sz);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {openExportModal && (
        <ExportFileModal
          isOpen
          onClose={() => {
            setOpenExportModal(false);
          }}
          onPdfExport={handlePdfExport}
          onExcelExport={handleExcelExport}
          pdfColumns={authLogPdfColumn}
          pdfTitle="لاگ های ورود و خروج"
          iconUrl="/kesh.png"
        />
      )}
    </>
  );
};

export default AuthLogs;

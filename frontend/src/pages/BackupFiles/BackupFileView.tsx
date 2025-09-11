import React, { useEffect, useState } from "react";
import EventTable from "../../components/Table/EventTable";
import Pagination from "../../components/Paginations/Paginations";
import { FaDatabase } from "react-icons/fa6";
import { useBackupFileData } from "../../hooks/useBackupEvents";
import { eventColumns } from "../../components/Columns/EventColumns";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { Event as AppEvent } from "../../types/Event";
import moment from "moment-jalaali";

type BackupFileViewProps = {
  fileName: string;
  onBack: () => void;
};

type EnrichedEvent = AppEvent & {
  alarmColor: string;
  audioUrl: string | null;
};

const PAGE_SIZE = 20;

const BackupFileView: React.FC<BackupFileViewProps> = ({
  fileName,
  onBack,
}) => {
  const [page, setPage] = useState(1);
  const { data, pagination, loading, error, fetchFileData } =
    useBackupFileData();

  useEffect(() => {
    if (fileName) {
      fetchFileData({
        fileName,
        page,
        limit: PAGE_SIZE,
      });
    }
  }, [fileName, page, fetchFileData]);

  const handleCreate = (row: any) => {
    return;
  };
  const formatFileName = (fileName: string) => {
    // Remove .json extension
    const nameWithoutExtension = fileName.replace(".json", "");

    // Extract date and time from filename like "backup-2025-06-11_00-00-00-849"
    const match = nameWithoutExtension.match(
      /backup-(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})-(\d+)/
    );

    if (match) {
      const [, date, time, id] = match;

      // Convert to moment object
      const endDate = moment(date, "YYYY-MM-DD");
      const startDate = endDate.clone().subtract(10, "days");

      // Format to Jalaali
      const formattedStartDate = startDate.format("jYYYY/jMM/jDD");
      const formattedEndDate = endDate.format("jYYYY/jMM/jDD");
      const formattedTime = time.replace(/-/g, ":");

      return {
        displayName: `${formattedStartDate} - ${formattedEndDate}`,
        date: formattedEndDate,
        time: formattedTime,
        id: id,
      };
    }

    return {
      displayName: nameWithoutExtension,
      date: "نامشخص",
      time: "نامشخص",
      id: "N/A",
    };
  };
  const columns = eventColumns({
    onCreate: handleCreate,
    currentPage: pagination?.page || page,
    pageSize: pagination?.limit || PAGE_SIZE,
    totalRecords: pagination?.total || 0,
  });
  const fileInfo = formatFileName(fileName);
  return (
    <div className="w-full h-full font-[iransans] flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
            <FaDatabase className="text-white text-lg" />
          </div>
          <span className="text-base font-bold text-gray-700 break-all">
            {fileInfo.displayName}
          </span>
        </div>
        <button
          className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-200 transition"
          onClick={onBack}
        >
          بازگشت
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full p-6 bg-white rounded-b-2xl">
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-60">{error}</div>
        ) : (
          <>
            <EventTable<EnrichedEvent>
              columns={columns}
              data={(data as EnrichedEvent[]) || []}
              isLoading={loading}
              bodyHeight="max-h-[60vh]"
            />
            <div className="mt-4">
              <Pagination
                currentPage={pagination?.page || 1}
                pageSize={pagination?.limit || PAGE_SIZE}
                totalItems={pagination?.total || 0}
                onPageChange={setPage}
                showRowPage={false}
                onPageSizeChange={(size) => {
                  setPage(1);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BackupFileView;

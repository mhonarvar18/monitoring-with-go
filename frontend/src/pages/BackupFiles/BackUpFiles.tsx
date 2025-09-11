import { useEffect, useMemo, useState } from "react";
import { useBackupFileList } from "../../hooks/useBackupEvents";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDatabase,
  FaDownload,
  FaEye,
  FaClock,
  FaCalendar,
  FaFilter,
} from "react-icons/fa6";
import LoadingSpinner from "../../components/LoadingSpinner";
import moment from "moment-jalaali";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toPersianDigits } from "../../utils/numberConvert";
import BackupFileView from "./BackupFileView";
import { fetchBackupFileData } from "../../services/backup.service";
import { downloadTableExcel } from "../../services/downloadTableExcel.service";
import { getPdfColumns, getPdfRows } from "../../utils/PdfUtils";
import { pdfEventsColumns } from "../../components/Columns/PdfEventsColumns";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../types/stylesToast";
import type { BackupFileDataResponse } from "../../services/backup.service";

const BackupFiles: React.FC = () => {
  const { data, loading, error, fetchFileList } = useBackupFileList();
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    fetchFileList();
  }, [fetchFileList]);

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

  const filteredData = useMemo(() => {
    if (!data || !selectedDate) return data;

    const selectedMoment = moment(selectedDate.toDate());

    return data.filter((fileName) => {
      const match = fileName.match(
        /backup-(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})-(\d+)/
      );
      if (!match) return false;

      const [, date] = match;
      const backupDate = moment(date, "YYYY-MM-DD");
      const startRange = backupDate.clone().subtract(10, "days");
      const endRange = backupDate;

      // Check if selected date falls within the 10-day range of this backup
      return selectedMoment.isBetween(startRange, endRange, "day", "[]");
    });
  }, [data, selectedDate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const handleDownloadExcel = async (fileName: string) => {
    await toast.promise(
      (async () => {
        // 1. Fetch the first page
        const firstPageRes = await fetchBackupFileData({
          fileName,
          page: 1,
          limit: 100,
        });
        const { totalPages, data: firstData } = {
          totalPages: firstPageRes.data.totalPages,
          data: firstPageRes.data.data,
        };

        let allData = [...firstData];

        // 2. If there are more pages, fetch them
        const requests: Promise<BackupFileDataResponse>[] = [];
        for (let p = 2; p <= totalPages; p++) {
          requests.push(fetchBackupFileData({ fileName, page: p, limit: 100 }));
        }
        if (requests.length > 0) {
          const results = await Promise.all(requests);
          results.forEach((res) => {
            allData.push(...res.data.data);
          });
        }

        // 3. Export as Excel
        downloadTableExcel({
          columns: getPdfColumns(pdfEventsColumns),
          data: getPdfRows(allData, pdfEventsColumns),
          fileName: `${fileName.replace(".json", "")}.xlsx`,
        });
      })(),
      {
        loading: <span>در حال آماده‌سازی خروجی اکسل...</span>,
        success: <span>فایل اکسل با موفقیت دانلود شد.</span>,
        error: <span>خطا در خروجی گرفتن فایل بکاپ!</span>,
      }
    );
  };

  return (
    <>
      <div className="w-full h-full font-[iransans]" dir="rtl">
        <div className="w-full h-full lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
          <div className="w-full h-full flex flex-col justify-start items-center bg-white rounded-2xl p-6">
            {selectedFile ? (
              <>
                <BackupFileView
                  fileName={selectedFile}
                  onBack={() => setSelectedFile(null)}
                />
              </>
            ) : (
              <>
                {/* Header Section */}
                <div className="w-full mb-8">
                  <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaDatabase className="text-white text-2xl" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">
                          فایل‌های پشتیبان
                        </h1>
                        <p className="text-gray-600">
                          مدیریت و مشاهده فایل‌های پشتیبان پنل رویداد
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFilter className="text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">
                        فیلتر تاریخ:
                      </span>
                      <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        calendar={persian}
                        locale={persian_fa}
                        placeholder="انتخاب تاریخ"
                        inputClass="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        containerClassName="w-48"
                        calendarPosition="bottom-right"
                      />
                      {selectedDate && (
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-full transition-colors"
                        >
                          پاک کردن
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats Section */}
                  {filteredData && (
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <FaDatabase className="text-teal-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              {selectedDate
                                ? "فایل‌های فیلتر شده"
                                : "تعداد کل فایل‌های پشتیبان"}
                            </p>
                            <p className="text-2xl font-bold text-teal-600">
                              {toPersianDigits(filteredData.length.toString())}{" "}
                              فایل
                            </p>
                            {selectedDate && data && (
                              <p className="text-xs text-gray-500">
                                از مجموع{" "}
                                {toPersianDigits(data.length.toString())} فایل
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-teal-500 opacity-20">
                          <FaDatabase size={48} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="w-full flex-1 overflow-y-auto">
                  {loading && (
                    <div className="w-full h-64 flex items-center justify-center">
                      <div className="text-center">
                        <LoadingSpinner />
                        <p className="text-gray-600 mt-4">
                          در حال بارگذاری فایل‌های پشتیبان...
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="w-full h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaDatabase className="text-red-500 text-xl" />
                        </div>
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                          onClick={fetchFileList}
                          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          تلاش مجدد
                        </button>
                      </div>
                    </div>
                  )}

                  {!loading &&
                    !error &&
                    filteredData &&
                    filteredData.length === 0 &&
                    selectedDate && (
                      <div className="w-full h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaFilter className="text-yellow-500 text-xl" />
                          </div>
                          <p className="text-gray-600 mb-2">
                            فایل بکاپی برای تاریخ انتخاب شده یافت نشد
                          </p>
                          <button
                            onClick={() => setSelectedDate(null)}
                            className="text-sm text-teal-600 hover:text-teal-700 underline"
                          >
                            مشاهده همه فایل‌ها
                          </button>
                        </div>
                      </div>
                    )}

                  {!loading && !error && data && data.length === 0 && (
                    <div className="w-full h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaDatabase className="text-gray-400 text-xl" />
                        </div>
                        <p className="text-gray-600">هیچ فایل بکاپی یافت نشد</p>
                      </div>
                    </div>
                  )}

                  {!loading &&
                    !error &&
                    filteredData &&
                    filteredData.length > 0 && (
                      <AnimatePresence>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                          {filteredData.map((fileName, index) => {
                            const fileInfo = formatFileName(fileName);

                            return (
                              <motion.div
                                key={fileName}
                                variants={itemVariants}
                                className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-teal-200 overflow-hidden"
                              >
                                {/* Background Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Content */}
                                <div className="relative z-10">
                                  {/* Header */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                      <FaDatabase className="text-white text-lg" />
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full font-medium">
                                        فایل #
                                        {toPersianDigits(
                                          (index + 1).toString()
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                                    {fileInfo.displayName}
                                  </h3>

                                  {/* Info */}
                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FaCalendar className="text-teal-500" />
                                      <span>
                                        تاریخ: {toPersianDigits(fileInfo.date)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FaClock className="text-green-500" />
                                      <span>
                                        زمان: {toPersianDigits(fileInfo.time)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setSelectedFile(fileName)}
                                      className="flex-1 flex items-center justify-center gap-2 bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 transition-colors text-sm"
                                    >
                                      <FaEye />
                                      مشاهده
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDownloadExcel(fileName)
                                      }
                                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                    >
                                      <FaDownload />
                                    </button>
                                  </div>
                                </div>

                                {/* Decorative Element */}
                                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-teal-500/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BackupFiles;

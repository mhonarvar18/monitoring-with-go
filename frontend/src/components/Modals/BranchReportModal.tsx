// components/Modals/BranchReportModal.tsx
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useBranchReport } from "../../hooks/useBranchReport";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { toPersianDigits } from "../../utils/numberConvert";
import { FaBuilding, FaChartBar, FaLocationPin } from "react-icons/fa6";
import { MdNotificationImportant } from "react-icons/md";

interface BranchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationType: string;
  parentId: string | number;
  branchId: string | number;
}

const BranchReportModal: React.FC<BranchReportModalProps> = ({
  isOpen,
  onClose,
  locationType,
  parentId,
  branchId,
}) => {
  const { data, loading, error, fetchReport } = useBranchReport();
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "details"
  >("overview");
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isOpen && locationType && parentId && branchId) {
      fetchReport({ locationType, parentId, branchId });
      setAnimationClass("animate-pulse");
      setTimeout(() => setAnimationClass(""), 2000);
    }
  }, [isOpen, locationType, parentId, branchId, fetchReport]);

  const chartData =
    data && Array.isArray(data.alarm)
      ? data.alarm.map((a) => ({
          label: a.label,
          count: a.count,
          total: a.total,
          percentage: a.total > 0 ? Math.round((a.count / a.total) * 100) : 0,
        }))
      : [];

  const pieData = chartData.map((item, index) => ({
    name: item.label,
    value: item.count,
    color: index % 2 === 0 ? "#003C78" : "rgb(9, 161, 164)",
  }));

  const radialData = chartData.map((item, index) => ({
    name: item.label,
    value: item.percentage,
    fill: index % 2 === 0 ? "#003C78" : "rgb(9, 161, 164)",
  }));

  const COLORS = [
    "linear-gradient(135deg, #003C78 0%, #002857 100%)",
    "linear-gradient(135deg, rgb(9, 161, 164) 0%, rgb(7, 130, 132) 100%)",
    "linear-gradient(135deg, #003C78 20%, rgb(9, 161, 164) 80%)",
    "linear-gradient(135deg, rgb(9, 161, 164) 20%, #003C78 80%)",
    "linear-gradient(135deg, #003C78 0%, rgb(9, 161, 164) 50%, #003C78 100%)",
    "linear-gradient(135deg, rgb(9, 161, 164) 0%, #003C78 50%, rgb(9, 161, 164) 100%)",
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-white/20 rounded-2xl shadow-2xl">
          <p className="font-bold text-gray-800 mb-2 text-lg">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {entry.name}: <span className="font-bold">{toPersianDigits(entry.value)}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    gradient,
    delay = 0,
  }: any) => (
    <div
      className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animationClass}`}
      style={{
        background: gradient,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-6 h-6 bg-white/30 rounded-full animate-pulse" />
          </div>
        </div>
        <h3 className="text-white/90 text-sm font-medium mb-2">{title}</h3>
        <p className="text-white text-3xl font-bold mb-1">{toPersianDigits(value)}</p>
        {subtitle && <p className="text-white/70 text-xs">{toPersianDigits(subtitle)}</p>}
      </div>
    </div>
  );

  const TabButton = ({ tab, label, isActive, onClick }: any) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
        isActive ? "text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
      }`}
      style={{
        background: isActive
          ? "linear-gradient(135deg, #003C78 0%, rgb(9, 161, 164) 100%)"
          : "transparent",
        boxShadow: isActive ? "0 10px 25px rgba(0, 60, 120, 0.3)" : "none",
      }}
    >
      {label}
    </button>
  );

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="گزارش رویداد شعبه"
      ariaHideApp={false}
      overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-4 w-[95%] max-w-7xl h-[95%] max-h-[900px] font-[iransans] rtl outline-none shadow-2xl border border-white/20"
    >
      <div className="w-full flex flex-col h-full justify-start items-center gap-7" dir="rtl">
        {/* Glassmorphism Header */}
        <div
          className="w-full min-h-fit relative rounded-3xl p-6 overflow-hidden flex justify-center items-center"
          style={{
            background:
              "linear-gradient(135deg, #003C78 0%, rgb(9, 161, 164) 100%)",
          }}
        >
          <div className="w-full relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm text-3xl">
                <span className="mt-2">📊</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  گزارش تحلیلی شعبه
                </h2>
                <p className="text-white/80 text-sm">
                  آمار و تحلیل جامع رویدادها
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-2 shadow-lg border border-white/20">
            <TabButton
              tab="overview"
              label="نمای کلی"
              isActive={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <TabButton
              tab="analytics"
              label="تحلیل داده‌ها"
              isActive={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            />
            <TabButton
              tab="details"
              label="جزئیات"
              isActive={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div
                  className="w-20 h-20 border-4 border-t-4 rounded-full animate-spin mx-auto mb-6"
                  style={{
                    borderColor: "rgba(9, 161, 164, 0.3)",
                    borderTopColor: "#003C78",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-8 h-8 rounded-full animate-pulse"
                    style={{ backgroundColor: "rgb(9, 161, 164)" }}
                  />
                </div>
              </div>
              <p className="text-gray-600 font-medium text-lg">
                در حال پردازش اطلاعات...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-3xl p-8 text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-700 mb-2">
                خطا در دریافت اطلاعات
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {data && !loading && (
          <div className="w-full h-full">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="w-full h-full flex flex-col justify-start items-center gap-10">
                {/* Statistics Cards */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="نام شعبه"
                    value={data.name}
                    icon={<FaBuilding color="FFF"/>}
                    gradient={COLORS[0]}
                    delay={0}
                  />
                  <StatCard
                    title="کد شعبه"
                    value={toPersianDigits(data.code)}
                    icon="🏷️"
                    gradient={COLORS[1]}
                    delay={200}
                  />
                  <StatCard
                    title="کل رویدادها"
                    value={toPersianDigits(data.totalEvents)}
                    subtitle="تعداد کل"
                    icon={<FaChartBar color="FFF"/>}
                    gradient={COLORS[2]}
                    delay={400}
                  />
                  <StatCard
                    title="تایید نشده"
                    value={toPersianDigits(data.unConfirmAlarms)}
                    subtitle="رویداد"
                    icon={<MdNotificationImportant color="FFF"/>}
                    gradient={COLORS[3]}
                    delay={600}
                  />
                </div>

                {/* Address Card */}
                <div
                  className="w-full rounded-3xl p-6 border shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0, 60, 120, 0.1) 0%, rgba(9, 161, 164, 0.1) 100%)",
                    borderColor: "rgba(0, 60, 120, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #003C78 0%, rgb(9, 161, 164) 100%)",
                      }}
                    >
                      <span className="text-white text-xl">
                        <FaLocationPin />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      آدرس شعبه
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {toPersianDigits(data.address)}
                  </p>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="h-full">
                {chartData.length > 0 ? (
                  <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Bar Chart */}
                    <div className="col-span-2 bg-white/70 backdrop-blur-md h-full rounded-3xl p-4 border border-white/20">
                      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        نمودار میله‌ای
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient
                                id="countGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#003C78"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#002857"
                                  stopOpacity={1}
                                />
                              </linearGradient>
                              <linearGradient
                                id="totalGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="rgb(9, 161, 164)"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="rgb(7, 130, 132)"
                                  stopOpacity={1}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                              dataKey="count"
                              fill="url(#countGradient)"
                              radius={[0, 0, 8, 8]}
                              maxBarSize={50}
                              stackId="a"
                            />
                            <Bar
                              dataKey="total"
                              fill="url(#totalGradient)"
                              radius={[8, 8, 0, 0]}
                              maxBarSize={50}
                              stackId="a"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 text-center">
                    <div className="text-8xl mb-6">📊</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      هیچ داده‌ای یافت نشد
                    </h3>
                    <p className="text-gray-500 text-lg">
                      در حال حاضر آماری برای نمایش وجود ندارد
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="w-full max-h-[86%] overflow-y-auto">
                {chartData.length > 0 ? (
                  <div className="w-full grid gap-4 px-2">
                    {chartData.map((item, index) => (
                      <div
                        key={index}
                        className="backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                        style={{
                          background: COLORS[index % COLORS.length],
                        }}
                      >
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                              <span className="text-xl">📋</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">
                                {item.label}
                              </h3>
                              <p className="text-white/80">نوع رویداد</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">
                              {toPersianDigits(item.count)}
                            </div>
                            <div className="text-sm text-white/80">
                              از {toPersianDigits(item.total)} کل
                            </div>
                            <div className="text-sm font-medium">
                              {toPersianDigits(item.percentage)}% تایید نشده
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-3xl p-12 text-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0, 60, 120, 0.1) 0%, rgba(9, 161, 164, 0.1) 100%)",
                    }}
                  >
                    <div className="text-8xl mb-6">📝</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      جزئیات موجود نیست
                    </h3>
                    <p className="text-gray-500 text-lg">
                      اطلاعات تفصیلی برای نمایش وجود ندارد
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default BranchReportModal;

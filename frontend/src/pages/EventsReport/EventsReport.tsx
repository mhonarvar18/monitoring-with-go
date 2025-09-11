import { FaChartBar } from "react-icons/fa";
import Select from "../../components/Select/Select";
import { useState, useEffect } from "react";
import { useEventReport } from "../../hooks/useEventReport";
import { useLocationsByType } from "../../hooks/useLocationsByType";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";
import { IoMdAlert } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type {
  EventReportItem,
  LocationType,
} from "../../services/EventReport.service";
import type {
  EventReportItem as EREventItem,
  AlarmItem as ERAlarmItem,
} from "../../services/EventReport.service";
// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportOptions = [
  { value: "STATE", label: "کشوری" },
  { value: "CITY", label: "استانی" },
];

const alarmColors = [
  {
    id: "color1",
    gradient: { start: "#FF6B6B", end: "#FF8E88" },
    solid: "#FF6B6B",
  },
  {
    id: "color2",
    gradient: { start: "#4ECDC4", end: "#6FE0D8" },
    solid: "#4ECDC4",
  },
  {
    id: "color3",
    gradient: { start: "#45B7D1", end: "#67C5E8" },
    solid: "#45B7D1",
  },
  {
    id: "color4",
    gradient: { start: "#96CEB4", end: "#A8D8C4" },
    solid: "#96CEB4",
  },
  {
    id: "color5",
    gradient: { start: "#FECA57", end: "#FFD670" },
    solid: "#FECA57",
  },
  {
    id: "color6",
    gradient: { start: "#FF9FF3", end: "#FFB3F7" },
    solid: "#FF9FF3",
  },
  {
    id: "color7",
    gradient: { start: "#A8E6CF", end: "#BFF0D4" },
    solid: "#A8E6CF",
  },
  {
    id: "color8",
    gradient: { start: "#FFB347", end: "#FFC166" },
    solid: "#FFB347",
  },
];

// Fake data generator for testing
export const generateFakeProvinceData = (): EventReportItem[] => {
  const iranianProvinces = [
    "تهران",
    "اصفهان",
    "خراسان رضوی",
    "فارس",
    "خوزستان",
    "مازندران",
    "گیلان",
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "کرمان",
    "سیستان و بلوچستان",
    "هرمزگان",
    "لرستان",
    "کردستان",
    "همدان",
    "زنجان",
    "یزد",
    "قم",
    "سمنان",
    "قزوین",
    "گلستان",
    "اردبیل",
    "بوشهر",
    "ایلام",
    "چهارمحال و بختیاری",
    "کهگیلویه و بویراحمد",
    "خراسان شمالی",
    "خراسان جنوبی",
    "البرز",
    "مرکزی",
  ];

  const alarmTypes: Array<Pick<ERAlarmItem, "id" | "code" | "label">> = [
    { id: "3d3ef23e-7bda-47f4-a45c-4757ef7446a2", code: 1, label: "حریق" },
    { id: "52a6d5e6-ee3e-4f62-9283-ea3e38701938", code: 4, label: "مسلح" },
    { id: "46dafa4f-34d7-46de-ae20-0d10ecca7678", code: 5, label: "غیر مسلح" },
    { id: "fa5acdc5-c913-4ef3-978f-947c8192c020", code: 3, label: "پدال" },
    { id: "b8c9d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e", code: 2, label: "سرقت" },
    { id: "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6", code: 6, label: "تصادف" },
    { id: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9", code: 7, label: "خشونت" },
  ];

  const makeUuid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `uuid-${Math.random().toString(36).slice(2)}-${Date.now()}`;

  return iranianProvinces.map((province): EventReportItem => {
    // 3–5 random alarm types for each province
    const numAlarms = Math.floor(Math.random() * 3) + 3;
    const selectedAlarms = [...alarmTypes]
      .sort(() => Math.random() - 0.5)
      .slice(0, numAlarms);

    const alarms: ERAlarmItem[] = selectedAlarms.map((alarmType) => {
      const count = Math.floor(Math.random() * 100) + 1; // 1..100
      const total = count + Math.floor(Math.random() * 20); // slightly higher than count
      return {
        id: alarmType.id,
        total,
        code: alarmType.code,
        label: alarmType.label,
        count,
      };
    });

    const totalEvents = alarms.reduce((sum, a) => sum + a.count, 0);
    const unConfirmAlarms = Math.floor(
      totalEvents * (0.3 + Math.random() * 0.4)
    ); // 30–70%

    return {
      id: makeUuid(),
      label: `استان ${province}`,
      parentId: "fe157114-975f-421f-8bab-2f3268d5ad45",
      type: "STATE",
      unConfirmAlarms,
      totalEvents,
      alarm: alarms,
      deletedAt: null,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    } satisfies EventReportItem;
  });
};

const EventsReport: React.FC = () => {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationType>("STATE");
  const [selectedState, setSelectedState] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [useFakeData, setUseFakeData] = useState<boolean>(false);

  // hook (v5-safe). We init empty; we call fetchReport imperatively below.
  const { data: apiData, loading, fetchReport } = useEventReport();

  // choose data source (type to EventReportItem[])
  const data: EventReportItem[] =
    useFakeData && selectedLocation === "STATE"
      ? (generateFakeProvinceData() as EventReportItem[])
      : apiData ?? [];

  // first load for STATE (do NOT include fetchReport in deps)
  useEffect(() => {
    if (selectedLocation === "STATE" && !useFakeData) {
      void fetchReport({ locationType: "STATE" });
    }
  }, [selectedLocation, useFakeData]);

  const { data: locations } = useLocationsByType("STATE");

  const handleLocationChange = (value: LocationType) => {
    setSelectedLocation(value);
    if (value === "STATE") {
      setSelectedState(null);
      if (!useFakeData) {
        void fetchReport({ locationType: "STATE" });
      }
    } else if (value === "CITY") {
      setSelectedState(null);
    }
  };

  const handleStateChange = (
    value: string,
    selectedOption: { value: string; label: string }
  ) => {
    setSelectedState({ id: value, label: selectedOption.label });
    void fetchReport({ locationType: "CITY", parentId: value });
  };

  const transformDataForChart = (rows: EventReportItem[]) => {
    const allAlarms = new Set<string>();
    const filtered = rows.filter(
      (item) => Array.isArray(item.alarm) && item.alarm.length > 0
    );

    filtered.forEach((item) =>
      item.alarm.forEach((a) => allAlarms.add(a.label))
    );
    const alarmLabels = Array.from(allAlarms);

    return {
      chartData: filtered.map((item) => {
        const obj: Record<string, number | string> = { label: item.label };
        alarmLabels.forEach((label) => {
          const a = item.alarm.find((x) => x.label === label);
          obj[label] = a ? a.count : 0;
        });
        return obj;
      }),
      alarmLabels,
    };
  };

  const { chartData, alarmLabels } = transformDataForChart(data);

  const chartDataConfig = {
    labels: chartData.map((d) => d.label as string),
    datasets: alarmLabels.map((label, i) => ({
      label,
      data: chartData.map((d) => Number(d[label] ?? 0)),
      backgroundColor: alarmColors[i % alarmColors.length].solid,
      borderColor: alarmColors[i % alarmColors.length].solid,
      borderWidth: 2,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { font: { family: "iransans" } },
      },
      tooltip: {
        bodyFont: { family: "iransans" },
        callbacks: {
          label: (ti: any) => ti.dataset.label + ": " + ti.raw,
        },
      },
    },
    scales: {
      x: { ticks: { font: { family: "iransans" } } },
      y: { ticks: { font: { family: "iransans" } } },
    },
    locale: "fa-IR",
  };

  const FamousStatesSection = () => {
    const getTopItems = () => {
      if (!data.length) return [];
      return data
        .filter((item) => item.totalEvents > 0)
        .sort((a, b) => b.totalEvents - a.totalEvents)
        .slice(0, 4);
    };

    const topItems = getTopItems();

    const toPersianNumbers = (num: number) =>
      num
        .toString()
        .replace(
          /\d/g,
          (d) =>
            ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][parseInt(d, 10)]
        );

    const getChangePercent = (totalEvents: number) =>
      Math.floor((totalEvents % 20) - 10);

    const getChangeBadge = (changePercent: number) => {
      if (changePercent > 0)
        return {
          className:
            "text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full",
          text: `+${toPersianNumbers(Math.abs(changePercent))}٪`,
        };
      if (changePercent < 0)
        return {
          className: "text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full",
          text: `-${toPersianNumbers(Math.abs(changePercent))}٪`,
        };
      return {
        className:
          "text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full",
        text: `±${toPersianNumbers(0)}٪`,
      };
    };

    const getCardConfig = (index: number) => {
      const configs = [
        {
          gradient: "from-blue-50 to-blue-100/50",
          iconGradient: "from-blue-500 to-blue-600",
          decorative: "bg-blue-500/10",
        },
        {
          gradient: "from-purple-50 to-purple-100/50",
          iconGradient: "from-purple-500 to-purple-600",
          decorative: "bg-purple-500/10",
        },
        {
          gradient: "from-green-50 to-green-100/50",
          iconGradient: "from-green-500 to-green-600",
          decorative: "bg-green-500/10",
        },
        {
          gradient: "from-orange-50 to-orange-100/50",
          iconGradient: "from-orange-500 to-orange-600",
          decorative: "bg-orange-500/10",
        },
      ];
      return configs[index % configs.length];
    };

    if (!topItems.length) return null;

    return (
      <div className="w-full h-auto famous-states">
        <div className="w-full mb-2">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {selectedLocation === "STATE" && <>استان‌های پربازدید</>}
            {selectedLocation === "CITY" && selectedState && (
              <>شهرهای پربازدید {selectedState.label}</>
            )}
          </h3>
          <p className="text-gray-600 text-sm">
            {selectedLocation === "STATE" && (
              <>آمار خلاصه رویدادهای مهم استان های کشور</>
            )}
            {selectedLocation === "CITY" && selectedState && (
              <>آمار خلاصه رویدادهای مهم {selectedState.label}</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topItems.map((item, index) => {
            const config = getCardConfig(index);
            const changePercent = getChangePercent(item.totalEvents);
            const changeBadge = getChangeBadge(changePercent);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${config.iconGradient} rounded-xl flex items-center justify-center`}
                    >
                      <FaChartBar className="text-white text-lg" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-medium">
                        کل رویداد ها
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {item.label}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {toPersianNumbers(item.totalEvents)}
                      </span>
                      <span className={changeBadge.className}>
                        {changeBadge.text}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        رویداد تایید نشده:{" "}
                        {toPersianNumbers(item.unConfirmAlarms)}
                      </span>
                      <span className="text-gray-600">
                        کل رویداد ها: {toPersianNumbers(item.totalEvents)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const NoDataMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl shadow-lg"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FiAlertTriangle className="text-gray-400 text-2xl" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {selectedLocation === "CITY" && !selectedState
          ? "لطفاً استان مورد نظر را انتخاب کنید"
          : "داده‌ای یافت نشد"}
      </h3>
      <p className="text-gray-500 text-sm text-center">
        {selectedLocation === "CITY" && !selectedState
          ? "برای مشاهده آمار شهرها، ابتدا استان مورد نظر خود را انتخاب کنید"
          : "هیچ رویدادی برای نمایش یافت نشد"}
      </p>
    </motion.div>
  );

  const shouldShowChart = () => {
    if (loading) return false;
    if (!data.length) return false;
    if (selectedLocation === "CITY" && !selectedState) return false;
    return true;
  };

  const shouldShowNoData = () => {
    if (loading) return false;
    if (selectedLocation === "CITY" && !selectedState) return true;
    if (!data.length) return true;
    const hasDataWithEvents = data.some(
      (item) =>
        (Array.isArray(item.alarm) && item.alarm.length > 0) ||
        item.totalEvents > 0
    );
    return !hasDataWithEvents;
  };

  return (
    <div
      className="w-full h-full lg:pt-2 lg:pb-3 gap-2 3xl:pt-3 px-2 font-[iransans] max-h-[99%] overflow-y-auto"
      dir="rtl"
    >
      <div className="w-full h-full flex flex-col justify-start items-center gap-4">
        {/* Header */}
        <div className="w-full min-h-fit rounded-3xl p-6 flex justify-center items-center bg-white">
          <div className="w-full flex justify-between items-center">
            <div className="w-full flex items-center gap-4">
              <div className="w-16 h-16 bg-black/30 rounded-2xl flex items-center justify-center backdrop-blur-sm text-3xl">
                <FaChartBar color="#FFF" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-black mb-1">
                  {selectedLocation === "STATE" ? (
                    <>آمار رویدادها به تفکیک استان</>
                  ) : selectedState ? (
                    <>آمار رویدادها به تفکیک {selectedState.label}</>
                  ) : (
                    <>آمار رویدادها</>
                  )}
                </h2>
                <p className="text-black/80 text-sm">
                  {selectedLocation === "STATE" ? (
                    <>نمودار میزان وقوع انواع هشدارها در استان‌های کشور</>
                  ) : selectedState ? (
                    <>
                      نمودار میزان وقوع انواع هشدار ها در شهرهای{" "}
                      {selectedState.label}
                    </>
                  ) : (
                    <>نمودار میزان وقوع انواع هشدار ها</>
                  )}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-end items-center gap-4">
              {selectedLocation === "STATE" && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">داده تست:</label>
                  <button
                    onClick={() => setUseFakeData(!useFakeData)}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      useFakeData
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {useFakeData ? "فعال" : "غیرفعال"}
                  </button>
                </div>
              )}
              <Select
                options={ReportOptions}
                value={selectedLocation}
                onChange={(v) => handleLocationChange(v as LocationType)} // 👈 cast here
                variant="outline"
              />
              <AnimatePresence mode="wait">
                {selectedLocation === "CITY" && (
                  <motion.div
                    key="state-select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.5,
                    }}
                    className="min-w-48"
                  >
                    <Select
                      options={
                        locations?.map((l: any) => ({
                          value: l.id,
                          label: l.label,
                        })) || []
                      }
                      value={
                        selectedState ? String(selectedState.id) : undefined
                      }
                      onChange={(value, selectedOption) =>
                        handleStateChange(value, selectedOption)
                      }
                      placeholder="انتخاب استان"
                      variant="outline"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-gray-600">در حال بارگذاری ...</p>
            </div>
          </div>
        )}

        {/* No Data */}
        {!loading && shouldShowNoData() && <NoDataMessage />}

        {/* Chart */}
        {!loading && shouldShowChart() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full"
          >
            <div className="w-full h-full rounded-3xl flex flex-col justify-between items-start gap-3">
              <FamousStatesSection />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full"
              >
                <div className="w-full h-full rounded-3xl flex flex-col justify-between items-start gap-3">
                  <div className="w-full h-full flex justify-center items-center bg-white shadow rounded-lg p-2">
                    <Bar data={chartDataConfig} options={chartOptions} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsReport;

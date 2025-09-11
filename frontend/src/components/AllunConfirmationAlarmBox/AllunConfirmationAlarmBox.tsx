import { PieChart, Pie, Cell } from "recharts";
import Button from "../Button";
import { useState } from "react";
import UnConfirmationModal from "../Modals/UnConfirmationModal";
import { refreshMap } from "../../lib/socket";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { toPersianDigits } from "../../utils/numberConvert";

interface AlarmDataItem {
  name: string;
  value: number;
  color?: string;
}

interface Props {
  alarmData: AlarmDataItem[];
  locationId?: string | number | null;
}

const colorMap: Record<string, string> = {
  حریق: "#F59E0B", // orange
  سرقت: "#B91C1C", // red
  بدال: "#3B82F6", // blue
  مسلح: "#10B981", // green
  "غیر مسلح": "#22C55E", // lighter green
};

const AllunConfirmationAlarmBox: React.FC<Props> = ({
  alarmData,
  locationId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const exclude = new Set(["مسلح", "غیرمسلح"]);
  const chartData = alarmData.filter((item) => !exclude.has(item.name));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <>
      <div className="w-full h-full bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-6">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-2xl font-black">آلارم های تایید نشده</h2>
          <RequirePermission perm="event:update">
            <Button
              className="w-[16%] h-fit bg-btns text-white border-0 flex justify-center items-center py-2"
              onClick={() => setModalOpen(true)}
            >
              <span>مشاهده</span>
            </Button>
          </RequirePermission>
        </div>
        <div className="w-full flex justify-between gap-[10%] items-center px-6">
          <div className="relative w-[200px] h-[200px]">
            <PieChart height={200} width={200}>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                cornerRadius={6}
              >
                {alarmData.map((item, i) => (
                  <Cell key={i} fill={colorMap[item.name] || "#CCCCCC"} />
                ))}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-black">
              {toPersianDigits(total)}
            </div>
          </div>

          {/* Category Labels */}
          <div className="w-1/3 flex flex-col items-start gap-2 text-right">
            {alarmData.map((item, i) => (
              <div
                key={i}
                className="w-full flex justify-between items-center gap-2"
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: colorMap[item.name] || "#CCCCCC",
                    }}
                  />
                  <span className="text-gray-800 font-semibold">
                    {item.name}
                  </span>
                </div>
                <span className="text-black font-semibold">{toPersianDigits(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {modalOpen && (
        <UnConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          locationId={locationId}
          success={() => refreshMap()}
        />
      )}
    </>
  );
};

export default AllunConfirmationAlarmBox;

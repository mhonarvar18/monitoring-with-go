import { BsThreeDots } from "react-icons/bs";
import { RequirePermission } from "../RequirePermission/RequirePermission";
import { toPersianDigits } from "../../utils/numberConvert";

interface AlarmCardProps {
  label: string;
  total: number;
  unconfirmed: number;
  color: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const AlarmCard: React.FC<AlarmCardProps> = ({
  label,
  total,
  unconfirmed,
  color,
  icon,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-[15px] shadow p-4 flex flex-col justify-between h-full text-right">
      {/* Top */}
      <div className="flex items-start justify-between">
        <span className="font-bold text-black text-xl">{label}</span>
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}22` }}
        >
          {icon}
        </div>
      </div>

      {/* Middle */}
      <div className="w-full flex justify-between items-center">
        <span className="">کل آلارم های {label}</span>
        <div className="text-2xl font-bold text-black">{toPersianDigits(total)}</div>
      </div>

      {/* Bottom */}
      <div className="border-t mt-2 pt-2 flex justify-between items-center text-gray-600">
        <div className="flex justify-start items-center gap-1">
          <span className="text-black font-bold">{toPersianDigits(unconfirmed)}</span>
          {label === "مسلح" || label === "غیر مسلح" ? (
            <>
              <span>شعبه</span>
              <span>{label}</span>
            </>
          ) : (
            <span>آلارم های تایید نشده</span>
          )}
        </div>
        <RequirePermission perm="event:update">
          <div
            className="border rounded-full p-1 border-gray-400 cursor-pointer"
            onClick={onClick}
          >
            <BsThreeDots size={16} />
          </div>
        </RequirePermission>
      </div>
    </div>
  );
};

export default AlarmCard;

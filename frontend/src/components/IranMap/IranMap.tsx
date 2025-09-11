import React, { useState } from "react";
import Razavi from "./components/Provinces/Razavi";
import Shomali from "./components/Provinces/Shomali";
import Golestan from "./components/Provinces/Golestan";
import Mazandaran from "./components/Provinces/Mazandaran";
import Gillan from "./components/Provinces/Gillan";
import Ardebil from "./components/Provinces/Ardebil";
import AzarbayjanSharqi from "./components/Provinces/AzarbayjanSharqi";
import AzarbayjanQarbi from "./components/Provinces/AzarbayjanQarbi";
import Zanjan from "./components/Provinces/Zanjan";
import Kordestan from "./components/Provinces/Kordestan";
import Kermanshah from "./components/Provinces/Kermanshah";
import Elam from "./components/Provinces/Elam";
import Hamedan from "./components/Provinces/Hamedan";
import Qazvin from "./components/Provinces/Qazvin";
import Alborz from "./components/Provinces/Alborz";
import Lorestan from "./components/Provinces/Lorestan";
import Khozestan from "./components/Provinces/Khozestan";
import Kohgeloye from "./components/Provinces/Kohgeloye";
import CharMahal from "./components/Provinces/CharMahal";
import Markazi from "./components/Provinces/Markazi";
import Qom from "./components/Provinces/Qom";
import Esfahan from "./components/Provinces/Esfahan";
import Tehran from "./components/Provinces/Tehran";
import Semnan from "./components/Provinces/Semnan";
import Yazd from "./components/Provinces/Yazd";
import Fars from "./components/Provinces/Fars";
import Kerman from "./components/Provinces/Kerman";
import Booshehr from "./components/Provinces/Booshehr";
import Hormozgan from "./components/Provinces/Hormozgan";
import Sistan from "./components/Provinces/Sistan";
import Jonobi from "./components/Provinces/Jonobi"; // for خراسان جنوبی
import { Tooltip } from "react-tooltip";
import { toPersianDigits } from "../../utils/numberConvert";

export interface AlarmDetail {
  id: string | number;
  total: number;
  code: number;
  label: string;
  count: number;
}

export interface ProvinceInfo {
  id: string | number;
  label: string;
  parentId: string | number;
  type: string;
  unConfirmAlarms: number;
  totalEvents: number;
  alarm: AlarmDetail[];
}

interface IranMapProps {
  provinceData?: Record<string, ProvinceInfo>;
  handleClick: (provinceName: string) => void;
  textColor?: string;
  handleDoubleClick?: (label: string) => void;
}

const IranMap: React.FC<IranMapProps> = ({
  provinceData = {},
  handleClick,
  handleDoubleClick,
  textColor = "#FFF",
}) => {
  // console.log(`provinceData: `, provinceData);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("");

  const getColorByEvents = (unConfirmAlarms: number = 0): string => {
    if (unConfirmAlarms === 0) return "#666";
    if (unConfirmAlarms <= 10) return "#f1948a";
    if (unConfirmAlarms <= 50) return "#e74c3c";
    if (unConfirmAlarms <= 100) return "#cb4335";
    return "#943126";
  };

  const handlePathClick = (e: React.MouseEvent<SVGPathElement>) => {
    const name = e.currentTarget.getAttribute("data-name")!;
    handleClick(name);
  };

  const handleMouseOver = (e: React.MouseEvent<SVGPathElement>) => {
    const name = e.currentTarget.getAttribute("data-name")!;
    setHoveredProvince(name);

    const info = provinceData[name];
    const total = info?.totalEvents ?? 0;
    const unconf = info?.unConfirmAlarms ?? 0;
    const alarms = info?.alarm ?? []; // <-- safe fallback

    setTooltipContent(
      <div dir="rtl">
        <p>کل رویدادها: {toPersianDigits(total)}</p>
        <p>آلارم‌های تایید نشده: {toPersianDigits(unconf)}</p>
        {alarms.length > 0 ? (
          alarms.map((a, i) => (
            <p key={i}>
              {a.label}: {toPersianDigits(a.count)}
            </p>
          ))
        ) : (
          <p>اطلاعات آلارم موجود نیست</p>
        )}
      </div>
    );
  };

  const handleMouseOut = () => {
    setHoveredProvince(null);
    setTooltipContent("");
  };

  const getFillProps = (name: string) => {
    const unconf = provinceData[name]?.unConfirmAlarms || 0;
    const base = getColorByEvents(unconf);
    const isHovered = name === hoveredProvince;
    return {
      fill: isHovered ? "#94a3b8" : base,
      className: unconf > 0 ? "flashing" : "",
    };
  };

  const names = [
    "خراسان رضوی",
    "خراسان شمالی",
    "خراسان جنوبی",
    "گلستان",
    "مازندران",
    "گیلان",
    "اردبیل",
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "زنجان",
    "کردستان",
    "کرمانشاه",
    "ایلام",
    "همدان",
    "قزوین",
    "البرز",
    "لرستان",
    "خوزستان",
    "کهگیلویه و بویراحمد",
    "چهارمحال و بختیاری",
    "مرکزی",
    "استان قم",
    "اصفهان",
    "استان تهران",
    "سمنان",
    "یزد",
    "فارس",
    "کرمان",
    "بوشهر",
    "هرمزگان",
    "سیستان و بلوچستان",
  ] as const;

  const mapComp: Record<(typeof names)[number], React.FC<any>> = {
    "خراسان رضوی": Razavi,
    "خراسان شمالی": Shomali,
    "خراسان جنوبی": Jonobi,
    گلستان: Golestan,
    مازندران: Mazandaran,
    گیلان: Gillan,
    اردبیل: Ardebil,
    "آذربایجان شرقی": AzarbayjanSharqi,
    "آذربایجان غربی": AzarbayjanQarbi,
    زنجان: Zanjan,
    کردستان: Kordestan,
    کرمانشاه: Kermanshah,
    ایلام: Elam,
    همدان: Hamedan,
    قزوین: Qazvin,
    البرز: Alborz,
    لرستان: Lorestan,
    خوزستان: Khozestan,
    "کهگیلویه و بویراحمد": Kohgeloye,
    "چهارمحال و بختیاری": CharMahal,
    مرکزی: Markazi,
    "استان قم": Qom,
    اصفهان: Esfahan,
    "استان تهران": Tehran,
    سمنان: Semnan,
    یزد: Yazd,
    فارس: Fars,
    کرمان: Kerman,
    بوشهر: Booshehr,
    هرمزگان: Hormozgan,
    "سیستان و بلوچستان": Sistan,
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg
        viewBox="0 0 1080 1080"
        className="w-[60%] h-[70%] 2xl:w-[90%] 2xl:h-[90%]"
      >
        {names.map((n) => {
          const Comp = mapComp[n];
          const { fill, className } = getFillProps(n);
          return (
            <Comp
              dataTooltipId="iran-map-tooltip"
              key={n}
              fill={fill}
              className={className}
              style={{ cursor: "pointer", outline: "none" }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handlePathClick}
              onDoubleClick={() => handleDoubleClick && handleDoubleClick(n)}
              data-tip={tooltipContent}
            />
          );
        })}
      </svg>

      <Tooltip id="iran-map-tooltip" place="top">
        {tooltipContent}
      </Tooltip>
    </div>
  );
};

export default IranMap;

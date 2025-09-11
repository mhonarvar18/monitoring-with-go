import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { toPersianDigits } from "../../utils/numberConvert";
import provinceCitiesData from "./components/Cities/provinceCitiesData.json";

export interface AlarmDetail {
  id: string | number;
  total: number;
  code: number;
  label: string;
  count: number;
}

export interface CityInfo {
  id: string | number;
  label: string;
  parentId: string | number;
  type: string;
  unConfirmAlarms: number;
  totalEvents: number;
  alarm: AlarmDetail[];
}

interface City {
  name: string;
  type: "path" | "polygon";
  d?: string;
  points?: string;
}

interface TextLabel {
  name: string;
  x: number;
  y: number;
  paths: string[];
}

interface ProvinceData {
  viewBox: string;
  cities: City[];
  textLabels: TextLabel[];
}

interface ProvinceCitiesMapProps {
  provinceName: string;
  width?: number;
  height?: number;
  textColor?: string;
  cityData?: Record<string, CityInfo>;
  handleClick: (cityName: string) => void;
  handleDoubleClick?: (cityName: string) => void;
}

const ProvinceCitiesMap: React.FC<ProvinceCitiesMapProps> = ({
  provinceName,
  width = 1500,
  height = 1403,
  textColor = "#000",
  cityData = {},
  handleClick,
  handleDoubleClick
}) => {
  console.log(`cityData for ${provinceName}: `, cityData);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("");

  // Get the province data from JSON (static data)
  const provinceData: ProvinceData = (provinceCitiesData as Record<string, ProvinceData>)[provinceName];

  // Color logic similar to IranMap
  const getColorByEvents = (unConfirmAlarms: number = 0): string => {
    if (unConfirmAlarms === 0) return "#666"; // No events
    if (unConfirmAlarms <= 10) return "#f1948a"; // Light color for small unconfirmed alarms
    if (unConfirmAlarms <= 50) return "#e74c3c"; // Medium
    if (unConfirmAlarms <= 100) return "#cb4335"; // High
    return "#943126"; // Critical
  };

  // Get city info (use actual data, no fake data generation anymore)
  const getCityInfo = (cityName: string): CityInfo => {
    return cityData[cityName] || {
      id: `city_${cityName}`,
      label: cityName,
      parentId: provinceName,
      type: "city",
      unConfirmAlarms: 0,
      totalEvents: 0,
      alarm: []
    };
  };

  const handlePathClick = (e: React.MouseEvent<SVGPathElement | SVGPolygonElement>) => {
    const cityName = e.currentTarget.getAttribute("data-name")!;
    handleClick(cityName);
  };

  const handlePathDoubleClick = (e: React.MouseEvent<SVGPathElement | SVGPolygonElement>) => {
    if (handleDoubleClick) {
      const cityName = e.currentTarget.getAttribute("data-name")!;
      handleDoubleClick(cityName);
    }
  };

  const handleMouseOver = (e: React.MouseEvent<SVGPathElement | SVGPolygonElement>) => {
    const cityName = e.currentTarget.getAttribute("data-name")!;
    setHoveredCity(cityName);

    const info = getCityInfo(cityName);
    const total = info.totalEvents;
    const unconf = info.unConfirmAlarms;
    const alarms = info.alarm;

    setTooltipContent(
      <div dir="rtl">
        <p className="font-bold">{cityName}</p>
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
        <p className="text-xs text-gray-300 mt-1">
          {cityData[cityName] ? "(داده واقعی)" : "(داده نمونه)"}
        </p>
      </div>
    );
  };

  const handleMouseOut = () => {
    setHoveredCity(null);
    setTooltipContent("");
  };

  const getFillProps = (cityName: string) => {
    const info = getCityInfo(cityName);
    const unconf = info.unConfirmAlarms;
    const base = getColorByEvents(unconf);
    const isHovered = cityName === hoveredCity;

    return {
      fill: isHovered ? "#94a3b8" : base,
      className: unconf > 0 ? "flashing" : "",
      stroke: isHovered ? "#1e40af" : "#666",
      strokeWidth: isHovered ? "2" : "0.5"
    };
  };

  if (!provinceData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>نقشه برای استان {provinceName} در دسترس نیست</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg
        viewBox={provinceData.viewBox}
        className="w-[60%] h-[70%] 2xl:w-[90%] 2xl:h-[90%]"
        style={{
          maxWidth: "100%",
          maxHeight: "100%"
        }}
      >
        {/* Render cities */}
        <g>
          {provinceData.cities.map((city, index) => {
            const { fill, className, stroke, strokeWidth } = getFillProps(city.name);

            const commonProps = {
              key: index,
              "data-name": city.name,
              fill: fill,
              className: className,
              style: {
                cursor: "pointer",
                stroke: stroke,
                strokeWidth: strokeWidth,
                outline: "none"
              },
              onClick: handlePathClick,
              onDoubleClick: handlePathDoubleClick,
              onMouseOver: handleMouseOver,
              onMouseOut: handleMouseOut,
              "data-tooltip-id": "province-cities-map-tooltip"
            };

            if (city.type === "path") {
              return <path {...commonProps} d={city.d} />;
            } else if (city.type === "polygon") {
              return <polygon {...commonProps} points={city.points} />;
            }
            return null;
          })}
        </g>

        {/* Render text labels if available */}
        {provinceData.textLabels && provinceData.textLabels.length > 0 && (
          <g style={{ fill: textColor, fontSize: "12px", textAnchor: "middle" }}>
            {provinceData.textLabels.map((label, index) => (
              <g key={index} transform={`translate(${label.x}, ${label.y})`}>
                {label.paths.map((pathData, pathIndex) => (
                  <path key={pathIndex} d={pathData} />
                ))}
              </g>
            ))}
          </g>
        )}
      </svg>

      <Tooltip id="province-cities-map-tooltip" place="top">
        {tooltipContent}
      </Tooltip>

      {/* Add flashing animation styles */}
      <style>{`
        .flashing {
          animation: flash 2s infinite;
        }
        
        @keyframes flash {
          0%, 50% { opacity: 1; }
          25%, 75% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default ProvinceCitiesMap;

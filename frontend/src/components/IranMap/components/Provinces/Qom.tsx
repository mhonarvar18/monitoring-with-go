interface ProvinceProps {
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
  onMouseOver?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onMouseOut?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onClick?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  dataTip?: string;
  dataTooltipId?: string
  onDoubleClick?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
}

const Qom: React.FC<ProvinceProps> = ({
  fill = "#ccc",
  className = "",
  style = {},
  onMouseOver,
  onMouseOut,
  onClick,
  dataTip,
  dataTooltipId,
  onDoubleClick
}) => {
  return (
    <>
      <polygon
        data-tooltip-id={dataTooltipId}
        data-name="استان قم"
        fill={fill}
        className={className}
        style={{ cursor: "pointer", ...style }}
        data-tip={dataTip}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        points="368.1,433.18 374.03,434.16 374.03,425.46 377.59,422.49 397.37,417.55 412.6,415.57 417.15,413.2 
  424.08,393.81 413,385.7 406.47,382.93 402.71,378.38 392.82,376.41 383.33,374.23 374.03,375.22 368.1,376.11 358.41,382.93 
  356.63,392.6 351.29,392.6 344.43,395.4 338.46,396.92 334.08,397.18 329.92,395.4 327.15,403.31 329.53,416.56 333.68,417.65 
  339.22,420.52 341.79,428.63 346.74,431.38 355.64,431.4 "
      />
      {/* qom */}
      <text
        transform="matrix(1 0 0 1 359.3041 404.9679)"
        style={{ fill: "#FFF" }}
      >
        قم
      </text>
    </>
  );
};

export default Qom;

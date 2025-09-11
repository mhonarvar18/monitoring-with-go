interface ProvinceProps {
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
  onMouseOver?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onMouseOut?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onClick?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onDoubleClick?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  dataTip?: string;
  dataTooltipId?:string
}

const Alborz: React.FC<ProvinceProps> = ({
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
        data-name="البرز"
        fill={fill}
        className={className}
        style={{ cursor: "pointer", ...style }}
        data-tip={dataTip}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        points="336.65,353.66 340.87,352.34 343.51,345.88 344.43,343.37 366.32,344.43 376.87,342.45 379.64,335.46 
  384.91,330.19 391.9,330.19 394.8,330.19 399.02,324.91 400.08,316.74 400.08,314.49 390.85,314.49 381.88,311.07 376.74,307.9 
  366.32,304.08 346.14,305.4 346.93,309.95 356.82,315.29 339.22,332.1 332.3,344.36 331.9,348.52 "
      />
      {/* alborz */}
      <g style={{ fill: "#FFF" }}>
        <path
          d="M358.46,326.9c0.42,0.95,0.63,1.86,0.63,2.74c0,2.88-1.74,4.51-5.22,4.88l-0.31-1.27c2.82-0.28,4.23-1.46,4.22-3.52
      c0-0.76-0.19-1.56-0.58-2.39L358.46,326.9z M356.3,324.19l1.12-1.12l1.13,1.13l-1.12,1.12L356.3,324.19z"
        />
        <path
          d="M364.62,326.9l0.42,1.44c0.22,0.77,0.7,1.16,1.42,1.16h0.21c0.1,0,0.15,0.18,0.15,0.54v0.18c0,0.44-0.05,0.66-0.15,0.66
      h-0.13c-0.71,0-1.16-0.13-1.36-0.4c-0.28,2.36-2,3.71-5.15,4.05l-0.31-1.27c2.82-0.28,4.23-1.46,4.22-3.53
      c0-0.75-0.2-1.54-0.59-2.38L364.62,326.9z"
        />
        <path
          d="M372.15,330.21c0,0.44-0.05,0.66-0.15,0.66h-0.07c-0.98,0-1.66-0.35-2.04-1.05c-0.49,0.7-1.35,1.05-2.58,1.05h-0.78
      c-0.28,0-0.43-0.22-0.43-0.66v-0.14c0-0.38,0.14-0.57,0.43-0.57h0.74c1.15,0,1.78-0.33,1.91-0.98c0.03-0.17,0.04-0.38,0.04-0.62
      c0-0.25-0.01-0.48-0.02-0.71l-0.04-0.6l1.22-0.15l0.12,1.72c0.06,0.9,0.54,1.34,1.43,1.34H372c0.1,0,0.15,0.21,0.15,0.64V330.21z
       M367.79,333.23l1.08-1.08l1.09,1.09l-1.08,1.08L367.79,333.23z"
        />
        <path
          d="M371.89,330.87c-0.29,0-0.43-0.22-0.43-0.66v-0.14c0-0.38,0.14-0.57,0.43-0.57h0.36c1.33,0,1.99-0.62,1.99-1.87v-7.48h1.3
      v7.52c0,2.13-1.11,3.2-3.33,3.2H371.89z"
        />
        <path d="M377.87,320.15h1.29v10.71h-1.29V320.15z" />
      </g>
    </>
  );
};

export default Alborz;

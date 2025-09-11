// types/province-data.types.ts

export interface City {
  name: string;
  type: "path" | "polygon";
  d?: string; // for path elements
  points?: string; // for polygon elements
  metadata?: {
    population?: number;
    area?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface TextLabel {
  name: string;
  x: number;
  y: number;
  paths: string[];
  fontSize?: number;
  transform?: string;
}

export interface ProvinceData {
  viewBox: string;
  cities: City[];
  textLabels?: TextLabel[];
  metadata?: {
    capital?: string;
    population?: number;
    area?: number;
    timeZone?: string;
  };
}

export interface ProvinceCitiesData {
  [provinceName: string]: ProvinceData;
}

// Event handler types
export type CityClickHandler = (cityName: string) => void;
export type CityMouseHandler = (
  e: React.MouseEvent<SVGPathElement | SVGPolygonElement>
) => void;
export type CityFillFunction = (cityName: string) => string;

// Component props interface
export interface ProvinceCitiesMapProps {
  provinceName: string;
  width?: number;
  height?: number;
  textColor?: string;
  backgroundColor?: string;
  onCityClick?: CityClickHandler;
  onMouseOver?: CityMouseHandler;
  onMouseOut?: CityMouseHandler;
  onDoubleClick?: CityMouseHandler;
  cityData?: Record<string, any>;
  getCityFill?: CityFillFunction;
  selectedCity?: string;
  showCityLabels?: boolean;
  enableZoom?: boolean;
  className?: string;
}

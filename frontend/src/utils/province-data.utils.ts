// utils/province-data.utils.ts
import provinceCitiesData from "../components/IranMap/components/Cities/provinceCitiesData.json"
import type { ProvinceData, ProvinceCitiesData, City } from "../types/province-data.types";

/**
 * Get all available province names
 */
export const getAvailableProvinces = (): string[] => {
  return Object.keys(provinceCitiesData);
};

/**
 * Get province data by name
 */
export const getProvinceData = (provinceName: string): ProvinceData | null => {
  const data = provinceCitiesData as ProvinceCitiesData;
  return data[provinceName] || null;
};

/**
 * Get all cities for a specific province
 */
export const getProvinceCities = (provinceName: string): City[] => {
  const provinceData = getProvinceData(provinceName);
  return provinceData?.cities || [];
};

/**
 * Get city names for a specific province
 */
export const getProvinceCityNames = (provinceName: string): string[] => {
  const cities = getProvinceCities(provinceName);
  return cities.map(city => city.name);
};

/**
 * Search for a city across all provinces
 */
export const findCityInProvinces = (cityName: string): { provinceName: string; city: City } | null => {
  const data = provinceCitiesData as ProvinceCitiesData;
  
  for (const [provinceName, provinceData] of Object.entries(data)) {
    const city = provinceData.cities.find(c => c.name === cityName);
    if (city) {
      return { provinceName, city };
    }
  }
  
  return null;
};

/**
 * Get all cities across all provinces
 */
export const getAllCities = (): Array<{ provinceName: string; city: City }> => {
  const data = provinceCitiesData as ProvinceCitiesData;
  const allCities: Array<{ provinceName: string; city: City }> = [];
  
  for (const [provinceName, provinceData] of Object.entries(data)) {
    provinceData.cities.forEach(city => {
      allCities.push({ provinceName, city });
    });
  }
  
  return allCities;
};

/**
 * Validate province data structure
 */
export const validateProvinceData = (provinceName: string): boolean => {
  const provinceData = getProvinceData(provinceName);
  
  if (!provinceData) return false;
  
  // Check required fields
  if (!provinceData.viewBox || !Array.isArray(provinceData.cities)) {
    return false;
  }
  
  // Validate each city
  return provinceData.cities.every(city => {
    return (
      city.name &&
      city.type &&
      (city.type === "path" ? !!city.d : !!city.points)
    );
  });
};

/**
 * Get default city fill colors based on city size or importance
 */
export const getDefaultCityFill = (cityName: string, provinceName?: string): string => {
  // You can customize this based on your needs
  const importantCities = [
    "مشهد", "تهران", "اصفهان", "شیراز", "تبریز", "کرج", "قم", "اهواز"
  ];
  
  if (importantCities.includes(cityName)) {
    return "#ef4444"; // Red for major cities
  }
  
  // Different shades for different provinces
  const provinceColors: Record<string, string> = {
    "خراسان رضوی": "#3b82f6",
    "تهران": "#10b981", 
    "اصفهان": "#f59e0b",
    "فارس": "#8b5cf6"
  };
  
  if (provinceName && provinceColors[provinceName]) {
    return provinceColors[provinceName];
  }
  
  return "#e5e7eb"; // Default gray
};

/**
 * Generate city statistics
 */
export const getProvinceStatistics = (provinceName: string) => {
  const provinceData = getProvinceData(provinceName);
  
  if (!provinceData) {
    return null;
  }
  
  return {
    totalCities: provinceData.cities.length,
    pathCities: provinceData.cities.filter(c => c.type === "path").length,
    polygonCities: provinceData.cities.filter(c => c.type === "polygon").length,
    hasTextLabels: (provinceData.textLabels?.length || 0) > 0,
    citiesWithMetadata: provinceData.cities.filter(c => c.metadata).length
  };
};

/**
 * Export province data to downloadable format
 */
export const exportProvinceData = (provinceName: string): string => {
  const provinceData = getProvinceData(provinceName);
  return JSON.stringify(provinceData, null, 2);
};

/**
 * Color utility functions for styling cities based on data
 */
export const getCityColorByValue = (
  value: number, 
  min: number, 
  max: number, 
  colorScale: string[] = ["#22c55e", "#eab308", "#ef4444"]
): string => {
  const normalizedValue = (value - min) / (max - min);
  
  if (normalizedValue <= 0.33) return colorScale[0]; // Green
  if (normalizedValue <= 0.66) return colorScale[1]; // Yellow
  return colorScale[2]; // Red
};

/**
 * Get city bounds for zoom functionality
 */
export const getCityBounds = (provinceName: string, cityName: string): { x: number; y: number; width: number; height: number } | null => {
  // This would require parsing the SVG path data to calculate bounds
  // For now, returning null - can be implemented based on specific needs
  return null;
};
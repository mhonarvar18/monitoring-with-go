import { useState, useEffect, useCallback, useDebugValue } from "react";
import {
  getSocket,
  initializeSocket,
  emitActiveMap,
  listenToCountryEventData,
  stopListeningToCountryEventData,
  disconnectSocket,
  refreshMap,
  getCities, // Import the getCities function
  listenToCitiesData, // Import the function to listen to city data
} from "../lib/socket";
import type { ProvinceInfo } from "../components/IranMap/IranMap";

export function useCountryEvents(token: string) {
  const [data, setData] = useState<Record<string, ProvinceInfo>>({});
  const [cityData, setCityData] = useState<any>(null); // New state to store city data
  const [error, setError] = useState<Error | null>(null);

  // show count in React DevTools
  useDebugValue(data, (d) => `🇮🇷 ${Object.keys(d).length} provinces`);

  const activateMap = useCallback(() => {
    console.log("[useCountryEvents] ▶ emitActiveMap()");
    emitActiveMap();
  }, []);

  const fetchCityData = useCallback((provinceId: string | number) => {
    console.log(
      "[useCountryEvents] ▶ emit getCities with provinceId:",
      provinceId
    );
    getCities(provinceId); // Emit getCities with provinceId
  }, []);

  useEffect(() => {
    console.log("[useCountryEvents] hook init, token =", token);
    let socket = getSocket();
    if (!socket) {
      console.log("[useCountryEvents] no socket, initializing…");
      try {
        initializeSocket(token);
        socket = getSocket()!;
        console.log("[useCountryEvents] socket after init:", socket.id);
      } catch (err) {
        console.error("[useCountryEvents] init error:", err);
        setError(err as Error);
        return;
      }
    }

    if (socket.connected) {
      console.log("[useCountryEvents] socket already connected:", socket.id);
      activateMap();
      refreshMap();
    } else {
      console.log("[useCountryEvents] waiting for socket to connect…");
      socket.once("connect", () => {
        console.log("[useCountryEvents] socket just connected:", socket.id);
        activateMap();
        refreshMap();
      });
    }

    listenToCountryEventData((arr: ProvinceInfo[]) => {
      console.log("[useCountryEvents] received data:", arr);
      const byLabel = arr.reduce<Record<string, ProvinceInfo>>((acc, cur) => {
        acc[cur.label] = cur;
        return acc;
      }, {});
      setData(byLabel);
    });

    listenToCitiesData((cityData: any) => {
      console.log("[useCountryEvents] received city data:", cityData);
      setCityData(cityData); // Store the received city data
    });

    return () => {
      console.log(
        "[useCountryEvents] cleanup: removing listeners & disconnecting"
      );
      stopListeningToCountryEventData();
      disconnectSocket();
    };
  }, [token, activateMap]);

  return { data, cityData, error, fetchCityData }; // Expose fetchCityData and cityData
}

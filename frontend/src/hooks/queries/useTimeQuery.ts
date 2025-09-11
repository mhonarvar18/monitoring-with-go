import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

interface ServerTimeResponse {
  date: string; // "2025-05-09"
  time: string; // "18:28:49"
  weekday: string; // "جمعه"
}

const fetchServerTime = async (): Promise<{ date: Date; weekday: string }> => {
  const response = await api.get("/admin/appSettings/datetime/iran");
  const { date, time, weekday }: ServerTimeResponse = response.data.data;

  const combinedDate = new Date(`${date}T${time}`); // Create full Date
  return { date: combinedDate, weekday };
};

export const useServerTimeQuery = () => {
  return useQuery({
    queryKey: ["serverTime"],
    queryFn: fetchServerTime,
    refetchInterval: 60000, // every 1 min
    staleTime: 60000,
  });
};

import { useEffect, useState } from "react";
import { useServerTimeQuery } from "./queries/useTimeQuery";

export const useLiveClock = () => {
  const { data, isLoading } = useServerTimeQuery();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    setCurrentTime(data.date);
    setWeekday(data.weekday);

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (!prev) return null;
        return new Date(prev.getTime() + 1000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return {
    isLoading,
    date: currentTime,
    weekday,
  };
};

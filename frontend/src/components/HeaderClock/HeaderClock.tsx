import { useLiveClock } from "../../hooks/useLiveClock";

const HeaderClock = () => {
  const { date, weekday, isLoading } = useLiveClock();

  if (isLoading || !date) return <span>در حال دریافت زمان...</span>;

  const timeStr = date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="text-right flex justify-center items-center gap-2">
      <div className="text-base font-medium">{`${weekday}، ${dateStr}`}</div>
      {" - "}
      <div className="text-base font-medium">{timeStr}</div>
    </div>
  );
};

export default HeaderClock;

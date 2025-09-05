import React from "react";

export interface Availability {
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
}

interface AvailabilityCalendarProps {
  availabilities: Availability[];
  selectedRange: [Date | null, Date | null];
  onSelect: (range: [Date, Date]) => void;
  minNights?: number;
  maxNights?: number;
  loading?: boolean;
  error?: string | null;
}

// Helper: check if a date is available
function isDateAvailable(date: Date, availabilities: Availability[]) {
  return availabilities.some(
    (a) =>
      a.isAvailable &&
      date >= new Date(a.startDate) &&
      date <= new Date(a.endDate),
  );
}

// Helper: get all available dates as a Set<string>
function getAvailableDateSet(availabilities: Availability[]) {
  const set = new Set<string>();
  availabilities.forEach((a) => {
    if (!a.isAvailable) return;
    let d = new Date(a.startDate);
    const end = new Date(a.endDate);
    while (d <= end) {
      set.add(d.toDateString());
      d = new Date(d);
      d.setDate(d.getDate() + 1);
    }
  });
  return set;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  availabilities,
  selectedRange,
  onSelect,
  minNights = 1,
  maxNights = 30,
  loading = false,
  error = null,
}) => {
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const [selecting, setSelecting] = React.useState<"start" | "end">("start");
  const [start, end] = selectedRange;
  const availableSet = React.useMemo(
    () => getAvailableDateSet(availabilities),
    [availabilities],
  );

  // Generate days for current month
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  // Handlers
  function handleDayClick(day: Date) {
    if (!availableSet.has(day.toDateString())) return;
    if (!start || (start && end)) {
      setSelecting("end");
      onSelect([day, day]);
    } else if (selecting === "end") {
      if (day < start) {
        onSelect([day, day]);
      } else {
        const nights = Math.ceil((+day - +start) / (1000 * 60 * 60 * 24));
        if (nights + 1 < minNights || nights + 1 > maxNights) return;
        // Check all dates in range are available
        let valid = true;
        for (let d = new Date(start); d <= day; d.setDate(d.getDate() + 1)) {
          if (!availableSet.has(d.toDateString())) {
            valid = false;
            break;
          }
        }
        if (valid) {
          onSelect([start, day]);
        }
      }
    }
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // Render
  if (loading) {
    return <div className="p-8 text-center">Loading calendar...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-md rounded border bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <button onClick={prevMonth}>&lt;</button>
        <div className="font-semibold">
          {firstDay.toLocaleString("default", { month: "long" })} {year}
        </div>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-bold">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay.getDay())
          .fill(null)
          .map((_, i) => (
            <div key={"empty-" + i} />
          ))}
        {days.map((day) => {
          const isAvailable = availableSet.has(day.toDateString());
          const isSelected = start && end && day >= start && day <= end;
          return (
            <button
              key={day.toISOString()}
              className={`h-8 w-8 rounded p-1 text-xs ${isAvailable ? "bg-green-100 hover:bg-green-200" : "cursor-not-allowed bg-gray-100 text-gray-400"} ${isSelected ? "bg-blue-400 text-white" : ""} `}
              disabled={!isAvailable}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => setHoverDate(day)}
              onMouseLeave={() => setHoverDate(null)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Min nights: {minNights}, Max nights: {maxNights}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

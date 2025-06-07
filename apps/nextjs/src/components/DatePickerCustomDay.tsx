import type { FC } from "react";
import React from "react";

interface DatePickerCustomDayProps {
  dayOfMonth: number;
  date: Date;
  isBlocked?: boolean;
  isBooked?: boolean;
  availableUnits?: number;
  price?: number;
}

const DatePickerCustomDay: FC<DatePickerCustomDayProps> = ({
  dayOfMonth,
  date: _date, // Rename the destructured prop to _date
  isBlocked,
  isBooked,
  availableUnits,
  price,
}) => {
  const isUnavailable =
    isBlocked ??
    isBooked ??
    (availableUnits !== undefined && availableUnits <= 0);

  return (
    <div className={`relative ${isUnavailable ? "text-gray-400" : ""}`}>
      <span>{dayOfMonth}</span>
      {price && <span className="text-xs">${price}</span>}
      {isUnavailable && (
        <div className="absolute inset-0 bg-gray-200 opacity-50" />
      )}
    </div>
  );
};

export default DatePickerCustomDay;

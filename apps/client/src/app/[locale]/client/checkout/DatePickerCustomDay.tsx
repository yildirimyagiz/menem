"use client";

import type { FC } from "react";
import React from "react";

interface DatePickerCustomDayProps {
  dayOfMonth: number;
  date: Date;
  isSelected?: boolean;
  isDisabled?: boolean;
  isToday?: boolean;
  isOutsideMonth?: boolean;
  onClick?: () => void;
}

const DatePickerCustomDay: FC<DatePickerCustomDayProps> = ({
  dayOfMonth,
  date,
  isSelected = false,
  isDisabled = false,
  isToday = false,
  isOutsideMonth = false,
  onClick,
}) => {
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const getDayClasses = () => {
    const baseClasses =
      "flex h-full w-full items-center justify-center rounded-md transition-colors duration-200";

    if (isDisabled) {
      return `${baseClasses} text-neutral-400 cursor-not-allowed`;
    }

    if (isSelected) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 cursor-pointer`;
    }

    if (isToday) {
      return `${baseClasses} bg-blue-100 text-blue-900 hover:bg-blue-200 cursor-pointer dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800`;
    }

    if (isOutsideMonth) {
      return `${baseClasses} text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:text-neutral-600 dark:hover:bg-neutral-800`;
    }

    return `${baseClasses} text-neutral-900 hover:bg-neutral-100 cursor-pointer dark:text-neutral-100 dark:hover:bg-neutral-800`;
  };

  return (
    <div
      className={getDayClasses()}
      onClick={handleClick}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}${isSelected ? " (selected)" : ""}${isToday ? " (today)" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <span className="text-sm font-medium">{dayOfMonth}</span>
    </div>
  );
};

export default DatePickerCustomDay;

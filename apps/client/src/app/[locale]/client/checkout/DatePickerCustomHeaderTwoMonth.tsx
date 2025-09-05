"use client";

import type { FC } from "react";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface DatePickerCustomHeaderTwoMonthProps {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

const DatePickerCustomHeaderTwoMonth: FC<
  DatePickerCustomHeaderTwoMonthProps
> = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        title="Previous month"
        aria-label="Go to previous month"
        onKeyDown={(e) => handleKeyDown(e, decreaseMonth)}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
        {formatMonthYear(date)}
      </h2>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        title="Next month"
        aria-label="Go to next month"
        onKeyDown={(e) => handleKeyDown(e, increaseMonth)}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DatePickerCustomHeaderTwoMonth;

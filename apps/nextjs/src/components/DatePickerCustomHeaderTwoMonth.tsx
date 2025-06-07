import type { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DatePickerCustomHeaderTwoMonth: React.FC<
  ReactDatePickerCustomHeaderProps
> = ({ monthDate, customHeaderCount, decreaseMonth, increaseMonth }) => {
  return (
    <div className="relative flex items-center justify-between px-2">
      <button
        aria-label="Previous Month"
        className={`react-datepicker__navigation react-datepicker__navigation--previous flex items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${customHeaderCount === 1 ? "invisible" : ""}`}
        onClick={decreaseMonth}
        type="button"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
      <span className="react-datepicker__current-month text-base font-semibold">
        {monthDate.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </span>
      <button
        aria-label="Next Month"
        className={`react-datepicker__navigation react-datepicker__navigation--next flex items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${customHeaderCount === 0 ? "invisible" : ""}`}
        onClick={increaseMonth}
        type="button"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

export default DatePickerCustomHeaderTwoMonth;

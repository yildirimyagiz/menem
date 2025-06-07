import type { FC } from "react";
import React from "react";

interface Props {
  value?: string;
  onChange?: (e: string) => void;
}

const DatePickerCustomTime: FC<Props> = ({ onChange, value }) => {
  return (
    <div className="relative">
      <label htmlFor="time-input" className="sr-only">
        Time
      </label>
      <input
        id="time-input"
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded border border-blue-500 bg-white p-2 text-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
        placeholder="Enter time"
      />
    </div>
  );
};

export default DatePickerCustomTime;

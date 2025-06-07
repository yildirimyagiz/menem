"use client";

import type { FC } from "react";
import React from "react";

export interface MultiSelectProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
}

const MultiSelect: FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  className = "",
}) => {
  const handleCheckboxChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  return (
    <div className={`multi-select ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="mb-2 flex text-sm sm:text-base">
          <input
            id={option.value}
            name={option.value}
            type="checkbox"
            className="focus:ring-action-primary h-6 w-6 rounded border-neutral-500 bg-white text-primary-500 focus:ring-primary-500 dark:bg-neutral-700 dark:checked:bg-primary-500"
            checked={selectedValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
          />
          <label
            htmlFor={option.value}
            className="ml-3.5 flex flex-1 flex-col justify-center"
          >
            <span className="text-neutral-900 dark:text-neutral-100">
              {option.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultiSelect;

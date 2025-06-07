import type { FC, SelectHTMLAttributes } from "react";
import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  sizeClass?: string;
  options: SelectOption[];
}

const Select2: FC<SelectProps> = ({
  className = "",
  sizeClass = "h-11",
  options,
  ...args
}) => {
  return (
    <select
      className={`nc-Select ${sizeClass} ${className} focus:border-primary-300 focus:ring-primary-200 dark:focus:ring-primary-600 block w-full rounded-2xl border-neutral-200 bg-white text-sm focus:ring focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-opacity-25`}
      {...args}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select2;

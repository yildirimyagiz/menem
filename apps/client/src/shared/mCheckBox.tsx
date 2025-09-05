"use client";

import type { FC } from "react";
import React from "react";

export interface mCheckboxProps {
  label?: string;
  subLabel?: string;
  className?: string;
  name: string;
  checked?: boolean; // Change from defaultChecked to checked for controlled behavior
  onChange?: (checked: boolean) => void;
}

const mCheckbox: FC<mCheckboxProps> = ({
  subLabel = "",
  label = "",
  name,
  className = "",
  checked = false, // Use checked for controlled state
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className={`flex items-start text-sm sm:text-base ${className}`}>
      <input
        id={name}
        name={name}
        type="checkbox"
        className="text-primary-500 focus:ring-primary-500 dark:checked:bg-primary-500 h-6 w-6 rounded border-neutral-500 bg-white dark:bg-neutral-700"
        checked={checked} // Use checked instead of defaultChecked
        onChange={handleChange}
      />
      {label && (
        <label
          htmlFor={name}
          className="ml-3 flex flex-1 flex-col justify-center"
        >
          <span className="text-neutral-900 dark:text-neutral-100">
            {label}
          </span>
          {subLabel && (
            <p className="mt-1 text-sm font-light text-neutral-500 dark:text-neutral-400">
              {subLabel}
            </p>
          )}
        </label>
      )}
    </div>
  );
};

export default mCheckbox;

"use client";

import type { FC } from "react";
import React from "react";

export interface CheckboxProps {
  label?: string;
  subLabel?: string;
  className?: string;
  name: string;
  checked?: boolean; // Add this prop for controlled components
  defaultChecked?: boolean; // Optional for uncontrolled components
  onChange?: (checked: boolean) => void;
}

const Checkbox: FC<CheckboxProps> = ({
  label = "",
  subLabel = "",
  name,
  className = "",
  checked, // Destructure 'checked'
  defaultChecked = false,
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
        checked={checked} // Use 'checked' for controlled components
        defaultChecked={defaultChecked} // Fallback for uncontrolled
        onChange={handleChange}
      />
      {(label || subLabel) && (
        <label
          htmlFor={name}
          className="ml-3 flex flex-1 flex-col justify-center"
        >
          {label && (
            <span className="text-neutral-900 dark:text-neutral-100">
              {label}
            </span>
          )}
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

export default Checkbox;

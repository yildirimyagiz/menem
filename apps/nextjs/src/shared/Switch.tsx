import type { FC } from "react";
import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Switch: FC<SwitchProps> = ({
  checked,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`relative inline-flex cursor-pointer items-center ${className}`}
    >
      <input
        label="checkbox"
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={`peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 ${disabled ? "cursor-not-allowed opacity-50" : ""} `}
      ></div>
    </label>
  );
};

export default Switch;

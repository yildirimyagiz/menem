import React, { FC, useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export interface NcInput3Props {
  className?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  desc?: string;
}

const NcInput3: FC<NcInput3Props> = ({
  className = "w-full",
  defaultValue = 0,
  min = 0,
  max,
  value,
  onChange,
  label,
  desc,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(() => {
    setInternalValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleClickDecrement = () => {
    if (min >= internalValue) return;
    const newValue = internalValue - 1;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClickIncrement = () => {
    if (max && max <= internalValue) return;
    const newValue = internalValue + 1;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderLabel = () => {
    return (
      <div className="flex flex-col">
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          {label}
        </span>
        {desc && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
            {desc}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`nc-NcInput3 flex items-center justify-between space-x-5 ${className}`}
      data-nc-id="NcInput3"
    >
      {label && renderLabel()}

      <div className="flex items-center justify-between w-28">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickDecrement}
          disabled={min >= internalValue}
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span>{internalValue}</span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickIncrement}
          disabled={max ? max <= internalValue : false}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NcInput3;

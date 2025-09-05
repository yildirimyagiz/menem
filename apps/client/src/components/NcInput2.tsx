"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export interface NcInput2Props {
  className?: string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  label?: string;
  desc?: string;
  secondValue?: number; // New prop for the second input
  onSecondChange?: (value: number) => void; // Callback for the second input
}

const NcInput2: FC<NcInput2Props> = ({
  className = "w-full",
  min = 0,
  max,
  onChange,
  label,
  desc,
  secondValue, // Receive the second value
  onSecondChange, // Receive the callback for the second value
}) => {
  const [value, setValue] = useState(min);
  const [secondInput, setSecondInput] = useState(secondValue ?? min);

  useEffect(() => {
    setValue(min);
  }, [min]);

  useEffect(() => {
    setSecondInput(secondValue ?? min);
  }, [min, secondValue]);

  const handleClickDecrement = () => {
    if (min >= value) return;
    setValue((state) => {
      const newValue = state - 1;
      onChange?.(newValue);
      return newValue;
    });
  };

  const handleClickIncrement = () => {
    if (max && max <= value) return;
    setValue((state) => {
      const newValue = state + 1;
      onChange?.(newValue);
      return newValue;
    });
  };

  const handleSecondInputDecrement = () => {
    if (min >= secondInput) return;
    setSecondInput((state) => {
      const newValue = state - 1;
      onSecondChange?.(newValue);
      return newValue;
    });
  };

  const handleSecondInputIncrement = () => {
    if (max && max <= secondInput) return;
    setSecondInput((state) => {
      const newValue = state + 1;
      onSecondChange?.(newValue);
      return newValue;
    });
  };

  const renderLabel = () => {
    return (
      <div className="flex flex-col">
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          {label}
        </span>
        {desc && (
          <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
            {desc}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`nc-NcInput2 flex flex-col space-y-3 ${className}`}
      data-nc-id="NcInput2"
    >
      {label && renderLabel()}

      <div className="flex w-full flex-col space-y-3">
        <div className="flex w-full items-center justify-between">
          <div className={`nc-NcInput2 flex w-28 items-center justify-between`}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white hover:border-neutral-700 focus:outline-none disabled:cursor-default disabled:opacity-50 disabled:hover:border-neutral-400 dark:border-neutral-500 dark:bg-neutral-900 dark:disabled:hover:border-neutral-500"
              type="button"
              onClick={handleClickDecrement}
              disabled={min >= value}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span>{value}</span>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white hover:border-neutral-700 focus:outline-none disabled:cursor-default disabled:opacity-50 disabled:hover:border-neutral-400 dark:border-neutral-500 dark:bg-neutral-900 dark:disabled:hover:border-neutral-500"
              type="button"
              onClick={handleClickIncrement}
              disabled={max ? max <= value : false}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className={`nc-NcInput2 flex w-28 items-center justify-between`}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white hover:border-neutral-700 focus:outline-none disabled:cursor-default disabled:opacity-50 disabled:hover:border-neutral-400 dark:border-neutral-500 dark:bg-neutral-900 dark:disabled:hover:border-neutral-500"
              type="button"
              onClick={handleSecondInputDecrement}
              disabled={min >= secondInput}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span>{secondInput}</span>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white hover:border-neutral-700 focus:outline-none disabled:cursor-default disabled:opacity-50 disabled:hover:border-neutral-400 dark:border-neutral-500 dark:bg-neutral-900 dark:disabled:hover:border-neutral-500"
              type="button"
              onClick={handleSecondInputIncrement}
              disabled={max ? max <= secondInput : false}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NcInput2;

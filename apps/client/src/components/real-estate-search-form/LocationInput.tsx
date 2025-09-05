"use client";

import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import T from "~/utils/getT";

interface Props {
  onClick?: () => void;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  headingText?: string;
  imputName?: string;
}

const LocationInput: FC<Props> = ({
  onChange,
  className,
  defaultValue = "United States",
  headingText = "Where to?",
  imputName = "location",
}) => {
  const [value, setValue] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSelectLocation = (item: string) => {
    // DO NOT REMOVE SETTIMEOUT FUNC
    setTimeout(() => {
      setValue(item);
      onChange && onChange(item);
    }, 0);
  };

  const renderSearchValues = ({
    heading,
    items,
  }: {
    heading: string;
    items: string[];
  }) => {
    return (
      <>
        <p className="block text-base font-semibold">
          {heading || "Destinations"}
        </p>
        <div className="mt-3">
          {items.map((item) => {
            return (
              <div
                className="mb-1 flex items-center gap-x-3 py-2 text-sm"
                onClick={() => handleSelectLocation(item)}
                key={item}
              >
                <MapPinIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className={clsx(className)} ref={containerRef}>
      <h3 className="text-xl font-semibold sm:text-2xl">{headingText}</h3>
      <div className="relative mt-5">
        <input
          className="focus:border-primary-300 focus:ring-3 focus:ring-primary-200/50 dark:focus:ring-primary-600/25 block w-full truncate rounded-xl border border-neutral-300 bg-transparent px-4 py-3 pe-12 font-normal leading-none placeholder-neutral-500 placeholder:truncate dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-300 sm:text-sm"
          placeholder={"Search destinations"}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          ref={inputRef}
          name={imputName}
          autoComplete="off"
          autoFocus
          data-autofocus
        />
        <span className="absolute end-2.5 top-1/2 -translate-y-1/2">
          {/* Inline SVG for magnifying glass icon */}
          <svg
            className="h-5 w-5 text-neutral-700 dark:text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>
      <div className="mt-7">
        {value
          ? // if input value is not empty, show suggestions based on input
            renderSearchValues({
              heading: "Locations",
              items: [
                "Afghanistan",
                "Albania",
                "Algeria",
                "American Samao",
                "Andorra",
              ],
            })
          : // if input value is empty, show popular destinations suggestions
            renderSearchValues({
              heading: "Popular destinations",
              items: [
                "Australia",
                "Canada",
                "Germany",
                "United Kingdom",
                "United Arab Emirates",
              ],
            })}
      </div>
    </div>
  );
};

export default LocationInput;

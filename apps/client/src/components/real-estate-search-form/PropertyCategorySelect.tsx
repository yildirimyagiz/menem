"use client";

import type { FC } from "react";
import { useState } from "react";
import { Popover } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export enum PropertyCategory {
  RESIDENTIAL = "RESIDENTIAL",
  COMMERCIAL = "COMMERCIAL",
  LAND = "LAND",
  INDUSTRIAL = "INDUSTRIAL",
  OTHER = "OTHER",
}

const MAIN_CATEGORIES: PropertyCategory[] = [
  PropertyCategory.RESIDENTIAL,
  PropertyCategory.COMMERCIAL,
  PropertyCategory.LAND,
  PropertyCategory.INDUSTRIAL,
];

const categoryIcons: Partial<Record<PropertyCategory, JSX.Element>> = {
  RESIDENTIAL: (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M3 12l9-8 9 8" />
      <path d="M4 10v10a1 1 0 0 0 1 1h3m10-11v10a1 1 0 0 1-1 1h-3m-6 0h6" />
    </svg>
  ),
  COMMERCIAL: (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  LAND: (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="16" width="16" height="4" rx="1" />
      <rect x="8" y="12" width="8" height="4" rx="1" />
    </svg>
  ),
  INDUSTRIAL: (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="13" width="18" height="8" rx="2" />
      <path d="M7 13V7h2v6m6 0V7h2v6" />
    </svg>
  ),
};

function getCategoryIcon(category: PropertyCategory) {
  return (
    categoryIcons[category] || (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    )
  );
}

function getCategoryLabel(category: PropertyCategory) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

interface Props {
  onChange?: (data: PropertyCategory[]) => void;
}

const PropertyCategorySelect: FC<Props> = ({ onChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<
    PropertyCategory[]
  >([]);

  function handleClear() {
    setSelectedCategories([]);
    onChange?.([]);
  }
  function handleDone(close: () => void) {
    close();
    onChange?.(selectedCategories);
  }

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex items-center rounded-full border ${open ? "border-green-600" : "border-gray-300"} h-[48px] min-w-[160px] bg-white px-5 py-2 text-base font-semibold text-green-700 shadow-sm focus:outline-none`}
          >
            <span>
              {selectedCategories.length > 0
                ? selectedCategories.map(getCategoryLabel).join(", ")
                : "Category"}
            </span>
            <ChevronDownIcon className="ml-2 h-5 w-5 text-green-700" />
          </Popover.Button>
          <Popover.Panel className="absolute left-1/2 z-20 mt-2 min-h-[220px] w-[340px] max-w-full -translate-x-1/2 rounded-2xl border bg-white p-4 shadow-xl">
            <div className="mb-4 grid grid-cols-2 items-center justify-center gap-4">
              {MAIN_CATEGORIES.map((category) => {
                const selected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    className={`relative flex flex-col items-center justify-center rounded-xl border p-5 text-base font-medium text-gray-800 shadow-sm transition-all focus:outline-none ${selected ? "border-green-600 ring-2 ring-green-200" : "border-gray-200 hover:border-green-400"}`}
                    onClick={() => {
                      const newState = selected
                        ? selectedCategories.filter((c) => c !== category)
                        : [...selectedCategories, category];
                      setSelectedCategories(newState);
                      onChange?.(newState);
                    }}
                  >
                    {getCategoryIcon(category)}
                    <span className="mb-1 mt-2 text-base font-medium">
                      {getCategoryLabel(category)}
                    </span>
                    {selected && (
                      <span className="absolute right-2 top-2 text-green-600">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between border-t pt-2">
              <button
                type="button"
                className="font-semibold text-blue-600"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="font-semibold text-blue-600"
                onClick={() => handleDone(close)}
              >
                Done
              </button>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default PropertyCategorySelect;

"use client";

import type { FC } from "react";
import { useState } from "react";
import { Popover } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import Checkbox from "~/shared/Checkbox";
import {
  CheckboxField,
  CheckboxGroup,
} from "../../app/_components/client/Checkbox";

export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  VILLA = "VILLA",
  DUPLEX = "DUPLEX",
  PENTHOUSE = "PENTHOUSE",
  STUDIO = "STUDIO",
  CONDO = "CONDO",
  TOWNHOUSE = "TOWNHOUSE",
  LOFT = "LOFT",
  COTTAGE = "COTTAGE",
  BUNGALOW = "BUNGALOW",
  CHALET = "CHALET",
  CABIN = "CABIN",
  MANSION = "MANSION",
  RANCH = "RANCH",
  FARM = "FARM",
  OFFICE = "OFFICE",
  SHOP = "SHOP",
  RETAIL = "RETAIL",
  WAREHOUSE = "WAREHOUSE",
  HOTEL = "HOTEL",
  HOSTEL = "HOSTEL",
  GUESTHOUSE = "GUESTHOUSE",
  BEDANDBREAKFAST = "BEDANDBREAKFAST",
  RESORT = "RESORT",
  GARAGE = "GARAGE",
  PARKING = "PARKING",
  AGRICULTURAL = "AGRICULTURAL",
  DEVELOPMENT = "DEVELOPMENT",
  FACTORY = "FACTORY",
  PLANT = "PLANT",
  OTHER = "OTHER",
}

const propertyTypeDescriptions: Record<PropertyType, string> = {
  [PropertyType.APARTMENT]: "Apartment property type.",
  [PropertyType.HOUSE]: "House property type.",
  [PropertyType.VILLA]: "Villa property type.",
  [PropertyType.DUPLEX]: "Duplex property type.",
  [PropertyType.PENTHOUSE]: "Penthouse property type.",
  [PropertyType.STUDIO]: "Studio property type.",
  [PropertyType.CONDO]: "Condo property type.",
  [PropertyType.TOWNHOUSE]: "Townhouse property type.",
  [PropertyType.LOFT]: "Loft property type.",
  [PropertyType.COTTAGE]: "Cottage property type.",
  [PropertyType.BUNGALOW]: "Bungalow property type.",
  [PropertyType.CHALET]: "Chalet property type.",
  [PropertyType.CABIN]: "Cabin property type.",
  [PropertyType.MANSION]: "Mansion property type.",
  [PropertyType.RANCH]: "Ranch property type.",
  [PropertyType.FARM]: "Farm property type.",
  [PropertyType.OFFICE]: "Office property type.",
  [PropertyType.SHOP]: "Shop property type.",
  [PropertyType.RETAIL]: "Retail property type.",
  [PropertyType.WAREHOUSE]: "Warehouse property type.",
  [PropertyType.HOTEL]: "Hotel property type.",
  [PropertyType.HOSTEL]: "Hostel property type.",
  [PropertyType.GUESTHOUSE]: "Guesthouse property type.",
  [PropertyType.BEDANDBREAKFAST]: "Bed and Breakfast property type.",
  [PropertyType.RESORT]: "Resort property type.",
  [PropertyType.GARAGE]: "Garage property type.",
  [PropertyType.PARKING]: "Parking property type.",
  [PropertyType.AGRICULTURAL]: "Agricultural property type.",
  [PropertyType.DEVELOPMENT]: "Development property type.",
  [PropertyType.FACTORY]: "Factory property type.",
  [PropertyType.PLANT]: "Plant property type.",
  [PropertyType.OTHER]: "Other property type.",
};

interface Props {
  onChange?: (data: PropertyType[]) => void;
}

const typeIcons: Partial<Record<PropertyType, JSX.Element>> = {
  APARTMENT: (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1" />
    </svg>
  ),
  HOUSE: (
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
  CONDO: (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1" />
    </svg>
  ),
  TOWNHOUSE: (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="8" width="5" height="12" rx="1" />
      <rect x="15" y="4" width="5" height="16" rx="1" />
    </svg>
  ),
};

function getTypeIcon(type: PropertyType) {
  return (
    typeIcons[type] || (
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
    )
  );
}

const typeLabels: Partial<Record<PropertyType, string>> = {
  APARTMENT: "Apartments",
  HOUSE: "Houses",
  CONDO: "Condos",
  TOWNHOUSE: "Townhomes",
};

function getTypeLabel(type: PropertyType) {
  return typeLabels[type] || type.charAt(0) + type.slice(1).toLowerCase();
}

const MAIN_TYPES: PropertyType[] = [
  PropertyType.APARTMENT,
  PropertyType.HOUSE,
  PropertyType.CONDO,
  PropertyType.TOWNHOUSE,
];

const PropertyTypeSelect: FC<Props> = ({ onChange }) => {
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);

  function handleClear() {
    setSelectedTypes([]);
    onChange?.([]);
  }
  function handleDone(close: () => void) {
    close();
    onChange?.(selectedTypes);
  }

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex items-center rounded-full border ${open ? "border-green-600" : "border-gray-300"} h-[48px] min-w-[160px] bg-white px-5 py-2 text-base font-semibold text-green-700 shadow-sm focus:outline-none`}
          >
            <span>
              {selectedTypes.length > 0
                ? selectedTypes.map(getTypeLabel).join(", ")
                : "Home Type"}
            </span>
            <ChevronDownIcon className="ml-2 h-5 w-5 text-green-700" />
          </Popover.Button>
          <Popover.Panel className="absolute left-1/2 z-20 mt-2 w-[340px] max-w-full -translate-x-1/2 rounded-2xl border bg-white p-4 shadow-xl">
            <div className="mb-4 grid grid-cols-2 items-center justify-center gap-4">
              {MAIN_TYPES.map((type) => {
                const selected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    className={`relative flex flex-col items-center justify-center rounded-xl border p-5 text-base font-medium text-gray-800 shadow-sm transition-all focus:outline-none ${selected ? "border-green-600 ring-2 ring-green-200" : "border-gray-200 hover:border-green-400"}`}
                    onClick={() => {
                      const newState = selected
                        ? selectedTypes.filter((t) => t !== type)
                        : [...selectedTypes, type];
                      setSelectedTypes(newState);
                      onChange?.(newState);
                    }}
                  >
                    {getTypeIcon(type)}
                    <span className="mb-1 mt-2 text-base font-medium">
                      {getTypeLabel(type)}
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

export default PropertyTypeSelect;

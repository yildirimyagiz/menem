import React from "react";
import { Tab } from "@headlessui/react";
import { ListingType } from "@prisma/client";
import clsx from "clsx";

interface ListingTypeSelectProps {
  value: ListingType;
  onChange: (value: ListingType) => void;
  className?: string;
}

const listingTypeOptions = Object.values(ListingType);

const ListingTypeSelect: React.FC<ListingTypeSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <Tab.Group
      selectedIndex={listingTypeOptions.indexOf(value)}
      onChange={(idx) => onChange(listingTypeOptions[idx] ?? ListingType.SALE)}
    >
      <Tab.List
        className={clsx(
          "flex gap-2 rounded-full bg-neutral-100 p-1 dark:bg-neutral-700",
          className,
        )}
      >
        {listingTypeOptions.map((type) => (
          <Tab
            key={type}
            className={({ selected }) =>
              clsx(
                "w-full rounded-full px-4 py-2 text-sm font-medium leading-5 focus:outline-none",
                selected
                  ? "bg-white shadow-sm dark:bg-neutral-800"
                  : "text-neutral-700 hover:bg-white/70 dark:text-neutral-300 dark:hover:bg-neutral-900/40",
              )
            }
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
};

export default ListingTypeSelect;

"use client";

import { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";

import type { ListingType } from "@acme/db";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import Checkbox from "~/shared/Checkbox";

// Enum-driven options for ListingType
const listingTypeOptions: { name: ListingType; description?: string }[] = [
  { name: "SALE", description: "For Sale" },
  { name: "RENT", description: "For Rent" },
  { name: "BOOKING", description: "For Booking" },
];

interface RenderTabsListingTypeOptionsProps {
  onListingTypeChange: (listingType: ListingType) => void;
}

const RenderTabsListingTypeOptions = ({
  onListingTypeChange,
}: RenderTabsListingTypeOptionsProps) => {
  // Use direct strings instead of translations to avoid prefixes
  const translate = (key: ListingType | "listingType" | "clear" | "apply") => {
    // Map keys directly to avoid prefixes
    const translations: Record<string, string> = {
      listingType: "Property Type",
      clear: "Clear",
      apply: "Apply",
      SALE: "For Sale",
      RENT: "For Rent",
      BOOKING: "For Booking",
    };
    return translations[key] ?? key;
  };
  const handleListingTypeChange = (listingType: ListingType) => {
    onListingTypeChange(listingType);
  };

  return (
    <Popover className="relative">
      {({ open, close }: { open: boolean; close: () => void }) => (
        <>
          <PopoverButton
            aria-haspopup="true"
            aria-expanded={open}
            className={`dark:hover:border-neutral-6000 flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-400 focus:outline-none dark:border-neutral-700 ${
              open ? "!border-primary-500" : ""
            }`}
          >
            <span>{translate("listingType")}</span>
            <i className="las la-angle-down ml-2"></i>
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                <div className="relative flex flex-col space-y-5 px-5 py-6">
                  {listingTypeOptions.map((item) => (
                    <div
                      key={item.name}
                      className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Checkbox
                        name={item.name}
                        label={translate(item.name)}
                        subLabel={item.description}
                        onChange={() => handleListingTypeChange(item.name)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                  <ButtonThird onClick={close} sizeClass="px-4 py-2 sm:px-5">
                    {translate("clear")}
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={close}
                    type="button"
                    className="rounded bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 sm:px-6"
                    loading={false}
                  >
                    {translate("apply")}
                  </ButtonPrimary>
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default RenderTabsListingTypeOptions;

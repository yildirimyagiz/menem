"use client";

import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import Slider from "rc-slider";

import "rc-slider/assets/index.css"; // Import Slider CSS

import type { PropertyFilterInput } from "@acme/validators";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import convertNumbThousand from "~/utils/convertNumbThousand";

interface PriceRangePopoverProps {
  rangePrices: [number, number];
  setRangePrices: (prices: [number, number]) => void;
  onFilterChange: (filters: Partial<PropertyFilterInput>) => void;
} // Use the correct filter input type

const RenderTabsPriceRange: React.FC<PriceRangePopoverProps> = ({
  rangePrices,
  setRangePrices,
  onFilterChange,
}) => {
  const t = useTranslations();
  // Function to render the clear button
  const renderXClear = () => {
    return (
      <button
        onClick={() => {
          setRangePrices([0, 2000]);
          onFilterChange({ priceMin: 0, priceMax: 2000 });
        }}
        className="ml-2 text-red-500"
        aria-label="Clear price range"
      >
        X
      </button>
    );
  };

  const handlePriceChange = (values: number[] | number) => {
    if (Array.isArray(values)) {
      // Ensure values are numbers and not undefined
      const minValue = typeof values[0] === "number" ? values[0] : 0;
      const maxValue = typeof values[1] === "number" ? values[1] : 2000;

      // Update the range prices state
      setRangePrices([minValue, maxValue]);

      // Use the same values for filter change
      onFilterChange({ priceMin: minValue, priceMax: maxValue });
    }
  };

  return (
    <Popover className="relative">
      {({ open: _open, close }: { open: boolean; close: () => void }) => (
        <>
          <Popover.Button
            className={`border-primary-500 bg-primary-50 text-primary-700 flex items-center justify-center rounded-full border px-4 py-2 text-sm focus:outline-none`}
          >
            <span>
              {`$${convertNumbThousand(rangePrices[0])} - $${convertNumbThousand(rangePrices[1])}`}
            </span>
            {renderXClear()}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                <div className="relative flex flex-col space-y-8 px-5 py-6">
                  <div className="space-y-5">
                    <span className="font-medium">{t("price")}</span>
                    <Slider
                      range
                      min={0}
                      max={2000}
                      value={rangePrices}
                      allowCross={false}
                      onChange={handlePriceChange}
                    />
                  </div>

                  <div className="flex justify-between space-x-5">
                    <div>
                      <label
                        htmlFor="minPrice"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        {t("minPrice")}
                      </label>
                      <div className="relative mt-1 rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-neutral-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          name="minPrice"
                          id="minPrice"
                          className="block w-full rounded-full border-neutral-200 pl-7 pr-3 text-neutral-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={rangePrices[0]}
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="maxPrice"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        {t("maxPrice")}
                      </label>
                      <div className="relative mt-1 rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-neutral-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          name="maxPrice"
                          id="maxPrice"
                          className="block w-full rounded-full border-neutral-200 pl-7 pr-3 text-neutral-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={rangePrices[1]}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                  <ButtonThird
                    onClick={() => {
                      setRangePrices([0, 2000]);
                      onFilterChange({ priceMin: 0, priceMax: 2000 });
                      close();
                    }}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    {t("clear")}
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={close}
                    className="px-4 py-2 sm:px-5"
                    type="button"
                    loading={false}
                  >
                    {t("apply")}
                  </ButtonPrimary>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default RenderTabsPriceRange;

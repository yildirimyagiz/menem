import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import NcInputNumber from "~/components/NcInputNumber";
import ButtonClose from "~/shared/ButtonClose";
import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";

// Define the structure of the property filter options
interface TabMobileFilterProps {
  isOpenMoreFilter: boolean;
  openModalMoreFilter: () => void;
  closeModalMoreFilter: () => void;
  moreFilterOptions: {
    label: string;
    value: string;
  }[];
}

const TabMobileFilter: React.FC<TabMobileFilterProps> = ({
  isOpenMoreFilter,
  openModalMoreFilter,
  closeModalMoreFilter,
  moreFilterOptions,
}) => {
  // Direct translation mapping to avoid any prefixes
  const translate = (key: string) => {
    // Map keys directly without any prefixes
    const translations: Record<string, string> = {
      filters: "Filters",
      clear: "Clear",
      propertyType: "Property Type",
      rooms: "Rooms",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      price: "Price",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      apply: "Apply",
      furnished: "Furnished",
      petFriendly: "Pet Friendly",
      additionalOptions: "Additional Options",
    };
    return translations[key] ?? key;
  };
  // State for price range filter
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // States for additional filter values
  const [beds, setBeds] = useState<number>(1); // Beds state
  const [bedrooms, setBedrooms] = useState<number>(1); // Bedrooms state
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [furnished, setFurnished] = useState<boolean>(false);
  const [petFriendly, setPetFriendly] = useState<boolean>(false);

  // Handle slider range change
  const handleRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange([value[0] ?? 0, value[1] ?? 1000]);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    setBeds(1);
    setBedrooms(1);
    setBathrooms(1);
    setFurnished(false);
    setPetFriendly(false);
  };

  // Render clear button
  const renderXClear = (): React.ReactNode => (
    <span
      className="ml-2 cursor-pointer text-sm font-medium text-red-500 hover:underline"
      onClick={handleClearFilters}
    >
      {translate("clear")}
    </span>
  );

  // Render filter options dynamically
  const renderMoreFilterItem = (
    filters: {
      label: string;
      value: string;
    }[],
  ): React.ReactNode => (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <span
          key={index}
          className="cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
        >
          {filter.label}
        </span>
      ))}
    </div>
  );

  return (
    <div>
      {/* Filter Button */}
      <div
        className="border-primary-500 bg-primary-50 text-primary-700 flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm"
        onClick={openModalMoreFilter}
      >
        <span>{translate("filters")}</span>
        {renderXClear()}
      </div>

      {/* Modal */}
      <Transition appear show={isOpenMoreFilter} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalMoreFilter}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle">&#8203;</span>

            <Transition.Child
              as="div"
              className="inline-block w-full max-w-4xl transform rounded-2xl bg-white p-6 align-middle shadow-xl transition-all"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-medium">
                    {translate("filters")}
                  </h3>
                  <ButtonClose onClick={closeModalMoreFilter} />
                </div>

                {/* Content */}
                <div className="mt-6 space-y-8">
                  {/* Filter Type */}
                  <div>
                    <h4 className="text-xl font-medium">
                      {translate("propertyType")}
                    </h4>
                    <div className="mt-4">
                      {renderMoreFilterItem(moreFilterOptions)}{" "}
                      {/* Dynamically render options */}
                    </div>
                  </div>

                  {/* Rooms and Beds */}
                  <div>
                    <h4 className="text-xl font-medium">
                      {translate("rooms")}
                    </h4>
                    <div className="mt-4 space-y-4">
                      <NcInputNumber
                        label={translate("bedrooms")}
                        defaultValue={beds}
                        onChange={(value: number) => setBeds(value)}
                        max={10}
                      />
                      <NcInputNumber
                        label={translate("bedrooms")}
                        defaultValue={bedrooms}
                        onChange={(value: number) => setBedrooms(value)}
                        max={10}
                      />
                      <NcInputNumber
                        label={translate("bathrooms")}
                        defaultValue={bathrooms}
                        onChange={(value: number) => setBathrooms(value)}
                        max={10}
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="text-xl font-medium">
                      {translate("price")}
                    </h4>
                    <div className="mt-6">
                      <Slider
                        range
                        min={0}
                        max={2000}
                        value={priceRange}
                        onChange={handleRangeChange}
                      />

                      <div className="mt-4 flex justify-between">
                        <div>
                          <label
                            htmlFor="minPrice"
                            className="block text-sm font-medium"
                          >
                            {translate("minPrice")}
                          </label>
                          <input
                            id="minPrice"
                            type="text"
                            value={`$${priceRange[0]}`}
                            readOnly
                            className="mt-1 block w-full rounded-md border px-2 py-1"
                            aria-label={translate("minPrice")}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="maxPrice"
                            className="block text-sm font-medium"
                          >
                            {translate("maxPrice")}
                          </label>
                          <input
                            id="maxPrice"
                            type="text"
                            value={`$${priceRange[1]}`}
                            readOnly
                            className="mt-1 block w-full rounded-md border px-2 py-1"
                            aria-label={translate("maxPrice")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Furnished & Pet-Friendly */}
                  <div>
                    <h4 className="text-xl font-medium">
                      {translate("additionalOptions")}
                    </h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="furnished"
                          checked={furnished}
                          onChange={(e) => setFurnished(e.target.checked)}
                          aria-label={translate("furnished")}
                        />
                        <label htmlFor="furnished" className="ml-2">
                          {translate("furnished")}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="petFriendly"
                          checked={petFriendly}
                          onChange={(e) => setPetFriendly(e.target.checked)}
                          aria-label={translate("petFriendly")}
                        />
                        <label htmlFor="petFriendly" className="ml-2">
                          {translate("petFriendly")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-between border-t pt-4">
                  <ButtonThird onClick={handleClearFilters}>
                    {translate("clear")}
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={closeModalMoreFilter}
                    type={"button"}
                    className={""}
                    loading={false}
                  >
                    {translate("apply")}
                  </ButtonPrimary>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default TabMobileFilter;

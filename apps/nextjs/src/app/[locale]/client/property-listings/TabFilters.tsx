"use client";

// React imports
import type { FC } from "react";
import { Fragment, useState } from "react";
import { useParams } from "next/navigation";
// Third-party library imports
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { PropertyFilterParams } from "~/app/[locale]/_actions/filters/PropertyFilter";
import type { Status } from "~/utils/types";
import {
  defaultPropertyFilterParams,
  statusOptions,
  typeOfProperty,
} from "~/app/[locale]/_actions/filters/PropertyFilter";
// Local component imports
import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import Checkbox from "~/shared/Checkbox";
// Add new imports for API integration
import { api } from "~/trpc/client/react";
import RenderTabsAmenities from "./components/AmenitiesRender";
import FilterTranslationProvider from "./components/FilterTranslationProvider";
import RenderTabsOnSale from "./components/RenderTabsOnSale";
import RenderTabsPriceRange from "./components/RenderTabsPriceRange";
import RenderTabsPropertyTypeOptions from "./components/RenderTabsPropertyTypeOptions";
import RenderTabsRoomAndBeds from "./components/RenderTabsRoomAndBeds";
import TabMobileFilter from "./components/TabMobileFilter";
import RenderTabsTypeOfPlace from "./components/TypeOfPlace";

const filterOptions = [
  "Property Type",
  "Property Type",
  "Price",
  "Rooms",
  "Bathrooms",
  "Size (sqft)",
  "Floor",
  "Build Year",
  "Energy Efficiency Rating",
  "Furnished",
  "Pet-Friendly",
  "Garage Spaces",
  "Availability Date",
  "Property Status",
  "Featured",
  "Neighborhood Info",
];

interface TabFiltersProps {
  onChange: (filters: Partial<PropertyFilterParams>) => void;
  currentFilters: PropertyFilterParams;
  onFilterChange: (newFilters: Partial<PropertyFilterParams>) => void;
  setDataSource?: (source: "database" | "google") => void;
}

const TabFilters: FC<TabFiltersProps> = ({
  onChange: _onFilterChange,
  currentFilters: _currentFilters,
  setDataSource,
}) => {
  const params = useParams();
  const _locale = (params?.locale as string) || "en";
  const t = useTranslations();

  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [isOnSale, setIsOnSale] = useState(true);
  const [rangePrices, setRangePrices] = useState<[number, number]>([0, 2000]);

  const [propertyAmenities, setPropertyAmenities] = useState<string[]>([]);
  const [locationAmenities, setLocationAmenities] = useState<string[]>([]);
  const [facilityAmenities, setFacilityAmenities] = useState<string[]>([]);

  // Add new state for filter parameters
  const [filterParams, setFilterParams] = useState<PropertyFilterParams>({
    ...defaultPropertyFilterParams,
    minPrice: rangePrices[0],
    maxPrice: rangePrices[1],
    propertyAmenities: [],
    locationAmenities: [],
    facilityAmenities: [],
  });

  // Add API query with debouncing
  const { isLoading } = api.property.filter.useQuery(filterParams);

  const closeModalMoreFilter = () => setisOpenMoreFilter(false);
  const openModalMoreFilter = () => setisOpenMoreFilter(true);
  const renderXClear = () => {
    return (
      <span className="bg-primary-500 ml-3 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-white">
        <XMarkIcon className="h-3 w-3" />
      </span>
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      ...defaultPropertyFilterParams,
      minPrice: 0,
      maxPrice: 2000,
      propertyAmenities: [],
      locationAmenities: [],
      facilityAmenities: [],
    };
    setFilterParams(clearedFilters);
    setRangePrices([0, 2000]);
    setPropertyAmenities([]);
    setLocationAmenities([]);
    setFacilityAmenities([]);
    _onFilterChange(clearedFilters);
  };

  // Modify existing handlers to reduce redundancy
  const handleFilterChange = (
    key: keyof PropertyFilterParams,
    value: unknown,
  ) => {
    const newFilters = {
      ...filterParams,
      [key]: value,
    };
    setFilterParams(newFilters);
    _onFilterChange(newFilters);
  };

  const _renderMoreFilterItem = (
    data: {
      name: string;
      description?: string;
      defaultChecked?: boolean;
    }[],
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex max-h-60 flex-col space-y-5 overflow-y-auto">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              checked={!!item.defaultChecked}
            />
          ))}
        </div>
        <div className="flex max-h-60 flex-col space-y-5 overflow-y-auto">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              checked={!!item.defaultChecked}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTabsStatusOptions = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <PopoverButton
              className={`flex items-center justify-center rounded-full border px-4 py-2 text-sm transition-all hover:shadow-lg focus:outline-none ${
                open
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700"
              }`}
            >
              <span className="inline-flex items-center">
                <i className="las la-info-circle mr-2 text-lg"></i>
                {t("status")}
              </span>
              <i
                className={`las la-angle-down ml-2 transition-transform ${open ? "rotate-180" : ""}`}
              ></i>
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
                  <div className="relative flex max-h-60 flex-col space-y-5 overflow-y-auto px-5 py-6">
                    {statusOptions.map((item) => (
                      <div key={item.name}>
                        <Checkbox
                          name={item.name}
                          label={t(`${item.name}`)}
                          subLabel={t(`${item.name}_DESC`)}
                          onChange={() =>
                            handleFilterChange("status", item.name as Status)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                    <ButtonThird onClick={close} sizeClass="px-4 py-2 sm:px-5">
                      {t("clear")}
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={close}
                      type="button"
                      className="px-4 py-2 sm:px-5"
                      loading={false}
                    >
                      {t("apply")}
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

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex w-full items-center justify-center py-4">
          <div className="border-3 border-primary-500 h-6 w-6 animate-spin rounded-full border-t-transparent"></div>
          <span className="ml-2 text-sm font-medium">{t("loading")}</span>
        </div>
      ) : (
        <>
          {/* Desktop Filter Row */}
          <div className="hidden w-full lg:block">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <FilterTranslationProvider>
                <RenderTabsPropertyTypeOptions
                  onPropertyTypeChange={handleFilterChange.bind(
                    null,
                    "listingType",
                  )}
                />
              </FilterTranslationProvider>
              {renderTabsStatusOptions()}
              <FilterTranslationProvider>
                <RenderTabsTypeOfPlace />
              </FilterTranslationProvider>
              <FilterTranslationProvider>
                <RenderTabsRoomAndBeds />
              </FilterTranslationProvider>
              <FilterTranslationProvider>
                <RenderTabsPriceRange
                  rangePrices={rangePrices}
                  setRangePrices={setRangePrices}
                  onFilterChange={(filters) => {
                    handleFilterChange("minPrice", filters.minPrice);
                    handleFilterChange("maxPrice", filters.maxPrice);
                  }}
                />
              </FilterTranslationProvider>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <FilterTranslationProvider>
                  <RenderTabsOnSale
                    isOnSale={isOnSale}
                    setIsOnSale={setIsOnSale}
                    renderXClear={renderXClear}
                  />
                </FilterTranslationProvider>
                <FilterTranslationProvider>
                  <RenderTabsAmenities
                    amenities={{
                      propertyAmenities,
                      locationAmenities,
                      facilityAmenities,
                    }}
                    onAmenitiesChange={(type, amenities) => {
                      if (type === "property") setPropertyAmenities(amenities);
                      if (type === "location") setLocationAmenities(amenities);
                      if (type === "facility") setFacilityAmenities(amenities);
                    }}
                  />
                </FilterTranslationProvider>
              </div>

              <ButtonThird
                onClick={clearAllFilters}
                sizeClass="px-3 py-1.5 text-sm"
                className="ml-auto"
              >
                <i className="las la-times-circle mr-1"></i>
                {t("clearAll")}
              </ButtonThird>
            </div>
          </div>

          {/* Mobile Filter Row */}
          <div className="flex w-full flex-col gap-3 lg:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <FilterTranslationProvider>
                <TabMobileFilter
                  isOpenMoreFilter={isOpenMoreFilter}
                  openModalMoreFilter={openModalMoreFilter}
                  closeModalMoreFilter={closeModalMoreFilter}
                  moreFilterOptions={filterOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />
              </FilterTranslationProvider>
              <FilterTranslationProvider>
                <RenderTabsOnSale
                  isOnSale={isOnSale}
                  setIsOnSale={setIsOnSale}
                  renderXClear={renderXClear}
                />
              </FilterTranslationProvider>
              <ButtonThird
                onClick={clearAllFilters}
                sizeClass="px-3 py-1.5 text-sm"
                className="ml-auto"
              >
                {t("clearAll")}
              </ButtonThird>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabFilters;

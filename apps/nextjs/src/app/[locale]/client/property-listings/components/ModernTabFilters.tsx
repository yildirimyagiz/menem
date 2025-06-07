"use client";

import type { FC } from "react";
import type { z } from "zod";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaBath, FaBed, FaChevronDown, FaHome, FaTag } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import type { Property } from "@acme/db";
import type {
  FacilityAmenities,
  FacilityType,
  FacilityType as FacilityTypeType,
  LocationAmenities,
  PropertyAmenities,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@acme/validators";
import { FacilityType as FacilityTypeDB } from "@acme/db";

import type { PropertyFilterParams } from "../../../filters/PropertyFilter";
import ButtonPrimary from "~/shared/ButtonPrimary";
import { defaultPropertyFilterParams } from "../../../filters/PropertyFilter";

// Convert Zod enums to TypeScript types
export type PropertyType = z.infer<typeof PropertyType>;
export type PropertyAmenities = z.infer<typeof PropertyAmenities>;
export type FacilityAmenities = z.infer<typeof FacilityAmenities>;
export type LocationAmenities = z.infer<typeof LocationAmenities>;

// Define filter option types
export interface FilterOption {
  id: string;
  label: string;
  value: string | number | boolean | (string | number)[];
  icon?: React.ReactNode;
  isSelected?: boolean;
}

export interface FilterCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  type: "select" | "range" | "checkbox" | "radio";
  allowMultiple?: boolean;
}

interface ModernTabFiltersProps {
  onFilterChange: (filters: Partial<PropertyFilterParams>) => void;
  currentFilters: PropertyFilterParams;
  className?: string;
  limit: number;
  propertyTypeOptions: string[];
  propertyStatusOptions: string[];
  propertyCategoryOptions: string[];
  propertyConditionOptions: string[];
  ownershipTypeOptions: string[];
  ownershipCategoryOptions: string[];
  buildingClassOptions: string[];
  energyRatingOptions: string[];
  contactMethodOptions: string[];
  propertyFeatureOptions: string[];
}

const ModernTabFilters: FC<ModernTabFiltersProps> = ({
  onFilterChange,
  currentFilters,
  className = "",
  limit = 12,

  propertyTypeOptions,
  propertyStatusOptions,
  propertyCategoryOptions,
  propertyConditionOptions,
  ownershipTypeOptions,
  ownershipCategoryOptions,
  buildingClassOptions,
  energyRatingOptions,
  contactMethodOptions,
  propertyFeatureOptions,
}) => {
  const t = useTranslations("PropertyFilters");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const handleAddFilter = (option: FilterOption, categoryId: string) => {
    const newFilters = [...activeFilters];
    const existingFilterIndex = newFilters.findIndex((f) => f.id === option.id);

    if (existingFilterIndex >= 0) {
      newFilters.splice(existingFilterIndex, 1);
    } else {
      newFilters.push(option);
    }

    setActiveFilters(newFilters);
    updateParentFilters(newFilters);
  };

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = activeFilters.filter((f) => f.id !== filterId);
    setActiveFilters(newFilters);
    updateParentFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange(defaultPropertyFilterParams);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handlePriceRangeSubmit = () => {
    onFilterChange({
      ...currentFilters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const updateParentFilters = (filters: FilterOption[]) => {
    const newFilters: Partial<PropertyFilterParams> = { ...currentFilters };

    filters.forEach((filter) => {
      switch (filter.id) {
        case "propertyType":
          newFilters.propertyType = filter.value as z.infer<
            typeof PropertyType
          >;
          break;
        case "propertyStatus":
          newFilters.propertyStatus = filter.value as z.infer<
            typeof PropertyStatus
          >;
          break;
        case "propertyFeatures":
          newFilters.features = filter.value as z.infer<
            typeof PropertyFeatures
          >[];
          break;
        case "propertyAmenities":
          if (Array.isArray(filter.value)) {
            const amenities = filter.value
              .filter((value): value is string => typeof value === "string")
              .map(
                (value) =>
                  value as
                    | "POOL"
                    | "GYM"
                    | "GARDEN"
                    | "PARKING"
                    | "SECURITY"
                    | "ELEVATOR"
                    | "STORAGE"
                    | "BALCONY"
                    | "TERRACE"
                    | "FURNISHED",
              );
            newFilters.propertyAmenities = amenities;
          }
          break;
        case "facilityAmenities":
          if (Array.isArray(filter.value)) {
            const amenities = filter.value.filter(
              (value): value is keyof typeof FacilityTypeDB =>
                typeof value === "string" &&
                Object.values(FacilityTypeDB).includes(
                  value as keyof typeof FacilityTypeDB,
                ),
            );
            newFilters.facilityAmenities = amenities as any;
          }
          break;
        case "locationAmenities":
          if (Array.isArray(filter.value)) {
            const amenities = filter.value
              .filter((value): value is string => typeof value === "string")
              .map(
                (value) =>
                  value as
                    | "CITY_CENTER"
                    | "BEACH"
                    | "PARK"
                    | "SHOPPING_MALL"
                    | "HOSPITAL"
                    | "SCHOOL"
                    | "UNIVERSITY"
                    | "POLICE_STATION"
                    | "FIRE_STATION"
                    | "PUBLIC_TRANSPORT"
                    | "SUBWAY_STATION"
                    | "BUS_STOP"
                    | "AIRPORT"
                    | "RESTAURANT_DISTRICT"
                    | "ENTERTAINMENT_ZONE"
                    | "BUSINESS_DISTRICT"
                    | "CULTURAL_CENTER"
                    | "MUSEUM"
                    | "LIBRARY"
                    | "SPORTS_COMPLEX",
              );
            newFilters.locationAmenities = amenities;
          }
          break;
        // Add more cases as needed
      }
    });

    onFilterChange(newFilters);
  };

  const renderFilterContent = (category: FilterCategory) => {
    switch (category.type) {
      case "select":
        return (
          <div className="space-y-2">
            {category.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAddFilter(option, category.id)}
                className={`w-full rounded-lg px-4 py-2 text-left ${
                  activeFilters.some((f) => f.id === option.id)
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        );

      case "range":
        return (
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  handlePriceRangeChange(Number(e.target.value), priceRange[1])
                }
                className="w-32 rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600"
                placeholder={t("minPrice")}
              />
              <span className="mx-2">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceRangeChange(priceRange[0], Number(e.target.value))
                }
                className="w-32 rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600"
                placeholder={t("maxPrice")}
              />
            </div>
            <ButtonPrimary
              type="button"
              className="w-full"
              onClick={handlePriceRangeSubmit}
              loading={false}
            >
              {t("apply")}
            </ButtonPrimary>
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {category.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.some((f) => f.id === option.id)}
                  onChange={() => handleAddFilter(option, category.id)}
                  className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-neutral-300 dark:border-neutral-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {category.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <input
                  type="radio"
                  checked={activeFilters.some((f) => f.id === option.id)}
                  onChange={() => handleAddFilter(option, category.id)}
                  className="text-primary-600 focus:ring-primary-500 h-4 w-4 border-neutral-300 dark:border-neutral-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`nc-ModernTabFilters ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className="bg-primary-50 text-primary-600 dark:bg-primary-900/20 flex items-center gap-2 rounded-full px-3 py-1 text-sm"
              >
                <span>{filter.label}</span>
                <button
                  onClick={() => handleRemoveFilter(filter.id)}
                  className="text-primary-600 hover:text-primary-700"
                  aria-label="Remove filter"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleClearAllFilters}
              className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            >
              {t("clearAll")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTabFilters;

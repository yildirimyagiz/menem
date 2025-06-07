"use client";

import type { JsonValue } from "@prisma/client/runtime/library";
import type { FC } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import type {
  Event,
  GreenCertification,
  HeatingType,
  ParkingType,
  Photo,
  Property,
  PropertyAmenities,
} from "@acme/db";
import type { PropertyFilterInput } from "@acme/validators";
import {
  BuildingClass,
  ContactMethod,
  EnergyRating,
  OwnershipCategory,
  OwnershipType,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@acme/db";

import type { PropertyFilterParams } from "../../filters/PropertyFilter";
import MapContainer from "~/components/MapContainer";
import PropertyCardH from "~/components/PropertyCardH";
import Pagination from "~/shared/Pagination";
import { api } from "~/trpc/react";
import { defaultPropertyFilterParams } from "../../filters/PropertyFilter";
import ModernTabFilters from "./components/ModernTabFilters";

// Define a type for Property including necessary relations and potential API inconsistencies
type PropertyWithRelations = Property & {
  Location?: {
    id: string;
    address: string;
    coordinates: { lat: number; lng: number } | JsonValue | null;
    city?: string | null;
    country?: string | null;
    postalCode?: string | null;
  } | null;
  Photo?: Photo[] | null;
  PricingRules?:
    | {
        id: string;
        baseAmount: number;
        finalAmount: number;
        currency: string;
        isActive: boolean;
        deletedAt?: Date | null;
      }[]
    | null;
  Owner?: unknown | null;
  Review?: unknown[] | null;
  Facility?: unknown | null;
  Analytics?: unknown[] | null;
  ComplianceRecord?: unknown[] | null;
  Expense?: unknown[] | null;
  Increase?: unknown[] | null;
  Mention?: unknown[] | null;
  Hashtag?: unknown[] | null;
  IncludedService?: unknown | null;
  ExtraCharge?: unknown | null;
  Availability?: unknown[] | null;
  TaxRecord?: unknown[] | null;
  Mortgage?: unknown[] | null;
  parkingSpaces?: number | null;
  parkingType?: ParkingType | null;
  heatingType?: HeatingType | null;
  greenCertification?: GreenCertification | null;
  events?: Event[] | null;
  features?: PropertyFeatures[] | null;
  amenities?: PropertyAmenities[] | null;
};

// Use PropertyFilterParams directly for the state type to ensure compatibility
type SectionGridMapFiltersState = PropertyFilterParams;

const mapLocalFiltersToApiFilters = (
  filters: Partial<SectionGridMapFiltersState>,
): Partial<PropertyFilterInput> => {
  const { listingType, ...apiFilters } = filters as Partial<
    PropertyFilterParams & { listingType?: string }
  >;
  return {
    ...apiFilters,
    pageSize: filters.pageSize ?? 12,
    page: filters.page,
    sortBy: filters.sortBy === "size" ? "createdAt" : filters.sortBy,
    sortOrder: filters.sortOrder ?? "desc",
    ...(listingType && {
      listingType:
        listingType === "all"
          ? undefined
          : (listingType as "ForSale" | "ForRent"),
    }),
  };
};

// --- SectionGridHasMapProps ---
export interface SectionGridHasMapProps {
  className?: string;
  data?: PropertyWithRelations[];
  onFilterChange?: (filters: Partial<PropertyFilterParams>) => void;
  currentFilters?: PropertyFilterParams;
  price?: {
    minPrice?: number;
    maxPrice?: number;
    amount: number;
    currency: string;
  };
  title?: string;
  subtitle?: string;
  noPropertiesText?: string;
  loadingText?: string;
  hideFilters?: boolean;
}

const SectionGridHasMap: FC<SectionGridHasMapProps> = ({
  className = "",
  data: initialData,
  onFilterChange,
  currentFilters: initialFilters,
  noPropertiesText = "No properties found",
  loadingText = "Loading...",
  hideFilters = false,
}) => {
  const t = useTranslations("PropertyListing");
  const [filters, setFilters] = useState<PropertyFilterParams>(
    initialFilters ?? { ...defaultPropertyFilterParams, sortOrder: "desc" },
  );
  const [currentHoverID, setCurrentHoverID] = useState<string>("-1");

  // Define filter options
  const propertyTypeOptions = Object.values(PropertyType);
  const propertyStatusOptions = Object.values(PropertyStatus);
  const propertyCategoryOptions = Object.values(PropertyCategory);
  const propertyConditionOptions = Object.values(PropertyCondition);
  const ownershipTypeOptions = Object.values(OwnershipType);
  const ownershipCategoryOptions = Object.values(OwnershipCategory);
  const buildingClassOptions = Object.values(BuildingClass);
  const energyRatingOptions = Object.values(EnergyRating);
  const contactMethodOptions = Object.values(ContactMethod);
  const propertyFeatureOptions = Object.values(PropertyFeatures);

  const sanitizeProperty = (property: PropertyWithRelations | null) => {
    if (!property) return null;
    let coordinates: { lat: number; lng: number } | null = null;
    if (
      property.Location &&
      property.Location.coordinates &&
      typeof property.Location.coordinates === "object" &&
      property.Location.coordinates !== null
    ) {
      const coords = property.Location.coordinates as Record<string, unknown>;
      if (typeof coords.lat === "number" && typeof coords.lng === "number") {
        coordinates = { lat: coords.lat, lng: coords.lng };
      }
    }
    return {
      ...property,
      coordinates,
      address: property.Location?.address ?? null,
      city: property.Location?.city ?? null,
      country: property.Location?.country ?? null,
      postalCode: property.Location?.postalCode ?? null,
      features: Array.isArray(property.features) ? property.features : [],
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      Photo: property.Photo ?? [],
    };
  };

  const { data, isLoading, error } = api.property.all.useQuery(
    mapLocalFiltersToApiFilters(filters),
    {
      initialData: initialData
        ? {
            data: {
              data: initialData.map(sanitizeProperty) as any[],
              page: 1,
              limit: (filters as any).pageSize ?? 12,
              total: initialData.length,
            },
            meta: undefined,
          }
        : undefined,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const properties = useMemo(() => {
    return (data?.data?.data || []).filter(
      (p): p is NonNullable<typeof p> & PropertyWithRelations => {
        if (!p?.Location) return false;
        const location = p.Location;
        const coords = location.coordinates as {
          lat: number;
          lng: number;
        } | null;
        return (
          coords !== null &&
          typeof coords.lat === "number" &&
          typeof coords.lng === "number"
        );
      },
    );
  }, [data]);

  const totalCount = data?.data?.total ?? 0;

  const handleFilterChange = useCallback(
    (newFilters: Partial<PropertyFilterParams>) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
        page: 1,
      }));
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [onFilterChange],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        page,
      }));
      if (onFilterChange) {
        onFilterChange({ ...filters, page });
      }
    },
    [filters, onFilterChange],
  );

  const mapProps = useMemo(
    () => ({
      currentHoverID,
      markers: properties.map((property) => {
        const coords = property.Location?.coordinates as {
          lat: number;
          lng: number;
        } | null;
        return {
          id: property.id,
          title: property.title,
          address: property.Location?.address ?? t("addressNotAvailable"),
          coordinates: {
            lat: coords?.lat ?? 0,
            lng: coords?.lng ?? 0,
          },
          featuredImage:
            property.Photo?.[0]?.url ?? "/images/default-property.jpg",
          price: property.marketValue ?? undefined,
          propertyType: property.propertyType,
        };
      }),
      className: "h-[500px] w-full",
    }),
    [currentHoverID, properties, t],
  );

  return (
    <div className={`nc-SectionGridHasMap ${className}`}>
      <div className={`flex flex-col lg:flex-row`}>
        {!hideFilters && (
          <div className={`flex-shrink-0 lg:w-1/3 xl:w-1/4`}>
            <ModernTabFilters
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              propertyTypeOptions={propertyTypeOptions}
              propertyStatusOptions={propertyStatusOptions}
              propertyCategoryOptions={propertyCategoryOptions}
              propertyConditionOptions={propertyConditionOptions}
              ownershipTypeOptions={ownershipTypeOptions}
              ownershipCategoryOptions={ownershipCategoryOptions}
              buildingClassOptions={buildingClassOptions}
              energyRatingOptions={energyRatingOptions}
              contactMethodOptions={contactMethodOptions}
              propertyFeatureOptions={propertyFeatureOptions}
              limit={0}
            />
          </div>
        )}
        <div className={`mt-8 flex-grow lg:mt-0`}>
          {isLoading ? (
            <div className="text-center text-neutral-500">{loadingText}</div>
          ) : error ? (
            <div className="text-center text-red-500">
              {t("errorFetchingProperties")}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center text-neutral-500">
              {noPropertiesText}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {properties.map((property) => (
                <PropertyCardH key={property.id} property={property} />
              ))}
            </div>
          )}
          {totalCount > ((filters as any).pageSize ?? 12) && (
            <div className="mt-16 flex items-center justify-center">
              <Pagination
                page={filters.page ?? 1}
                totalPages={Math.ceil(
                  totalCount / ((filters as any).pageSize ?? 12),
                )}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 lg:mt-10">
        <MapContainer {...mapProps} />
      </div>
    </div>
  );
};

export default SectionGridHasMap;

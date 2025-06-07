"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useTranslations } from "next-intl";

import type { ListingType, Location, Property } from "@acme/db";
import type { PropertyFilterInput } from "@acme/validators";
import {
  BuildingClass,
  ContactMethod,
  EnergyRating,
  OwnershipCategory,
  OwnershipType,
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@acme/db";

import type { PropertyFilterParams } from "../../../filters/PropertyFilter";
import ButtonPrimary from "~/shared/ButtonPrimary";
import { api } from "~/trpc/react";
import PropertyHeader from "../components/ListingHeader";
import MapPropertyTabs from "../components/MapPropertyTabs";
import ModernTabFilters from "../components/ModernTabFilters";
import { default as SectionGridHasMap } from "../SectionGridHasMap";

// Define the coordinates type
interface Coordinates {
  lat: number;
  lng: number;
}

// Define a type that includes the Location relation with proper coordinates
type PropertyWithLocation = Property & {
  Location:
    | (Location & {
        coordinates: Coordinates | null;
      })
    | null;
};

// Extend PropertyFilterInput to include listingType
type ExtendedPropertyFilterInput = PropertyFilterInput & {
  listingType?: ListingType;
};

export type PropertyRealEstateMapPageProps = object;

const PropertyRealEstateMapPage: FC<PropertyRealEstateMapPageProps> = () => {
  const t = useTranslations();
  const router = useRouter();
  const [filters, setFilters] = useState<Partial<ExtendedPropertyFilterInput>>({
    page: 1,
    pageSize: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const mapUiFiltersToApi = (
    uiFilters: Partial<PropertyFilterParams>,
  ): Partial<ExtendedPropertyFilterInput> => ({
    ...uiFilters,
    pageSize: (uiFilters as any).pageSize ?? (uiFilters as any).limit ?? 12,
    sortBy: uiFilters.sortBy === "size" ? "createdAt" : uiFilters.sortBy,
  });

  const { data: propertyData, isLoading: dataLoading } =
    api.property.all.useQuery({
      ...filters,
      sortOrder: filters.sortOrder ?? "desc",
    });

  // Filter out nulls and transform the data to match our expected structure
  const properties = (propertyData?.data?.data || [])
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => {
      // Transform the coordinates from JsonValue to Coordinates
      const location = p.Location
        ? {
            ...p.Location,
            coordinates: p.Location
              .coordinates as unknown as Coordinates | null,
          }
        : null;

      return {
        ...p,
        Location: location,
      } as PropertyWithLocation;
    });

  // Enhanced logging for debugging
  useEffect(() => {
    if (properties.length > 0) {
      console.log("Filtered Properties Count:", properties.length);

      const firstProperty = properties[0];
      if (firstProperty) {
        console.log("First Property ID:", firstProperty.id);
        console.log("First Property Title:", firstProperty.title);
        console.log(
          "First Property Coordinates:",
          firstProperty.Location?.coordinates,
        );
        console.log("First Property Address:", firstProperty.Location?.address);
        console.log("First Property City:", firstProperty.Location?.city);
        console.log("First Property Country:", firstProperty.Location?.country);
      }

      // Log the locations array that will be passed to MapContainer
      const mapLocations = properties.map((property) => {
        const coords = property.Location?.coordinates;
        const lat = coords?.lat ?? 40.7128;
        const lng = coords?.lng ?? -74.006;
        return {
          id: property.id,
          title: property.title,
          address: property.Location?.address ?? "",
          position: {
            lat: isNaN(lat) ? 40.7128 : lat,
            lng: isNaN(lng) ? -74.006 : lng,
          },
        };
      });

      if (mapLocations.length > 0) {
        console.log("Locations for map (first 3):", mapLocations.slice(0, 3));
      }

      const validLocations = mapLocations.filter(
        (loc) =>
          loc.position.lat !== 0 &&
          loc.position.lng !== 0 &&
          !isNaN(loc.position.lat) &&
          !isNaN(loc.position.lng),
      );
      console.log("Valid locations with coordinates:", validLocations.length);
      if (validLocations.length > 0) {
        console.log("First valid location:", validLocations[0]);
      }
    } else {
      console.log("No properties found in filtered properties array");
    }

    // Log the raw property data from the API
    if (propertyData?.data?.data) {
      console.log("Raw API Data Count:", propertyData.data.data.length);
      propertyData.data.data.slice(0, 3).forEach((prop, index) => {
        if (prop?.Location?.coordinates) {
          const coords = prop.Location.coordinates as unknown as Coordinates;
          console.log(`Raw API Data Property ${index} Coordinates:`, {
            id: prop.id,
            lat: coords.lat,
            lng: coords.lng,
            address: prop.Location.address,
          });
        } else if (prop) {
          console.log(
            `Raw API Data Property ${index} (ID: ${prop.id}) has no coordinates data.`,
          );
        }
      });
    }

    console.log(
      "Google Maps API Key available:",
      !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    );
  }, [properties, propertyData]);

  const propertyCount = properties.length;
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const handleFilterChange = (newFilters: Partial<PropertyFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...mapUiFiltersToApi(newFilters),
      sortOrder: newFilters.sortOrder ?? prev.sortOrder ?? "desc",
    }));
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc",
  ) => {
    handleFilterChange({
      sortBy: newSortBy as "createdAt" | "updatedAt" | "price",
      sortOrder: newSortOrder,
    });
  };

  if (dataLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        <span className="ml-2 text-lg">{t("loading")}</span>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    console.log("Tab changed to:", tab);
    if (tab === "#for-sale") {
      handleFilterChange({ type: "SALE" } as Partial<PropertyFilterParams>);
    } else if (tab === "#for-rent") {
      handleFilterChange({ type: "RENT" } as Partial<PropertyFilterParams>);
    } else if (tab === "#all") {
      const { listingType, ...rest } = filters;
      handleFilterChange(rest as Partial<PropertyFilterParams>);
    }
  };

  // Generate filter option arrays from enums
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
  const propertyAmenityOptions = Object.values(PropertyAmenities);

  // Construct filters object for ModernTabFilters
  const filtersForModernTab = {
    ...filters,
    sortBy: filters.sortBy ?? "createdAt",
    sortOrder: filters.sortOrder ?? "desc",
  };

  return (
    <div className="flex h-[calc(100vh-96px)] w-full flex-col overflow-hidden">
      <div className="w-full">
        <PropertyHeader
          currentView="map"
          totalCount={propertyCount}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          filters={filters}
        />

        <div className="w-full bg-white py-6 shadow-sm">
          <div className="container mx-auto">
            <div className="mb-5 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  {t("title", { city: t("allLocations") })}
                </h1>
                <div className="mt-2 flex items-center justify-center">
                  <span className="bg-primary-100 text-primary-700 rounded-full px-3 py-1.5 text-sm font-medium">
                    {propertyCount}{" "}
                    {propertyCount === 1 ? t("property") : t("properties")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="mb-5">
                <MapPropertyTabs
                  onTabChange={handleTabChange}
                  totalProperties={propertyCount}
                  onToggleFilters={() => setIsFiltersVisible(!isFiltersVisible)}
                  isFiltersVisible={isFiltersVisible}
                />
              </div>

              {isFiltersVisible && (
                <div className="mb-6 transition-all duration-300 ease-in-out">
                  <ModernTabFilters
                    onFilterChange={handleFilterChange}
                    currentFilters={filters as PropertyFilterParams}
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
                    className="w-full"
                    limit={12}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container-fluid h-full">
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}
            libraries={["places"]}
          >
            <SectionGridHasMap
              className="h-full"
              data={properties}
              price={{
                minPrice: filters.priceMin ?? 0,
                maxPrice: filters.priceMax ?? 1000000,
                amount: 0,
                currency: "USD",
              }}
              onFilterChange={handleFilterChange}
              currentFilters={filtersForModernTab}
              noPropertiesText={t("noProperties")}
              loadingText={t("loading")}
              hideFilters={true}
            />
          </APIProvider>
        </div>
      </div>
    </div>
  );
};

export default PropertyRealEstateMapPage;

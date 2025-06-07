"use client";

import type { FC } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import type {
  PropertyFilterInput,
  Property as ValidatorProperty,
} from "@acme/validators";

import type { PropertyFilterParams } from "../../../filters/PropertyFilter";
import { api } from "~/trpc/react";
import PropertyHeader from "../components/ListingHeader";
import ModernTabFilters from "../components/ModernTabFilters";
import SectionGridFilterCard from "../SectionGridFilterCard";

export type PropertyRealEstatePageProps = object;

type Property = ValidatorProperty;

const PropertyRealEstatePage: FC<PropertyRealEstatePageProps> = () => {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Partial<PropertyFilterInput>>({
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    pageSize: 12,
  });
  const propertiesPerPage = 12;

  const mapUiFiltersToApi = (
    uiFilters: Partial<PropertyFilterParams>,
  ): Partial<PropertyFilterInput> => ({
    ...uiFilters,
    pageSize: (uiFilters as any).pageSize ?? 12,
    sortBy: uiFilters.sortBy === "size" ? "createdAt" : uiFilters.sortBy,
  });

  const { data, isLoading } = api.property.all.useQuery({
    ...filters,
    sortOrder: filters.sortOrder ?? "desc",
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: Partial<PropertyFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...mapUiFiltersToApi(newFilters),
      sortOrder: newFilters.sortOrder ?? prev.sortOrder ?? "desc",
    }));
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as PropertyFilterInput["sortBy"],
      sortOrder: sortOrder,
    }));
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  type PropertyApiResponse =
    | {
        data: {
          data: (Property | null)[];
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        meta: Record<string, unknown> | undefined;
      }
    | undefined;

  const properties: Property[] = (
    (data as PropertyApiResponse)?.data?.data ?? []
  ).filter((p): p is Property => p !== null);

  const totalCount = (data as PropertyApiResponse)?.data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / propertiesPerPage);

  const filtersForModernTab: PropertyFilterParams = {
    sortBy: filters.sortBy ?? "createdAt",
    sortOrder: filters.sortOrder ?? "desc",
    title: filters.title ?? undefined,
    locationId: filters.locationId ?? undefined,
    category: filters.category ?? undefined,
    status: filters.status ?? undefined,
    condition: filters.condition ?? undefined,
    ownerId: filters.ownerId ?? undefined,
    agencyId: filters.agencyId ?? undefined,
    createdAtFrom: filters.createdAtFrom ?? undefined,
    createdAtTo: filters.createdAtTo ?? undefined,
    listedAtFrom: filters.listedAtFrom ?? undefined,
    listedAtTo: filters.listedAtTo ?? undefined,
    priceMin: filters.priceMin ?? undefined,
    priceMax: filters.priceMax ?? undefined,
    page: filters.page ?? undefined,
    pageSize: filters.pageSize ?? undefined,
    type: (filters as any).propertyType ?? undefined,
    features: (filters as any).features ?? undefined,
    propertyAmenities: (filters as any).propertyAmenities ?? undefined,
    facilityAmenities: (filters as any).facilityAmenities ?? undefined,
    locationAmenities: (filters as any).locationAmenities ?? undefined,
  } as PropertyFilterParams;

  return (
    <div>
      <PropertyHeader
        currentView="grid"
        totalCount={totalCount}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <div className="mb-6 transition-all duration-300 ease-in-out">
        <ModernTabFilters
          currentFilters={filters as PropertyFilterParams}
          onFilterChange={handleFilterChange}
          propertyTypeOptions={[]}
          propertyStatusOptions={[]}
          propertyCategoryOptions={[]}
          propertyConditionOptions={[]}
          ownershipTypeOptions={[]}
          ownershipCategoryOptions={[]}
          buildingClassOptions={[]}
          energyRatingOptions={[]}
          contactMethodOptions={[]}
          propertyFeatureOptions={[]}
          limit={0}
        />
      </div>
      <div className="container mx-auto py-6">
        <SectionGridFilterCard
          className="pb-24 lg:pb-28"
          data={properties}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          noPropertiesText={t("noProperties")}
          hideHeader={true}
        />
      </div>
    </div>
  );
};

export default PropertyRealEstatePage;

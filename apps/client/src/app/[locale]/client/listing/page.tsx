"use client";

import { useState } from "react";

import { Button } from "@reservatior/ui/button";

import { api } from "~/trpc/react";
import ListingFilterBar from "./components/ListingFilterBar";
import ListingGrid from "./components/ListingGrid";
import ListingMap from "./components/ListingMap";
import ListingPagination from "./components/ListingPagination";

const PAGE_SIZE = 12;
const defaultPropertyFilterParams = {
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  pageSize: PAGE_SIZE,
};

function transformFiltersForApi(filters: any = {}) {
  filters = filters || {};
  const out: any = { ...filters };
  // Search (title/address)
  if (filters.search) {
    out.title = filters.search;
  }
  // Add more filter transforms as needed (bedrooms, price, etc.)
  if (filters.bedrooms) {
    if (filters.bedrooms === "5+") {
      out.bedrooms = { gte: 5 };
    } else {
      const num = Number(filters.bedrooms);
      if (!isNaN(num)) out.bedrooms = { gte: num };
    }
  }
  if (filters.bathrooms) {
    if (filters.bathrooms === "4+") {
      out.bathrooms = { gte: 4 };
    } else {
      const num = Number(filters.bathrooms);
      if (!isNaN(num)) out.bathrooms = { gte: num };
    }
  }
  if (filters.sizeMin || filters.sizeMax) {
    out.size = {
      ...(filters.sizeMin ? { gte: Number(filters.sizeMin) } : {}),
      ...(filters.sizeMax ? { lte: Number(filters.sizeMax) } : {}),
    };
  }
  if (filters.yearBuiltMin || filters.yearBuiltMax) {
    out.yearBuilt = {
      ...(filters.yearBuiltMin ? { gte: Number(filters.yearBuiltMin) } : {}),
      ...(filters.yearBuiltMax ? { lte: Number(filters.yearBuiltMax) } : {}),
    };
  }
  if (filters.minPrice || filters.maxPrice) {
    if (filters.minPrice) out.priceMin = Number(filters.minPrice);
    if (filters.maxPrice) out.priceMax = Number(filters.maxPrice);
  }
  // Remove empty arrays, empty strings, or undefined filters
  Object.keys(out).forEach((key) => {
    if (
      out[key] === undefined ||
      out[key] === "" ||
      (Array.isArray(out[key]) && out[key].length === 0)
    ) {
      delete out[key];
    }
  });
  return out;
}

export default function ListingPage() {
  const [filters, setFilters] = useState({ ...defaultPropertyFilterParams });
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // API query
  const { data, isLoading, isError, error } = api.property.all.useQuery(
    transformFiltersForApi(filters),
    {
      refetchOnWindowFocus: false,
    },
  );

  // Pagination
  const currentPage = filters.page || 1;
  const pageSize = filters.pageSize || PAGE_SIZE;
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const listings = data?.data || [];

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200">
      <ListingFilterBar filters={filters} setFilters={setFilters} />
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="rounded-l-md"
          >
            List View
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            onClick={() => setViewMode("map")}
            className="rounded-r-md"
          >
            Map View
          </Button>
        </div>
      </div>
      {viewMode === "list" ? (
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
          <div className="w-full">
            <ListingGrid
              listings={listings}
              isLoading={isLoading}
              error={isError ? error : null}
              hoveredListingId={hoveredListingId}
              setHoveredListingId={setHoveredListingId}
            />
            <div className="mt-8 flex justify-center">
              <ListingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
          <div className="w-full">
            <h2 className="mb-2 text-lg font-semibold text-blue-700">
              Map of Listings
            </h2>
            <div className="h-[400px] w-full rounded-xl border-2 border-blue-200 bg-white shadow-lg">
              <ListingMap
                listings={listings}
                hoveredListingId={hoveredListingId}
                setHoveredListingId={setHoveredListingId}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto flex h-[80vh] max-w-7xl flex-col-reverse gap-0 px-0 py-0 md:flex-row md:gap-0 md:px-4 md:py-8">
          {/* Overlay panel of cards */}
          <div className="z-20 w-full overflow-x-auto bg-white/90 p-2 shadow md:absolute md:left-0 md:top-0 md:h-full md:w-[400px] md:overflow-y-auto md:rounded-l-xl md:bg-white/95 md:p-4">
            <ListingGrid
              listings={listings}
              isLoading={isLoading}
              error={isError ? error : null}
              hoveredListingId={hoveredListingId}
              setHoveredListingId={setHoveredListingId}
            />
          </div>
          {/* Map takes the rest */}
          <div className="relative h-[60vh] w-full md:ml-[400px] md:h-full md:w-[calc(100%-400px)]">
            <ListingMap
              listings={listings}
              hoveredListingId={hoveredListingId}
              setHoveredListingId={setHoveredListingId}
            />
          </div>
        </div>
      )}
    </div>
  );
}

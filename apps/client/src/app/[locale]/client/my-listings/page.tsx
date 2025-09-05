"use client";

import { motion } from "framer-motion";
import {
  Building2,
  DollarSign,
  Eye,
  Filter,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Select } from "@reservatior/ui/select";

import { api } from "~/trpc/react";

const PAGE_SIZE = 6;

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`group relative overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800/50 dark:bg-neutral-900/50 ${className}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-xl font-bold text-neutral-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp
                className={`h-3 w-3 ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function MyListingsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [page, setPage] = useState(1);

  // Memoize query parameters to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      title: search || undefined,
      propertyStatus: (status as any) ?? undefined,
      propertyType: (propertyType as any) ?? undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [search, status, propertyType, page],
  );

  const { data: statuses } = api.property.uniqueStatuses.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: types } = api.property.uniqueTypes.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data, isLoading, error } = api.property.myProperties.useQuery(
    queryParams,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: false,
    },
  );

  const listings = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Memoize stats calculations
  const stats = useMemo(() => {
    const activeListings = listings.filter(
      (l: any) => l.isActive !== false,
    ).length;
    const featuredListings = listings.filter((l: any) => l.featured).length;
    const averageRating =
      listings.length > 0
        ? (
            listings.reduce(
              (acc: number, l: any) => acc + (l.averageRating ?? 0),
              0,
            ) / listings.length
          ).toFixed(1)
        : "0.0";

    return { activeListings, featuredListings, averageRating };
  }, [listings]);

  // Memoize filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1); // Reset to first page when filtering
  }, []);

  const handlePropertyTypeChange = useCallback((value: string) => {
    setPropertyType(value);
    setPage(1); // Reset to first page when filtering
  }, []);

  const handleApplyFilters = useCallback(() => {
    setPage(1); // Reset to first page when applying filters
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle external script errors
  if (typeof window !== "undefined") {
    window.addEventListener("error", (e) => {
      if (e.filename?.includes("share-modal.js")) {
        e.preventDefault();
        console.warn("External share-modal.js error suppressed");
      }
    });
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Building2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              My Property Portfolio
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90">
              Manage and showcase your real estate listings with professional
              tools and insights
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <StatsCard
            title="Total Listings"
            value={total}
            icon={Building2}
            className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-900/50"
          />
          <StatsCard
            title="Active Properties"
            value={stats.activeListings}
            icon={Shield}
            className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50"
          />
          <StatsCard
            title="Featured"
            value={stats.featuredListings}
            icon={Sparkles}
            className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/50 dark:to-orange-900/50"
          />
          <StatsCard
            title="Avg Rating"
            value={`${stats.averageRating}★`}
            icon={Star}
            className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-900/50"
          />
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 rounded-xl border border-neutral-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50"
        >
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-neutral-600" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Filter & Search
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Search Properties
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by title..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Status
              </label>
              <Select value={status} onValueChange={handleStatusChange}>
                <option value="">All Status</option>
                {statuses?.map((s: string) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Property Type
              </label>
              <Select
                value={propertyType}
                onValueChange={handlePropertyTypeChange}
              >
                <option value="">All Types</option>
                {types?.map((t: string) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Listings Grid */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-r-transparent border-t-blue-600"></div>
              Loading your listings...
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/50"
          >
            <div className="text-red-600 dark:text-red-400">
              Error loading listings. Please try again.
            </div>
          </motion.div>
        )}

        {Array.isArray(listings) && listings.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <Building2 className="mx-auto h-16 w-16 text-neutral-400" />
            <h3 className="mt-4 text-xl font-semibold text-neutral-600 dark:text-neutral-400">
              No listings yet
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-500">
              Start by creating your first property listing
            </p>
            <Button
              onClick={() => router.push("/client/listings/new")}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              Create Listing
            </Button>
          </motion.div>
        )}

        {Array.isArray(listings) && listings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Your Properties
              </h2>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(page * PAGE_SIZE, total)} of {total}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing: any, index: number) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group relative h-full overflow-hidden border border-neutral-200/50 bg-white/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-xl dark:border-neutral-800/50 dark:bg-neutral-900/50">
                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={
                            listing.Photo?.[0]?.url ??
                            "/images/listing-placeholder.jpg"
                          }
                          alt={listing.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute left-3 top-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                              listing.propertyStatus === "AVAILABLE"
                                ? "bg-green-500"
                                : listing.propertyStatus === "SOLD"
                                  ? "bg-red-500"
                                  : listing.propertyStatus === "UNDER_CONTRACT"
                                    ? "bg-yellow-500"
                                    : "bg-neutral-500"
                            }`}
                          >
                            {listing.propertyStatus?.replace(/_/g, " ") ??
                              "Unknown"}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {listing.featured && (
                          <div className="absolute right-3 top-3">
                            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 text-xs font-bold text-white">
                              <Sparkles className="mr-1 inline h-3 w-3" />
                              Featured
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="absolute bottom-3 left-3">
                          <div className="rounded-lg bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-neutral-900/90">
                            <span className="text-lg font-bold text-neutral-900 dark:text-white">
                              {listing.PricingRules?.[0]?.basePrice
                                ? `$${listing.PricingRules[0].basePrice.toLocaleString()}`
                                : listing.marketValue
                                  ? `$${listing.marketValue.toLocaleString()}`
                                  : "Contact for price"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="mb-2 line-clamp-1 text-lg font-semibold text-neutral-900 dark:text-white">
                        {listing.title}
                      </CardTitle>

                      <div className="mb-3 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {listing.address ??
                            listing.city ??
                            "Location not specified"}
                        </span>
                      </div>

                      {/* Property Details */}
                      <div className="mb-4 flex flex-wrap gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                        {listing.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {listing.bedrooms} beds
                          </span>
                        )}
                        {listing.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {listing.bathrooms} baths
                          </span>
                        )}
                        {listing.size && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {listing.size.toLocaleString()} sqft
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      {listing.averageRating && (
                        <div className="mb-4 flex items-center gap-1">
                          <Star
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                          />
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            {listing.averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-neutral-500">
                            rating
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/property/${listing.id}`)}
                          className="flex-1"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/client/listings/${listing.id}/edit`)
                          }
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        >
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 flex justify-center gap-4"
              >
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  className="flex items-center gap-2"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                  className="flex items-center gap-2"
                >
                  Next
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

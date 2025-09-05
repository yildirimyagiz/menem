"use client";

import { motion } from "framer-motion";
import {
  Building2,
  DollarSign,
  Eye,
  Heart,
  MapPin,
  Star,
  TrendingUp
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@reservatior/ui/button";

import { api } from "~/trpc/react";

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
    className={`mobile-card mobile-fade-in group relative overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800/50 dark:bg-neutral-900/50 ios-mobile-menu android-mobile-menu ${className}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="mobile-text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="mobile-text-xl font-bold text-neutral-900 dark:text-white">
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
                className={`mobile-text-xs font-medium ${
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

export default function FavoritesPage() {
  const router = useRouter();
  const t = useTranslations();
  const { data, isLoading, error } = api.property.getFavorites.useQuery();

  // Calculate stats
  const totalFavorites = data?.length ?? 0;
  const averagePrice =
    data && data.length > 0
      ? (
          data.reduce((acc: number, p: any) => {
            const price = p.PricingRules?.[0]?.basePrice ?? p.marketValue ?? 0;
            return acc + price;
          }, 0) / data.length
        ).toFixed(0)
      : "0";
  const averageRating =
    data && data.length > 0
      ? (
          data.reduce((acc: number, p: any) => {
            const rating = p.rating ?? 0;
            return acc + rating;
          }, 0) / data.length
        ).toFixed(1)
      : "0.0";

  const formatPrice = (property: any) => {
    const price = property.PricingRules?.[0]?.basePrice ?? property.marketValue ?? 0;
    return price > 0 ? `$${price.toLocaleString()}` : "Price on request";
  };

  const getPropertyTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      APARTMENT: t("propertyTypesApartment", { defaultValue: "Apartment" }),
      HOUSE: t("propertyTypesHouse", { defaultValue: "House" }),
      VILLA: t("propertyTypesVilla", { defaultValue: "Villa" }),
      LAND: t("propertyTypesLand", { defaultValue: "Land" }),
      COMMERCIAL: t("propertyTypesCommercial", { defaultValue: "Commercial" }),
    };
    return typeMap[type] ?? type;
  };

  if (isLoading) {
    return (
      <div className="ios-layout android-layout">
        <div className="container mx-auto px-4 py-8">
          <div className="mobile-fade-in mb-8 text-center">
            <h1 className="mobile-text-xl font-bold lg:text-3xl">{t("favoritesTitle", { defaultValue: "My Favorites" })}</h1>
            <p className="mobile-text-base text-gray-600 dark:text-gray-300">
              {t("favoritesLoading", { defaultValue: "Loading your favorite properties..." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={`skeleton-${i}`} className="mobile-card mobile-skeleton h-32 rounded-xl ios-mobile-menu android-mobile-menu" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ios-layout android-layout">
        <div className="container mx-auto px-4 py-8">
          <div className="mobile-card mobile-fade-in text-center rounded-xl border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/50 ios-mobile-menu android-mobile-menu">
            <h1 className="mobile-text-xl font-bold lg:text-3xl text-red-600 dark:text-red-400">
              {t("favoritesErrorTitle", { defaultValue: "Error Loading Favorites" })}
            </h1>
            <p className="mobile-text-base text-red-600 dark:text-red-400">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-layout android-layout">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mobile-fade-in mb-8 text-center">
          <h1 className="mobile-text-xl font-bold lg:text-3xl">{t("favoritesTitle", { defaultValue: "My Favorites" })}</h1>
          <p className="mobile-text-base text-gray-600 dark:text-gray-300">
            {t("favoritesDescription", { defaultValue: "Your saved properties and preferences" })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mobile-fade-in mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={t("favoritesStatsTotal", { defaultValue: "Total Favorites" })}
            value={totalFavorites}
            icon={Heart}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title={t("favoritesStatsAveragePrice", { defaultValue: "Average Price" })}
            value={`$${averagePrice}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title={t("favoritesStatsAverageRating", { defaultValue: "Average Rating" })}
            value={averageRating}
            icon={Star}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title={t("favoritesStatsPropertiesViewed", { defaultValue: "Properties Viewed" })}
            value={totalFavorites * 3}
            icon={Eye}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Favorites Grid */}
        {data && data.length > 0 ? (
          <div className="mobile-fade-in grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((property: any, index: number) => (
              <motion.div
                key={`property-${property.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mobile-card mobile-scale-in cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 ios-mobile-menu android-mobile-menu"
                onClick={() => router.push(`/client/property/${property.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.Photo?.[0]?.url ?? "/images/placeholder.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute right-2 top-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mobile-button rounded-full bg-white/90 p-2 text-red-500 backdrop-blur-sm hover:bg-white"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="rounded-lg bg-white/95 p-2 backdrop-blur-sm">
                      <div className="mobile-text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(property)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">
                    {property.title}
                  </h3>
                  <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                    {property.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="mobile-text-sm text-gray-600 dark:text-gray-300">
                      {property.Location?.city ?? t("locationNotSpecified", { defaultValue: "Location not specified" })}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="mobile-text-sm text-gray-600 dark:text-gray-300">
                        {getPropertyTypeLabel(property.propertyType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="mobile-text-sm text-gray-600 dark:text-gray-300">
                        {property.rating?.toFixed(1) ?? "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mobile-fade-in text-center">
            <div className="mobile-card rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800 ios-mobile-menu android-mobile-menu">
              <Heart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">
                {t("favoritesEmptyTitle", { defaultValue: "No favorites yet" })}
              </h3>
              <p className="mobile-text-base text-gray-600 dark:text-gray-300">
                {t("favoritesEmptyDescription", { defaultValue: "Start exploring properties and add them to your favorites" })}
              </p>
              <Button
                onClick={() => router.push("/client")}
                className="mobile-button mt-4"
              >
                {t("exploreProperties", { defaultValue: "Explore Properties" })}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

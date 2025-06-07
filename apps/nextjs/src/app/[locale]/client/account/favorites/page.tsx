"use client";

import type { PropertyStatus } from "@prisma/client";
import type { Key } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutGrid,
  List,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
// If you see a type error here, ensure 'use-debounce' is installed in the correct workspace/package
import { useDebouncedCallback } from "use-debounce";

import type { Property as PropertySchema } from "@acme/validators";
import { Button } from "@acme/ui/button";
import { Card } from "@acme/ui/card";
import { EmptyState } from "@acme/ui/empty-state";
import { Input } from "@acme/ui/input";
import { Skeleton } from "@acme/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import PropertyCard from "~/components/PropertyCard";
import { useAuth } from "~/hooks/use-auth";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

// Extend the Property type to include additional fields used in the UI
type Property = Omit<PropertySchema, "price" | "saleOff" | "Photo"> & {
  Photo?: {
    url: string;
    alt?: string;
  }[];
  price?: {
    isActive: boolean;
    finalAmount: number;
    currency: string;
  }[];
  saleOff?: number | null;
};

type TabValue = "all" | "saved" | "recent";

export default function PropertyFavoritesPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState<TabValue>("all");

  // Debounced search handler
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  // Query favorite properties
  const {
    data: favoritesResponse,
    isLoading,
    error,
  } = api.favorite.all.useQuery({
    userId: user?.id,
    page: currentPage,
    pageSize: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, t, toast]);

  // Helper function to process pricing rules into the format expected by PropertyCard
  const processPricingRules = (pricingRules: any[] | undefined) => {
    if (!Array.isArray(pricingRules)) return [];

    return pricingRules.map((rule) => ({
      id: rule.id ?? "",
      basePrice: rule.basePrice ?? 0,
      currency: rule.currency ?? "USD",
      isActive: rule.isActive !== false, // Default to true if not specified
    }));
  };

  const favorites = useMemo(() => {
    if (!favoritesResponse?.data) return [];

    try {
      // Define types for the response data
      interface FavoriteResponse {
        property: Property;
      }
      type ResponseData = FavoriteResponse[] | { data: FavoriteResponse[] };

      // Cast the response data to our defined type
      const responseData = favoritesResponse.data as unknown as ResponseData;

      // Extract the data array from the response
      const data = Array.isArray(responseData)
        ? responseData
        : "data" in responseData
          ? responseData.data
          : [];

      // Filter and map the data to PropertyCardData
      return data
        .filter((favorite): favorite is { property: Property } => {
          if (!favorite?.property) return false;
          const prop = favorite.property;
          return (
            "id" in prop &&
            "title" in prop &&
            typeof prop.id === "string" &&
            typeof prop.title === "string"
          );
        })
        .map(({ property }) => {
          const title = property.title ?? "";
          const description = property.description ?? "";

          // Process photos with type safety
          const photos =
            "Photo" in property &&
            property.Photo &&
            Array.isArray(property.Photo)
              ? property.Photo.reduce<{ url: string }[]>((acc, photo) => {
                  if (
                    photo &&
                    typeof photo === "object" &&
                    "url" in photo &&
                    typeof photo.url === "string"
                  ) {
                    acc.push({ url: photo.url });
                  }
                  return acc;
                }, [])
              : [];

          // Process pricing rules safely
          const pricingRules = processPricingRules(
            "PricingRules" in property && Array.isArray(property.PricingRules)
              ? property.PricingRules
              : [],
          );

          // Convert pricing rules to the price format expected by PropertyCard
          const price = pricingRules
            .filter((rule) => rule.isActive)
            .map((rule) => ({
              isActive: true,
              finalAmount: rule.basePrice,
              currency: rule.currency,
            }));

          // Create the card data with all required fields
          const cardData = {
            // Required fields from Property
            id: property.id,
            title,
            description,
            propertyType: property.propertyType ?? "UNKNOWN",
            propertyNumber: property.propertyNumber ?? "",
            propertyStatus: property.propertyStatus,
            category: property.category,
            locationId: property.locationId ?? "",
            ownershipType: property.ownershipType,
            // Physical characteristics
            size: property.size ?? 0,
            bedrooms: property.bedrooms ?? 0,
            bathrooms: property.bathrooms ?? 0,
            floors: property.floors ?? 1,
            yearBuilt: property.yearBuilt,
            condition: property.condition ?? "GOOD",
            features: Array.isArray(property.features) ? property.features : [],
            amenities: Array.isArray(property.amenities)
              ? property.amenities
              : [],
            // Financial
            marketValue: property.marketValue,
            taxValue: property.taxValue,
            insuranceValue: property.insuranceValue,
            mortgageEligible: property.mortgageEligible ?? false,
            // Contact
            contactEmail: property.contactEmail ?? "",
            contactPhone: property.contactPhone ?? "",
            // Metadata
            createdAt: property.createdAt ?? new Date(),
            updatedAt: property.updatedAt ?? new Date(),
            deletedAt: property.deletedAt,
            isActive: property.isActive ?? true,
            featured: property.featured ?? false,
            // Pricing information
            price: price.length > 0 ? price : undefined,
            PricingRules: pricingRules.length > 0 ? pricingRules : undefined,
            // UI specific fields
            Photo: photos,
            saleOff: property.saleOff ?? null,
          };

          return cardData;
        });
    } catch (error) {
      console.error("Error processing favorites:", error);
      return [];
    }
  }, [favoritesResponse?.data]);

  const totalFavorites = useMemo(() => {
    if (!favoritesResponse?.data) return 0;
    return (
      (favoritesResponse.data as any)?.total ??
      (Array.isArray(favoritesResponse.data)
        ? favoritesResponse.data.length
        : 0)
    );
  }, [favoritesResponse?.data]);

  const totalPages = Math.ceil(totalFavorites / 12);

  const clearAllMutation = api.favorite.clearAll.useMutation({
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: [["favorite", "all"], { type: "query" }],
      });
      toast({
        title: t("success"),
        description: t("favoritesCleared", { count: data.deletedCount }),
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : t("unknownError");
      console.error("Error clearing favorites:", errorMessage);
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch],
  );

  const toggleFavorite = api.favorite.toggle.useMutation({
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: [["favorite", "all"], { type: "query" }],
      });

      const message =
        result.action === "added"
          ? t("favorites.addedToFavorites")
          : t("favorites.removedFromFavorites");

      toast({
        title: t("success"),
        description: message,
      });
    },
    onError: (error) => {
      const errorMessage = error.message || t("unknownError");
      console.error("Error toggling favorite:", errorMessage);
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = useCallback(
    (propertyId: string) => {
      if (!user?.id) {
        toast({
          title: t("error"),
          description: t("mustBeLoggedIn"),
          variant: "destructive",
        });
        return;
      }

      toggleFavorite.mutate({
        propertyId,
        userId: user.id,
      });
    },
    [toggleFavorite, t, toast, user?.id],
  );

  const handleTabChange = useCallback(
    (value: string) => {
      if (value === "all" || value === "saved" || value === "recent") {
        setTab(value as TabValue);
        setCurrentPage(1);
      }
    },
    [setTab, setCurrentPage],
  );

  const renderProperties = useCallback(() => {
    const emptyState = (
      <EmptyState
        icon={<Heart className="h-12 w-12 text-muted-foreground" />}
        title={t("noFavorites")}
        description={t("noFavoritesDescription")}
      />
    );

    if (!favorites || favorites.length === 0) {
      return emptyState;
    }

    const renderPropertyCard = (property: any) => {
      return (
        <PropertyCard
          key={property.id}
          property={property}
          className="mb-4"
        />
      );
    };

    if (view === "list") {
      return (
        <div className="space-y-6">{favorites.map(renderPropertyCard)}</div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map(renderPropertyCard)}
      </div>
    );
  }, [favorites, handleToggleFavorite, t, view]);

  const handleClearAll = useCallback(() => {
    if (window.confirm(t("confirmClearAllFavorites"))) {
      clearAllMutation.mutate();
    }
  }, [clearAllMutation, t]);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("favoriteProperties")}</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[16/9] bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4 pb-2">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="p-4 pt-0">
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Heart className="h-12 w-12 text-muted-foreground" />}
          title={t("errorLoadingFavorites")}
          description={error instanceof Error ? error.message : "Unknown error"}
          actions={
            <Button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["favorite", "all"],
                })
              }
            >
              {t("tryAgain")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("favoriteProperties")}</h1>
          <p className="text-muted-foreground">
            {totalFavorites} {t("favorite")}
            {totalFavorites === 1 ? t("property") : t("properties")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={clearAllMutation.isPending || !favorites?.length}
            className={clearAllMutation.isPending ? "opacity-75" : ""}
          >
            {clearAllMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {t("clearAll")}
          </Button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder={t("searchFavorites")}
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-md border p-1">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">{t("gridView")}</span>
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">{t("listView")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={handleTabChange} defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="rent">{t("forRent")}</TabsTrigger>
          <TabsTrigger value="sale">{t("forSale")}</TabsTrigger>
          <TabsTrigger value="bookable">{t("bookable")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderProperties()}
        </TabsContent>

        <TabsContent value="rent" className="mt-6">
          {renderProperties()}
        </TabsContent>

        <TabsContent value="sale" className="mt-6">
          {renderProperties()}
        </TabsContent>

        <TabsContent value="bookable" className="mt-6">
          {renderProperties()}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

import { Building2, Calendar, Car, MoreHorizontal, Star } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";

// removed unused PropertyFeatures import
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { TableCell, TableRow } from "@reservatior/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@reservatior/ui/tooltip";
import type { Property } from "@reservatior/validators";

import { useLanguage } from "~/context/LanguageContext";
import { api } from "~/trpc/react";

// Safe wrapper for tRPC query to avoid unsafe `any`/error-typed issues due to router collisions
function usePropertyByIdQuerySafe(id: string | undefined) {
  const client = api as unknown as {
    property: {
      byId: {
        useQuery: (
          input: { id: string },
          opts?: { enabled?: boolean; staleTime?: number },
        ) => {
          data?: Partial<Property> | null;
          isLoading: boolean;
          error?: unknown;
        };
      };
    };
  };
  return client.property.byId.useQuery(
    { id: (id ?? "") },
    { enabled: !!id, staleTime: 1000 * 60 * 5 },
  );
}

interface PropertyDisplayProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const STATUS_COLORS = {
  Available: "bg-green-100 text-green-800",
  Reserved: "bg-yellow-100 text-yellow-800",
  Sold: "bg-red-100 text-red-800",
  Rented: "bg-blue-100 text-blue-800",
  UnderConstruction: "bg-orange-100 text-orange-800",
  NewProject: "bg-purple-100 text-purple-800",
  Empty: "bg-gray-100 text-gray-800",
};

// listingType colors removed (field not present in Property schema)

const PropertyDisplay = React.memo(function PropertyDisplay({
  property,
  onViewDetails,
  onEdit,
  onDelete,
}: PropertyDisplayProps) {
  const { t } = useLanguage();

  const { data: propertyDetails, isLoading, error } = usePropertyByIdQuerySafe(
    property.id,
  );

  const displayProperty: Property = useMemo(() => {
    const merged = { ...property, ...(propertyDetails ?? {}) } as Property;
    return merged;
  }, [property, propertyDetails]);

  const getStatusColor = useCallback(
    (status: string) =>
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      "bg-gray-100 text-gray-800",
    [],
  );

  // getListingTypeColor removed

  const handleDelete = useCallback(() => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    onDelete(property.id);
  }, [onDelete, property.id]);

  // Use 'Photo' instead of 'photos' as per schema
  const featuredPhoto = Array.isArray(displayProperty.Photo)
    ? displayProperty.Photo.find((p: { featured?: boolean }) => !!p.featured)
    : undefined;

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={9} className="animate-pulse">
          <div className="h-16 w-full rounded bg-gray-200" />
          <span>{t("Property.table.loading")}</span>
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    const errObj = error as unknown;
    let errMsg = "";
    if (typeof errObj === "object" && errObj && "message" in errObj) {
      const m = (errObj as { message?: unknown }).message;
      errMsg = typeof m === "string" ? m : "";
    }
    return (
      <TableRow>
        <TableCell colSpan={9} className="text-red-600">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span>
              {t("Property.table.errorLoadingDetails")}
              {errMsg ? `: ${errMsg}` : null}
            </span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="group transition-colors hover:bg-gray-50">
      <TableCell>
        <div className="relative h-16 w-20 overflow-hidden">
          <Image
            src={featuredPhoto?.url ?? "/defaultProperty.png"}
            fill
            className="rounded-md object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 80px, 120px"
            priority={false}
            quality={75}
            alt={""}
          />
          {featuredPhoto?.featured && (
            <Badge className="absolute -right-2 -top-2 bg-yellow-400/90 backdrop-blur-sm">
              {t("Property.table.featured")}
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <p className="line-clamp-1 font-medium">{displayProperty.title}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Building2 className="h-4 w-4" />
            <span>
              {t(`Property.type.${displayProperty.propertyType}`)} •{" "}
              {Array.isArray(displayProperty.Photo)
                ? displayProperty.Photo.length
                : 0}{" "}
              {t("Property.table.photos")}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <Badge className={getStatusColor(displayProperty.propertyStatus)}>
            {t(`Property.status.${displayProperty.propertyStatus}`)}
          </Badge>
          {/* listingType not present in Property schema; removed */}
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          {/* No 'price' or 'saleOff' in schema; use 'marketValue' or stub */}
          <p className="font-medium">
            {displayProperty.marketValue != null
              ? `$${displayProperty.marketValue.toLocaleString()}`
              : "N/A"}
          </p>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <span>{displayProperty.size}</span>
            {/* No sizePrefix in schema */}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>
              {displayProperty.bathrooms ?? t("Property.table.na")}{" "}
              {t("Property.fields.bathrooms")}
            </span>
            <span>•</span>
            <span>
              {displayProperty.floors ?? t("Property.table.na")}{" "}
              {t("Property.fields.floors")}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          {displayProperty.parkingSpaces !== undefined && (
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-gray-500" />
              <span>
                {displayProperty.parkingSpaces}{" "}
                {t("Property.fields.parkingSpaces")}
              </span>
            </div>
          )}
          <div className="flex space-x-2">
            {/* Only show if 'FURNISHED' is present in features */}
            {Array.isArray(displayProperty.features) &&
              (displayProperty.features as unknown as string[]).includes(
                "FURNISHED",
              ) && (
              <Badge variant="outline">
                {t("Property.features.FURNISHED")}
              </Badge>
            )}
            {/* No petFriendly in schema */}
          </div>
        </div>
      </TableCell>

      <TableCell>
        {/* No averageRating or reviewCount in schema; omit or stub */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{t("Property.table.noRating")}</span>
          </div>
          <p className="text-sm text-gray-500">
            {t("Property.table.noReviews")}
          </p>
        </div>
      </TableCell>

      <TableCell>
        {/* Use earliest date from Availability array if present */}
        {Array.isArray(displayProperty.Availability) &&
        displayProperty.Availability.length > 0
          ? (() => {
              const earliest = displayProperty.Availability.map(
                (a: { date?: string | Date }) => a.date,
              )
                .filter((d): d is string | Date => Boolean(d))
                .sort(
                  (a: string | Date, b: string | Date) =>
                    new Date(a).getTime() - new Date(b).getTime(),
                )[0];
              return (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {earliest
                          ? new Date(earliest).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : t("Property.table.na")}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("Property.table.availableFrom")}{" "}
                    {earliest
                      ? new Date(earliest).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : t("Property.table.na")}
                  </TooltipContent>
                </Tooltip>
              );
            })()
          : null}
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Property.table.actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(property)}>
              {t("Property.table.viewDetails")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(property)}>
              {t("Property.table.edit")}
            </DropdownMenuItem>
            {/* No virtualTour in schema; omit */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              {t("Property.table.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

export default PropertyDisplay;

// Note: Fields not present in the Property schema have been omitted or stubbed for clarity.

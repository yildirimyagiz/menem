import React, { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { Building2, Calendar, Car, MoreHorizontal, Star } from "lucide-react";

import type { Property } from "@acme/validators";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { TableCell, TableRow } from "@acme/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@acme/ui/tooltip";
import { PropertyFeatures } from "@acme/validators";

import { env } from "~/env";
import { api } from "~/trpc/react";

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

const LISTING_TYPE_COLORS = {
  ForSale: "bg-blue-100 text-blue-800",
  ForRent: "bg-green-100 text-green-800",
  Booking: "bg-purple-100 text-purple-800",
};

const PropertyDisplay = React.memo(function PropertyDisplay({
  property,
  onViewDetails,
  onEdit,
  onDelete,
}: PropertyDisplayProps) {
  const {
    data: propertyDetails,
    isLoading,
    error,
  } = api.property.byId.useQuery(
    { id: property.id },
    {
      enabled: !!property.id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  const displayProperty = useMemo(
    () => ({ ...property, ...propertyDetails }),
    [property, propertyDetails],
  );

  const getStatusColor = useCallback(
    (status: string) =>
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      "bg-gray-100 text-gray-800",
    [],
  );

  const getListingTypeColor = useCallback(
    (type: string) =>
      LISTING_TYPE_COLORS[type as keyof typeof LISTING_TYPE_COLORS] ||
      "bg-gray-100 text-gray-800",
    [],
  );

  const handleDelete = useCallback(() => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    onDelete(property.id);
  }, [onDelete, property.id]);

  // Use 'Photo' instead of 'photos' as per schema
  const featuredPhoto = Array.isArray(displayProperty.Photo)
    ? displayProperty.Photo.find((p: { featured?: boolean }) => p.featured)
    : undefined;

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={9} className="animate-pulse">
          <div className="h-16 w-full rounded bg-gray-200" />
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    return (
      <TableRow>
        <TableCell colSpan={9} className="text-red-600">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span>Error loading property details: {error.message}</span>
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
              Featured
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
              {displayProperty.propertyType} •{" "}
              {Array.isArray(displayProperty.Photo)
                ? displayProperty.Photo.length
                : 0}{" "}
              Photos
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <Badge className={getStatusColor(displayProperty.propertyStatus)}>
            {displayProperty.propertyStatus}
          </Badge>
          {displayProperty.listingType && (
            <Badge className={getListingTypeColor(displayProperty.listingType)}>
              {displayProperty.listingType}
            </Badge>
          )}
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
            <span>{displayProperty.bathrooms ?? "N/A"} Bath</span>
            <span>•</span>
            <span>{displayProperty.floors ?? "N/A"} Floor</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          {displayProperty.parkingSpaces !== undefined && (
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-gray-500" />
              <span>{displayProperty.parkingSpaces} Spaces</span>
            </div>
          )}
          <div className="flex space-x-2">
            {/* Only show if 'FURNISHED' is a valid PropertyFeatures value */}
            {displayProperty.features?.includes(
              (PropertyFeatures as any).FURNISHED || "FURNISHED",
            ) && <Badge variant="outline">Furnished</Badge>}
            {/* No petFriendly in schema */}
          </div>
        </div>
      </TableCell>

      <TableCell>
        {/* No averageRating or reviewCount in schema; omit or stub */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>N/A</span>
          </div>
          <p className="text-sm text-gray-500">No reviews</p>
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
                .filter(Boolean)
                .sort(
                  (a, b) => new Date(a!).getTime() - new Date(b!).getTime(),
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
                          : "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Available from{" "}
                    {earliest
                      ? new Date(earliest).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(property)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(property)}>
              Edit Property
            </DropdownMenuItem>
            {/* No virtualTour in schema; omit */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              Delete Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

export default PropertyDisplay;

// Note: Fields not present in the Property schema have been omitted or stubbed for clarity.

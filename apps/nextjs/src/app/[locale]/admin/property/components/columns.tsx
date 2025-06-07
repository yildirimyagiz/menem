import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Image from "next/image";
import { Building2, MoreHorizontal, Star } from "lucide-react";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@acme/ui/tooltip";
import { PropertyStatus } from "@acme/validators";

/**
 * Extends Property with extra fields used for table display.
 * Use the backend Property type and add only frontend UI fields.
 */
type PropertyTableRow = Property & {
  listingType?: string;
  sizePrefix?: string;
};

/**
 * Renders the property image or a fallback icon if no image is available.
 */
const ImageCell = React.memo(({ property }: { property: PropertyTableRow }) => {
  const featuredPhoto =
    property.Photo?.find((p) => p.featured) ?? property.Photo?.[0];
  const src = featuredPhoto?.url ?? "";
  return (
    <div className="flex items-center space-x-4">
      {src ? (
        <Image
          src={src}
          alt={property.title || "Property image"}
          className="h-10 w-10 rounded-lg object-cover transition-transform hover:scale-105"
          width={40}
          height={40}
          quality={75}
          onError={(e) => {
            // fallback to icon if image fails
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
});
ImageCell.displayName = "ImageCell";

export const createColumns = (
  onViewDetails: (property: PropertyTableRow) => void,
  onEdit: (property: PropertyTableRow) => void,
  onDelete: (id: string) => Promise<void> | void,
): ColumnDef<PropertyTableRow>[] => [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => <ImageCell property={row.original} />,
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => {
      const property = row.original;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex max-w-[200px] flex-col">
              <span className="truncate font-medium">{property.title}</span>
              <span className="text-sm text-muted-foreground">
                {property.propertyType} • {property.listingType}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{property.title}</p>
            <p className="text-sm text-muted-foreground">
              {property.propertyType} • {property.listingType}
            </p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "size",
    header: "Size",
    cell: ({ row }) => (
      <span>
        {typeof row.original.size === "number" ? row.original.size : "-"}
        {row.original.sizePrefix ? ` ${row.original.sizePrefix}` : " m²"}
      </span>
    ),
  },
  {
    id: "pricingRules",
    header: "Pricing Rules",
    cell: ({ row }) => {
      const rules = Array.isArray(row.original.PricingRules)
        ? row.original.PricingRules
        : [];
      const names = rules
        .map((pr) =>
          pr && typeof pr === "object" && "name" in pr ? String(pr.name) : "",
        )
        .filter(Boolean)
        .join(", ");
      return names || "N/A";
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.propertyStatus === PropertyStatus.enum.AVAILABLE
            ? "outline"
            : "destructive"
        }
        aria-label={
          row.original.propertyStatus === PropertyStatus.enum.AVAILABLE
            ? "Available"
            : row.original.propertyStatus
        }
      >
        {row.original.propertyStatus}
      </Badge>
    ),
  },
  {
    id: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center" aria-label="Average rating">
        <Star className="mr-1 h-4 w-4 text-yellow-400" aria-hidden />
        <span>
          {typeof row.original.averageRating === "number"
            ? row.original.averageRating.toFixed(1)
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const property = row.original;
      const handleDelete = async () => {
        if (
          window.confirm(`Are you sure you want to delete "${property.title}"?`)
        ) {
          await onDelete(property.id);
        }
      };
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                aria-label={`Actions for ${property.title}`}
                tabIndex={0}
              >
                <MoreHorizontal className="h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onViewDetails(property)}
                className="cursor-pointer"
                aria-label="View property details"
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(property)}
                className="cursor-pointer"
                aria-label="Edit property"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                aria-label="Delete property"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const defaultColumnOrder = [
  "image",
  "details",
  "size",
  "price",
  "status",
  "rating",
  "actions",
] as const;

export const defaultColumnVisibility: Record<
  (typeof defaultColumnOrder)[number],
  boolean
> = {
  image: true,
  details: true,
  size: true,
  price: true,
  status: true,
  rating: true,
  actions: true,
};

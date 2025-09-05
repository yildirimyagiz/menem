import type { Identifier } from "dnd-core";
import type { z } from "zod";
import React, { useCallback } from "react";
import Image from "next/image";
import { GripVertical, MoreHorizontal, Star } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

import type {
  OwnershipType,
  Property,
  PropertyAmenities,
  PropertyCategory,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@reservatior/validators";
import { useLanguage } from "~/context/LanguageContext";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@reservatior/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

interface PropertyGridItemProps {
  property: Property;
  index: number;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragEnabled: boolean;
  reorderProperty: (dragIndex: number, hoverIndex: number) => void;
  visibleColumns: string[];
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const PropertyGridItem = React.memo(function PropertyGridItem({
  property,
  index,
  onViewDetails,
  onEdit,
  onDelete,
  isDragEnabled,
  reorderProperty,
  visibleColumns,
}: PropertyGridItemProps) {
  const { t } = useLanguage();

  const [{ isDragging }, dragRef] = useDrag({
    type: "property",
    item: () => ({ index, id: property.id, type: "property" }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isDragEnabled,
  });

  const [, dropRef] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
    {
      accept: "property",
      hover: useCallback(
        (draggedItem: DragItem) => {
          if (!isDragEnabled) return;
          if (draggedItem.index !== index) {
            reorderProperty(draggedItem.index, index);
            draggedItem.index = index;
          }
        },
        [index, isDragEnabled, reorderProperty],
      ),
    },
  );

  const renderPrice = useCallback(() => {
    if (typeof property.marketValue === "number") {
      return property.marketValue.toLocaleString();
    }
    return "N/A";
  }, [property.marketValue]);

  const renderImage = useCallback(() => {
    interface Photo {
      url: string;
      featured?: boolean;
    }

    const photos: Photo[] = Array.isArray(property.Photo) ? property.Photo : [];
    const featuredPhoto = photos.find((p) => p.featured) ?? photos[0];
    if (!featuredPhoto?.url) {
      return <div className="aspect-video w-full rounded-t-lg bg-muted" />;
    }

    return (
      <div className="relative aspect-video w-full">
        <Image
          src={featuredPhoto.url}
          alt={property.title}
          className="rounded-t-lg object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          quality={75}
        />
      </div>
    );
  }, [property.Photo, property.title]);

  return (
    <Card
      ref={(node) => {
        dragRef(node);
        dropRef(node);
      }}
      className={`group transition-opacity duration-200 ${
        isDragging ? "opacity-50" : "opacity-100"
      } relative hover:shadow-md`}
    >
      {isDragEnabled && (
        <div className="absolute left-2 top-2 z-10">
          <GripVertical
            className={`h-6 w-6 ${
              isDragEnabled ? "cursor-move" : "cursor-not-allowed"
            } text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100`}
          />
        </div>
      )}

      <CardHeader className="relative p-0">
        {renderImage()}
        <Badge
          variant="outline"
          className="absolute right-4 top-4 bg-white/80 backdrop-blur-sm"
        >
          {t(`Property.status.${property.propertyStatus}`)}
        </Badge>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">
              {typeof property.averageRating === "number"
                ? property.averageRating
                : t("Property.table.noRating")}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{property.size} m²</p>
          <p>{property.Location?.address ?? t("Property.table.noAddress")}</p>
          <p>{t(`Property.type.${property.propertyType}`)}</p>
          <p className="font-medium">{renderPrice()}</p>
          <p>
            <b>{t("Property.fields.features")}:</b>{" "}
            {Array.isArray(property.features) && property.features.length > 0
              ? property.features.map((f) => t(`Property.features.${f}`)).join(", ")
              : t("Property.table.noFeatures")}
          </p>
          <p>
            <b>{t("Property.fields.amenities")}:</b>{" "}
            {Array.isArray(property.amenities) && property.amenities.length > 0
              ? property.amenities.map((a) => t(`Property.amenities.${a}`)).join(", ")
              : t("Property.table.noAmenities")}
          </p>
          <p>
            <b>{t("Property.fields.pricingRules")}:</b>{" "}
            {Array.isArray(property.PricingRules) &&
            property.PricingRules.length > 0
              ? property.PricingRules.map((pr) =>
                  typeof pr === "object" && pr && "name" in pr
                    ? t(`Property.pricingRules.${String(pr.name)}`)
                    : "",
                )
                  .filter(Boolean)
                  .join(", ")
              : t("Property.table.noPricingRules")}
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-end p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted/50"
              aria-label="Open menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t("Property.table.actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={onViewDetails}>
              {t("Property.table.viewDetails")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>{t("Property.table.edit")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              {t("Property.table.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
});

PropertyGridItem.displayName = "PropertyGridItem";

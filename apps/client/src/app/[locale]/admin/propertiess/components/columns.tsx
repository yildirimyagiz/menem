import type { ColumnDef } from "@tanstack/react-table";
import { Building2, MoreHorizontal, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

// Enum-like object for frontend use
export const PropertyStatusEnum = {
  AVAILABLE: "AVAILABLE",
  UNDER_CONTRACT: "UNDER_CONTRACT",
  SOLD: "SOLD",
  RENTED: "RENTED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  OFF_MARKET: "OFF_MARKET",
  MAINTENANCE: "MAINTENANCE",
  FORECLOSURE: "FORECLOSURE",
} as const;

// removed unused PropertyStatus type that triggered unused var lint
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useLanguage } from "~/context/LanguageContext";
import type { Property } from "~/utils/interfaces";

/**
 * Extends Property with extra fields used for table display.
 * Use the backend Property type and add only frontend UI fields.
 */
type PropertyTableRow = Property & {
  sizePrefix?: string;
  averageRating?: number;
};

/**
 * Renders the property image or a fallback icon if no image is available.
 */
const ImageCell = React.memo(({ property }: { property: PropertyTableRow }) => {
  const { t } = useLanguage();
  const featuredPhoto =
    property.Photo?.find((p) => p.featured) ?? property.Photo?.[0];
  const src = featuredPhoto?.url ?? "";
  return (
    <div className="flex items-center space-x-4">
      {src ? (
        <Image
          src={src}
          alt={property.title || t("Property.table.imageAlt")}
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

// Small components to safely use hooks for headers/text in table definitions
const HeaderText: React.FC<{ k: string; values?: Record<string, string | number> }> = ({ k, values }) => {
  const { t } = useLanguage();
  return <>{t(k, values)}</>;
};

const DetailsCell: React.FC<{ property: PropertyTableRow }> = ({ property }) => {
  const { t } = useLanguage();
  return (
    <>
      <span className="truncate font-medium">{property.title}</span>
      <span className="text-sm text-muted-foreground">
        {t(`Property.type.${property.propertyType}`)} • {t(`Property.category.${property.category}`)}
      </span>
    </>
  );
};

const PricingRulesCell: React.FC<{ rules: PropertyTableRow["PricingRules"] }> = ({ rules }) => {
  const { t } = useLanguage();
  const list = Array.isArray(rules)
    ? rules
        .map((pr) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (pr && typeof pr === "object" && "name" in pr) {
            const name = (pr as { name?: unknown }).name;
            return typeof name === "string" ? name : "";
          }
          return "";
        })
        .filter((s): s is string => Boolean(s))
        .join(", ")
    : "";
  return <>{list || t("Property.table.noData")}</>;
};

const StatusCell: React.FC<{ status: PropertyTableRow["propertyStatus"] }> = ({ status }) => {
  const { t } = useLanguage();
  const variant = status === PropertyStatusEnum.AVAILABLE ? "outline" : "destructive";
  return (
    <Badge variant={variant} aria-label={t(`Property.status.${status}`)}>
      {t(`Property.status.${status}`)}
    </Badge>
  );
};

const RatingCell: React.FC<{ rating?: number }> = ({ rating }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center" aria-label={t("Property.table.averageRating")}>
      <Star className="mr-1 h-4 w-4 text-yellow-400" aria-hidden />
      <span>{typeof rating === "number" ? rating.toFixed(1) : t("Property.table.noData")}</span>
    </div>
  );
};

const ActionsCell: React.FC<{
  property: PropertyTableRow;
  onViewDetails: (p: PropertyTableRow) => void;
  onEdit: (p: PropertyTableRow) => void;
  onDelete: (id: string) => Promise<void> | void;
}> = ({ property, onViewDetails, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const handleDelete = async () => {
    if (window.confirm(t("Property.deleteConfirm", { title: property.title }))) {
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
            aria-label={t("Property.table.actionsFor", { title: property.title })}
            tabIndex={0}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{t("Property.table.actions")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onViewDetails(property)} className="cursor-pointer" aria-label={t("Property.table.viewDetails")}>
            {t("Property.table.viewDetails")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(property)} className="cursor-pointer" aria-label={t("Property.table.edit")}>
            {t("Property.table.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600" aria-label={t("Property.table.delete")}>
            {t("Property.table.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const createColumns = (
  onViewDetails: (property: PropertyTableRow) => void,
  onEdit: (property: PropertyTableRow) => void,
  onDelete: (id: string) => Promise<void> | void,
): ColumnDef<PropertyTableRow>[] => {
  return [
    {
      id: "image",
      header: () => <HeaderText k="Property.table.image" />,
      cell: ({ row }) => <ImageCell property={row.original} />,
    },
    {
      id: "details",
      header: () => <HeaderText k="Property.table.details" />,
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex max-w-[200px] flex-col">
              <DetailsCell property={row.original} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.title}</p>
            <p className="text-sm text-muted-foreground">
              <DetailsCell property={row.original} />
            </p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: "size",
      header: () => <HeaderText k="Property.table.size" />,
      cell: ({ row }) => (
        <span>
          {typeof row.original.size === "number" ? row.original.size : "-"}
          {row.original.sizePrefix ? ` ${row.original.sizePrefix}` : " m²"}
        </span>
      ),
    },
    {
      id: "pricingRules",
      header: () => <HeaderText k="Property.table.pricingRules" />,
      cell: ({ row }) => <PricingRulesCell rules={row.original.PricingRules} />,
    },
    {
      id: "status",
      header: () => <HeaderText k="Property.table.status" />,
      cell: ({ row }) => <StatusCell status={row.original.propertyStatus} />,
    },
    {
      id: "rating",
      header: () => <HeaderText k="Property.table.rating" />,
      cell: ({ row }) => <RatingCell rating={row.original.averageRating} />,
    },
    {
      id: "actions",
      header: () => <HeaderText k="Property.table.actions" />,
      cell: ({ row }) => (
        <ActionsCell
          property={row.original}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
};

export const defaultColumnOrder = [
  "image",
  "details",
  "size",
  "pricingRules",
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
  pricingRules: true,
  status: true,
  rating: true,
  actions: true,
};

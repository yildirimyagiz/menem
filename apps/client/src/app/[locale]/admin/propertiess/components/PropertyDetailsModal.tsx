import { Calendar, Home, Info, X } from "lucide-react";
import React, { useMemo } from "react";

import { PropertyFeatures } from "@reservatior/db";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { ScrollArea } from "@reservatior/ui/scroll-area";
import { Separator } from "@reservatior/ui/separator";

import { useLanguage } from "~/context/LanguageContext";
import type { Property } from "~/utils/interfaces";

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
}

interface DetailItem {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  category?: string;
}

export default function PropertyDetailsModal({
  property,
  onClose,
}: PropertyDetailsModalProps) {
  const { t } = useLanguage();

  const propertyDetails = useMemo(() => {
    const basicDetails: DetailItem[] = [
      {
        label: t("Property.fields.title"),
        value: property.title,
        icon: <Home className="h-4 w-4" />,
        category: t("Property.details.basicInformation"),
      },
      {
        label: t("Property.fields.description"),
        value: property.description,
        icon: <Info className="h-4 w-4" />,
        category: t("Property.details.basicInformation"),
      },
    ];

    const specifications: DetailItem[] = [
      {
        label: t("Property.fields.size"),
        value: `${property.size} m²`,
        category: t("Property.details.specifications"),
      },
      {
        label: t("Property.fields.status"),
        value: (
          <Badge variant="secondary">
            {t(`Property.status.${property.propertyStatus}`)}
          </Badge>
        ),
        category: t("Property.details.specifications"),
      },
      {
        label: t("Property.fields.propertyType"),
        value: (
          <Badge variant="outline">
            {t(`Property.type.${property.propertyType}`)}
          </Badge>
        ),
        category: t("Property.details.specifications"),
      },
      {
        label: t("Property.fields.bathrooms"),
        value: property.bathrooms ?? t("Property.details.notAvailable"),
        category: t("Property.details.specifications"),
      },
      {
        label: t("Property.fields.floors"),
        value: property.floors ?? t("Property.details.notAvailable"),
        category: t("Property.details.specifications"),
      },
    ];

    const featuresItems: DetailItem[] = [
      property.features?.includes(PropertyFeatures.FURNISHED)
        ? {
            label: t("Property.features.FURNISHED"),
            value: (
              <Badge variant="secondary">{t("Property.details.yes")}</Badge>
            ),
            category: t("Property.details.features"),
          }
        : null,
      property.parkingSpaces
        ? {
            label: t("Property.fields.parkingSpaces"),
            value: property.parkingSpaces,
            category: t("Property.details.features"),
          }
        : null,
      property.yearBuilt
        ? {
            label: t("Property.fields.yearBuilt"),
            value: property.yearBuilt,
            category: t("Property.details.features"),
          }
        : null,
    ].filter(Boolean) as DetailItem[];

    const dates: DetailItem[] = [
      ...(property.Availability && property.Availability.length > 0
        ? [
            {
              label: t("Property.details.availableFrom"),
              value: new Date(
                property.Availability.map((a) => a.date)
                  .filter(Boolean)
                  .sort(
                    (a, b) =>
                      new Date(a ?? "").getTime() - new Date(b ?? "").getTime(),
                  )[0] ?? "",
              ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              icon: <Calendar className="h-4 w-4" />,
              category: t("Property.details.dates"),
            },
          ]
        : []),
      {
        label: t("Property.details.listedOn"),
        value: new Date(property.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        icon: <Calendar className="h-4 w-4" />,
        category: t("Property.details.dates"),
      },
    ];

    return [...basicDetails, ...specifications, ...featuresItems, ...dates];
  }, [property, t]);

  const groupedDetails = useMemo(() => {
    return propertyDetails.reduce(
      (acc, detail) => {
        const category = detail.category ?? t("Property.details.other");
        acc[category] ??= [];
        acc[category].push(detail);
        return acc;
      },
      {} as Record<string, DetailItem[]>,
    );
  }, [propertyDetails, t]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("Property.details.title")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("Property.details.close")}</span>
          </Button>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="space-y-6">
            {Object.entries(groupedDetails).map(([category, details]) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                  {category}
                </h3>
                <div className="space-y-4">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <div className="flex items-center gap-2">
                        {detail.icon}
                        <span className="font-medium">{detail.label}:</span>
                      </div>
                      <div className="col-span-3">{detail.value}</div>
                    </div>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

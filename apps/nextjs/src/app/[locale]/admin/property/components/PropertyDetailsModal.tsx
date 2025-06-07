import React, { useMemo } from "react";
import { Calendar, Home, Info, X } from "lucide-react";

import type { Property } from "@acme/validators";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { ScrollArea } from "@acme/ui/scroll-area";
import { Separator } from "@acme/ui/separator";
import { PropertyFeatures } from "@acme/validators";

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
  const propertyDetails = useMemo(() => {
    const basicDetails: DetailItem[] = [
      {
        label: "Title",
        value: property.title,
        icon: <Home className="h-4 w-4" />,
        category: "Basic Information",
      },
      {
        label: "Description",
        value: property.description,
        icon: <Info className="h-4 w-4" />,
        category: "Basic Information",
      },
    ];

    const specifications: DetailItem[] = [
      {
        label: "Size",
        value: `${property.size} m²`,
        category: "Specifications",
      },
      {
        label: "Status",
        value: <Badge variant="secondary">{property.propertyStatus}</Badge>,
        category: "Specifications",
      },
      {
        label: "Type",
        value: <Badge variant="outline">{property.propertyType}</Badge>,
        category: "Specifications",
      },
      {
        label: "Bathrooms",
        value: property.bathrooms ?? "N/A",
        category: "Specifications",
      },
      {
        label: "Floor",
        value: property.floors ?? "N/A",
        category: "Specifications",
      },
    ];

    const featuresItems: DetailItem[] = [
      property.features?.includes(PropertyFeatures.enum.FURNISHED)
        ? {
            label: "Furnished",
            value: <Badge variant="secondary">Yes</Badge>,
            category: "Features",
          }
        : null,
      // 'PET_FRIENDLY' is not a valid PropertyFeatures value in the current schema. Remove this check.
      null,
      property.parkingSpaces
        ? {
            label: "Garage Spaces",
            value: property.parkingSpaces,
            category: "Features",
          }
        : null,
      property.yearBuilt
        ? {
            label: "Build Year",
            value: property.yearBuilt,
            category: "Features",
          }
        : null,
    ].filter(Boolean) as DetailItem[];

    const dates: DetailItem[] = [
      ...(property.Availability && property.Availability.length > 0
        ? [
            {
              label: "Available From",
              value: new Date(
                property.Availability
                  .map((a) => a.date)
                  .filter(Boolean)
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
              ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              icon: <Calendar className="h-4 w-4" />,
              category: "Dates",
            },
          ]
        : []),
      {
        label: "Listed On",
        value: new Date(property.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        icon: <Calendar className="h-4 w-4" />,
        category: "Dates",
      },
    ];

    return [...basicDetails, ...specifications, ...featuresItems, ...dates];
  }, [property]);

  const groupedDetails = useMemo(() => {
    return propertyDetails.reduce(
      (acc, detail) => {
        const category = detail.category ?? "Other";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(detail);
        return acc;
      },
      {} as Record<string, DetailItem[]>,
    );
  }, [propertyDetails]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Property Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
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

"use client";

import React, { useEffect, useState } from "react";
import {
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@prisma/client";
import { Filter, Search, X } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Checkbox } from "@reservatior/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { ScrollArea } from "@reservatior/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Separator } from "@reservatior/ui/separator";

interface PropertyFilter {
  search?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  category?: PropertyCategory;
  condition?: PropertyCondition;
  features?: PropertyFeatures[];
  amenities?: PropertyAmenities[];
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minYearBuilt?: number;
  maxYearBuilt?: number;
  createdAfter?: string;
  createdBefore?: string;
}

interface PropertyFilterFormProps {
  onFilter: (filter: PropertyFilter) => void;
  initialValues?: PropertyFilter;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PropertyFilterForm({
  onFilter,
  initialValues = {},
  isOpen = false,
  onOpenChange,
}: PropertyFilterFormProps) {
  const [filters, setFilters] = useState<PropertyFilter>(initialValues);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Initialize filters from props
  useEffect(() => {
    setFilters(initialValues);
  }, [initialValues]);

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === "search") return value && value.length > 0;
      if (Array.isArray(value)) return value && value.length > 0;
      if (typeof value === "boolean") return value !== undefined;
      if (typeof value === "number") return value !== undefined && value > 0;
      return value !== undefined && value !== "";
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleInputChange = (key: keyof PropertyFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (
    key: keyof PropertyFilter,
    value: string,
    checked: boolean,
  ) => {
    setFilters((prev) => {
      const currentArray = (prev[key] as string[]) || [];
      if (checked) {
        return { ...prev, [key]: [...currentArray, value] };
      } else {
        return {
          ...prev,
          [key]: currentArray.filter((item) => item !== value),
        };
      }
    });
  };

  const handleApply = () => {
    // Clean up empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (
        value === "" ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return acc;
      }
      return { ...acc, [key]: value };
    }, {} as PropertyFilter);

    onFilter(cleanFilters);
    onOpenChange?.(false);
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleClearFilter = (key: keyof PropertyFilter) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const renderActiveFilters = () => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => {
      if (key === "search") return value && value.length > 0;
      if (Array.isArray(value)) return value && value.length > 0;
      if (typeof value === "boolean") return value !== undefined;
      if (typeof value === "number") return value !== undefined && value > 0;
      return value !== undefined && value !== "";
    });

    if (activeFilters.length === 0) return null;

    return (
      <div className="mb-4 rounded-md bg-muted p-3">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4" />
          Active Filters ({activeFiltersCount})
        </h4>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => (
            <Badge
              key={key}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {key}: {Array.isArray(value) ? value.join(", ") : String(value)}
              <button
                onClick={() => handleClearFilter(key as keyof PropertyFilter)}
                className="ml-1 hover:text-destructive"
                aria-label={`Clear ${key} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderFilterSection = (title: string, children: React.ReactNode) => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Property Filters
          </DialogTitle>
          <DialogDescription>
            Apply comprehensive filters to find the exact properties you're
            looking for
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {renderActiveFilters()}

            {/* Basic Search */}
            {renderFilterSection(
              "Search & Basic Info",
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search properties..."
                      value={filters.search ?? ""}
                      onChange={(e) =>
                        handleInputChange("search", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Property Type
                  </label>
                  <Select
                    value={filters.propertyType ?? "all"}
                    onValueChange={(value) =>
                      handleInputChange(
                        "propertyType",
                        value === "all" ? undefined : value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.values(PropertyType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={filters.status ?? "all"}
                    onValueChange={(value) =>
                      handleInputChange(
                        "status",
                        value === "all" ? undefined : value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.values(PropertyStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Category
                  </label>
                  <Select
                    value={filters.category ?? "all"}
                    onValueChange={(value) =>
                      handleInputChange(
                        "category",
                        value === "all" ? undefined : value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.values(PropertyCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>,
            )}

            <Separator />

            {/* Physical Characteristics */}
            {renderFilterSection(
              "Physical Characteristics",
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Condition
                  </label>
                  <Select
                    value={filters.condition ?? "all"}
                    onValueChange={(value) =>
                      handleInputChange(
                        "condition",
                        value === "all" ? undefined : value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      {Object.values(PropertyCondition).map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Min Size (sq ft)
                    </label>
                    <Input
                      type="number"
                      placeholder="Min size"
                      value={filters.minSize ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "minSize",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Max Size (sq ft)
                    </label>
                    <Input
                      type="number"
                      placeholder="Max size"
                      value={filters.maxSize ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "maxSize",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Min Bedrooms
                    </label>
                    <Input
                      type="number"
                      placeholder="Min bedrooms"
                      value={filters.minBedrooms ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "minBedrooms",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Max Bedrooms
                    </label>
                    <Input
                      type="number"
                      placeholder="Max bedrooms"
                      value={filters.maxBedrooms ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "maxBedrooms",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Min Bathrooms
                    </label>
                    <Input
                      type="number"
                      placeholder="Min bathrooms"
                      value={filters.minBathrooms ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "minBathrooms",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Max Bathrooms
                    </label>
                    <Input
                      type="number"
                      placeholder="Max bathrooms"
                      value={filters.maxBathrooms ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "maxBathrooms",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Min Year Built
                    </label>
                    <Input
                      type="number"
                      placeholder="Min year"
                      value={filters.minYearBuilt ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "minYearBuilt",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Max Year Built
                    </label>
                    <Input
                      type="number"
                      placeholder="Max year"
                      value={filters.maxYearBuilt ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "maxYearBuilt",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                </div>
              </div>,
            )}

            <Separator />

            {/* Financial */}
            {renderFilterSection(
              "Financial",
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Min Price
                    </label>
                    <Input
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "minPrice",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Max Price
                    </label>
                    <Input
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "maxPrice",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                </div>
              </div>,
            )}

            <Separator />

            {/* Features & Amenities */}
            {renderFilterSection(
              "Features",
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Property Features
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {Object.values(PropertyFeatures).map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={(filters.features ?? []).includes(feature)}
                          onCheckedChange={(checked) =>
                            handleArrayChange(
                              "features",
                              feature,
                              checked as boolean,
                            )
                          }
                        />
                        <label
                          htmlFor={`feature-${feature}`}
                          className="text-sm"
                        >
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Property Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {Object.values(PropertyAmenities).map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={(filters.amenities ?? []).includes(amenity)}
                          onCheckedChange={(checked) =>
                            handleArrayChange(
                              "amenities",
                              amenity,
                              checked as boolean,
                            )
                          }
                        />
                        <label
                          htmlFor={`amenity-${amenity}`}
                          className="text-sm"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>,
            )}

            <Separator />

            {/* Ratings & Dates */}
            {renderFilterSection(
              "Ratings & Dates",
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Created After
                    </label>
                    <Input
                      type="date"
                      value={filters.createdAfter ?? ""}
                      onChange={(e) =>
                        handleInputChange("createdAfter", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Created Before
                    </label>
                    <Input
                      type="date"
                      value={filters.createdBefore ?? ""}
                      onChange={(e) =>
                        handleInputChange("createdBefore", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>,
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset All Filters
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters{" "}
              {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

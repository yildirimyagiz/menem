import { SlidersHorizontal } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@reservatior/ui/select";

// Enum values from property.ts (copy-paste or import if available)
const PROPERTY_TYPES = [
  "SingleFamily",
  "TOWNHOUSE",
  "CONDO",
  "APARTMENT",
  "DUPLEX",
  "TRIPLEX",
  "QUADPLEX",
  "OFFICE_BUILDING",
  "RETAIL_SPACE",
  "WAREHOUSE",
  "INDUSTRIAL_COMPLEX",
  "MIXED_USE",
  "MULTI_FAMILY",
  "MOBILE_HOME",
  "MANUFACTURED_HOME",
  "FARM",
  "RANCH",
];
const PROPERTY_CATEGORIES = [
  "APARTMENT",
  "HOUSE",
  "VILLA",
  "OFFICE",
  "RETAIL",
  "WAREHOUSE",
  "FACTORY",
  "LAND_PLOT",
  "FARM",
  "SHOP",
  "BUILDING",
  "INDUSTRIAL_COMPLEX",
  "MIXED_USE",
  "MULTI_FAMILY",
  "MOBILE_HOME",
  "MANUFACTURED_HOME",
  "RANCH",
];
const PROPERTY_STATUSES = [
  "AVAILABLE",
  "UNDER_CONTRACT",
  "SOLD",
  "RENTED",
  "PENDING_APPROVAL",
  "OFF_MARKET",
  "MAINTENANCE",
  "FORECLOSURE",
];
const BEDROOM_OPTIONS = ["Any", "1", "2", "3", "4", "5+"];
const BATHROOM_OPTIONS = ["Any", "1", "2", "3", "4+"];
const PRICE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "$500+", value: "500" },
  { label: "$1,000+", value: "1000" },
  { label: "$1,500+", value: "1500" },
  { label: "$2,000+", value: "2000" },
  { label: "$2,500+", value: "2500" },
  { label: "$3,000+", value: "3000" },
  { label: "$4,000+", value: "4000" },
  { label: "$5,000+", value: "5000" },
];

interface ListingFilterBarProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export default function ListingFilterBar({
  filters,
  setFilters,
}: ListingFilterBarProps) {
  return (
    <div className="sticky top-0 z-30 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by address, neighborhood, or city..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.propertyType || "ALL"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                propertyType: v === "ALL" ? undefined : v,
              })
            }
          >
            <SelectTrigger className="w-[140px]">Type</SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.category || "ALL"}
            onValueChange={(v) =>
              setFilters({ ...filters, category: v === "ALL" ? undefined : v })
            }
          >
            <SelectTrigger className="w-[140px]">Category</SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {PROPERTY_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.propertyStatus || "ALL"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                propertyStatus: v === "ALL" ? undefined : v,
              })
            }
          >
            <SelectTrigger className="w-[140px]">Status</SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {PROPERTY_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.bedrooms || "ALL"}
            onValueChange={(v) =>
              setFilters({ ...filters, bedrooms: v === "ALL" ? undefined : v })
            }
          >
            <SelectTrigger className="w-[110px]">Beds</SelectTrigger>
            <SelectContent>
              {BEDROOM_OPTIONS.map((bed) => (
                <SelectItem key={bed} value={bed === "Any" ? "ALL" : bed}>
                  {bed}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.bathrooms || "ALL"}
            onValueChange={(v) =>
              setFilters({ ...filters, bathrooms: v === "ALL" ? undefined : v })
            }
          >
            <SelectTrigger className="w-[110px]">Baths</SelectTrigger>
            <SelectContent>
              {BATHROOM_OPTIONS.map((bath) => (
                <SelectItem key={bath} value={bath === "Any" ? "ALL" : bath}>
                  {bath}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.minPrice || "ALL"}
            onValueChange={(v) =>
              setFilters({ ...filters, minPrice: v === "ALL" ? undefined : v })
            }
          >
            <SelectTrigger className="w-[120px]">Min Price</SelectTrigger>
            <SelectContent>
              {PRICE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value || "ALL"} value={opt.value || "ALL"}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.maxPrice || "ALL"}
            onValueChange={(v) =>
              setFilters({ ...filters, maxPrice: v === "ALL" ? undefined : v })
            }
          >
            <SelectTrigger className="w-[120px]">Max Price</SelectTrigger>
            <SelectContent>
              {PRICE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value || "ALL"} value={opt.value || "ALL"}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

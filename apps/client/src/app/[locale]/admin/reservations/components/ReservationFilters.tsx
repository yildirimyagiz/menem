import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { useTranslations } from "next-intl";

interface ReservationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedFilters: {
    status: string[];
    property: string[];
  };
  onFilterChange: (filterType: string, values: string[]) => void;
}

const statusOptions = ["ACTIVE", "COMPLETED", "CANCELLED"];
const propertyOptions = ["Property 1", "Property 2", "Property 3"];

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFilterChange,
}) => {
  const t = useTranslations("Admin");
  
  return (
  <div className="flex flex-col items-center gap-2 md:flex-row">
    <Input
      placeholder={t("reservations.searchPlaceholder", { defaultValue: "Search reservations..." })}
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full md:w-64"
    />
    <Select
      value={selectedFilters.status[0] ?? ""}
      onValueChange={(value) => onFilterChange("status", value ? [value] : [])}
    >
      <SelectTrigger className="min-w-[120px]">
        <SelectValue placeholder={t("reservations.statusPlaceholder", { defaultValue: "Status" })} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem key={`status-${status}`} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select
      value={selectedFilters.property[0] ?? ""}
      onValueChange={(value) =>
        onFilterChange("property", value ? [value] : [])
      }
    >
      <SelectTrigger className="min-w-[120px]">
        <SelectValue placeholder={t("reservations.propertyPlaceholder", { defaultValue: "Property" })} />
      </SelectTrigger>
      <SelectContent>
        {propertyOptions.map((property) => (
          <SelectItem key={`property-${property}`} value={property}>
            {property}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  );
};

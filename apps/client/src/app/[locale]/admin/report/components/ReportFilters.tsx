import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { ReportStatus, ReportType } from "@reservatior/validators";

interface ReportFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedFilters: {
    status: string[];
    type: string[];
    agency: string[];
  };
  onFilterChange: (filterType: string, values: string[]) => void;
}

const reportTypeOptions = Object.values(ReportType);
const reportStatusOptions = Object.values(ReportStatus);

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFilterChange,
}) => (
  <div className="flex flex-col items-center gap-2 md:flex-row">
    <Input
      placeholder="Search reports..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full md:w-64"
    />
    <Select
      value={selectedFilters.type[0] || ""}
      onValueChange={(value) => onFilterChange("type", value ? [value] : [])}
    >
      <SelectTrigger className="min-w-[120px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        {reportTypeOptions.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select
      value={selectedFilters.status[0] || ""}
      onValueChange={(value) => onFilterChange("status", value ? [value] : [])}
    >
      <SelectTrigger className="min-w-[120px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {reportStatusOptions.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

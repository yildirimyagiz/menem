import type { FC } from "react";
import { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import type { ReportStatus, ReportType } from "@reservatior/validators";
import { cn } from "@reservatior/ui";
import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
import { Card } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

interface ReportGeneratorProps {
  onGenerate: (reportConfig: ReportConfig) => void;
  isLoading?: boolean;
}

export interface ReportConfig {
  title: string;
  reportType: ReportType;
  startDate: Date;
  endDate: Date;
  format: "PDF" | "CSV" | "EXCEL";
  description?: string;
  filters: {
    agencyId?: string;
    facilityId?: string;
    propertyId?: string;
    tenantId?: string;
    agentId?: string;
    status?: string;
    entityType?: string;
  };
}

// Report types from the backend
const reportTypes: { value: ReportType; label: string; description: string }[] =
  [
    {
      value: "FINANCIAL",
      label: "Financial Report",
      description: "Revenue, expenses, and financial metrics",
    },
    {
      value: "PERFORMANCE",
      label: "Performance Report",
      description: "Occupancy rates and property performance",
    },
    {
      value: "COMPLIANCE",
      label: "Compliance Report",
      description: "Regulatory compliance and legal requirements",
    },
    {
      value: "MARKET_ANALYSIS",
      label: "Market Analysis",
      description: "Market trends and competitive analysis",
    },
    {
      value: "REVENUE",
      label: "Revenue Report",
      description: "Revenue trends and analysis",
    },
    {
      value: "OCCUPANCY",
      label: "Occupancy Report",
      description: "Occupancy tracking and analysis",
    },
    {
      value: "GUEST_ANALYSIS",
      label: "Guest Analysis",
      description: "Guest behavior and preferences",
    },
    {
      value: "OFFER_PERFORMANCE",
      label: "Offer Performance",
      description: "Offer success rates and metrics",
    },
    {
      value: "RESERVATION_SUMMARY",
      label: "Reservation Summary",
      description: "Reservation patterns and trends",
    },
    {
      value: "EXPENSE_TRACKING",
      label: "Expense Tracking",
      description: "Expense monitoring and analysis",
    },
    {
      value: "TASK_MANAGEMENT",
      label: "Task Management",
      description: "Task completion and efficiency metrics",
    },
    {
      value: "PROPERTY_PERFORMANCE",
      label: "Property Performance",
      description: "Individual property performance metrics",
    },
  ];

const reportFormats = [
  {
    value: "PDF",
    label: "PDF Document",
    description: "Portable Document Format",
  },
  { value: "CSV", label: "CSV File", description: "Comma-separated values" },
  {
    value: "EXCEL",
    label: "Excel Spreadsheet",
    description: "Microsoft Excel format",
  },
];

interface DateRangePickerProps {
  value: {
    from: Date;
    to: Date;
  };
  onSelect: (range: { from: Date; to: Date }) => void;
  error?: string;
}

const DateRangePicker: FC<DateRangePickerProps> = ({
  value,
  onSelect,
  error,
}) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={(range: any) => onSelect(range)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

const ReportGenerator: FC<ReportGeneratorProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: "",
    reportType: "FINANCIAL",
    startDate: new Date(),
    endDate: new Date(),
    format: "PDF",
    description: "",
    filters: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!reportConfig.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (reportConfig.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
    }

    if (!reportConfig.startDate) {
      newErrors.dateRange = "Start date is required";
    }

    if (!reportConfig.endDate) {
      newErrors.dateRange = "End date is required";
    }

    if (
      reportConfig.startDate &&
      reportConfig.endDate &&
      reportConfig.startDate >= reportConfig.endDate
    ) {
      newErrors.dateRange = "End date must be after start date";
    }

    if (reportConfig.description && reportConfig.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      return;
    }

    onGenerate(reportConfig);
  };

  const handleTitleChange = (value: string) => {
    setReportConfig({ ...reportConfig, title: value });
    if (errors.title) {
      setErrors({ ...errors, title: "" });
    }
  };

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setReportConfig({
      ...reportConfig,
      startDate: range.from || new Date(),
      endDate: range.to || new Date(),
    });
    if (errors.dateRange) {
      setErrors({ ...errors, dateRange: "" });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setReportConfig({ ...reportConfig, description: value });
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Generate Report</h2>
      <div className="grid gap-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Report Title *
          </label>
          <Input
            value={reportConfig.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter report title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Report Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Report Type *
            </label>
            <Select
              value={reportConfig.reportType}
              onValueChange={(value: ReportType) =>
                setReportConfig({ ...reportConfig, reportType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div>
            <label className="mb-2 block text-sm font-medium">Format *</label>
            <Select
              value={reportConfig.format}
              onValueChange={(value: "PDF" | "CSV" | "EXCEL") =>
                setReportConfig({ ...reportConfig, format: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {reportFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {format.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="mb-2 block text-sm font-medium">Date Range *</label>
          <DateRangePicker
            value={{
              from: reportConfig.startDate,
              to: reportConfig.endDate,
            }}
            onSelect={handleDateRangeChange}
            error={errors.dateRange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Description (Optional)
          </label>
          <Textarea
            value={reportConfig.description || ""}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter report description"
            className={errors.description ? "border-red-500" : ""}
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Filters */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Filters (Optional)
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Agency ID
              </label>
              <Input
                value={reportConfig.filters.agencyId || ""}
                onChange={(e) =>
                  setReportConfig({
                    ...reportConfig,
                    filters: {
                      ...reportConfig.filters,
                      agencyId: e.target.value,
                    },
                  })
                }
                placeholder="Enter agency ID"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Facility ID
              </label>
              <Input
                value={reportConfig.filters.facilityId || ""}
                onChange={(e) =>
                  setReportConfig({
                    ...reportConfig,
                    filters: {
                      ...reportConfig.filters,
                      facilityId: e.target.value,
                    },
                  })
                }
                placeholder="Enter facility ID"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Property ID
              </label>
              <Input
                value={reportConfig.filters.propertyId || ""}
                onChange={(e) =>
                  setReportConfig({
                    ...reportConfig,
                    filters: {
                      ...reportConfig.filters,
                      propertyId: e.target.value,
                    },
                  })
                }
                placeholder="Enter property ID"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Tenant ID
              </label>
              <Input
                value={reportConfig.filters.tenantId || ""}
                onChange={(e) =>
                  setReportConfig({
                    ...reportConfig,
                    filters: {
                      ...reportConfig.filters,
                      tenantId: e.target.value,
                    },
                  })
                }
                placeholder="Enter tenant ID"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Agent ID
              </label>
              <Input
                value={reportConfig.filters.agentId || ""}
                onChange={(e) =>
                  setReportConfig({
                    ...reportConfig,
                    filters: {
                      ...reportConfig.filters,
                      agentId: e.target.value,
                    },
                  })
                }
                placeholder="Enter agent ID"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !reportConfig.title.trim()}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              <span>Generating Report...</span>
            </div>
          ) : (
            "Generate Report"
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ReportGenerator;

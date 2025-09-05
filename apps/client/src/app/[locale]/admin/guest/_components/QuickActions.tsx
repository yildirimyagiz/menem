"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Plus,
  RefreshCw,
  Settings2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

// CSV utility for export
function arrayToCSV(data: any[], columns: string[]): string {
  const header = columns.join(",");
  const rows = data.map((row) =>
    columns.map((col) => JSON.stringify(row[col] ?? "")).join(","),
  );
  return [header, ...rows].join("\n");
}

interface QuickActionsProps {
  onRefresh: () => void;
  onCreateGuest?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onBulkActions?: () => void;
  guests?: any[]; // Pass current filtered guests for export
  onQuickUpload?: (guests: any[]) => void;
}

export function QuickActions({
  onRefresh,
  onCreateGuest,
  onExport,
  onImport,
  onBulkActions,
  guests = [],
  onQuickUpload,
}: QuickActionsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!guests.length) return;
    const columns = [
      "name",
      "email",
      "phone",
      "nationality",
      "passportNumber",
      "gender",
      "birthDate",
      "address",
      "city",
      "country",
      "zipCode",
      "agencyId",
    ];
    const csv = arrayToCSV(guests, columns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guests.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
        if (!headerLine) {
          setImportError("CSV file is empty or invalid.");
          return;
        }
        const headers = headerLine.split(",");
        const guests = lines.map((line) => {
          const values = line.split(",");
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = values[i]?.replace(/^"|"$/g, "") ?? "";
          });
          return obj;
        });
        // TODO: Send guests to backend for bulk creation
        setImportSuccess(
          `Imported ${guests.length} guests (not yet sent to backend)`,
        );
      } catch (err) {
        setImportError("Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
  };

  // Quick Upload CSV
  const quickUploadInputRef = useRef<HTMLInputElement>(null);
  const handleQuickUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
        if (!headerLine) return;
        const headers = headerLine.split(",");
        const guests = lines.map((line) => {
          const values = line.split(",");
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = values[i]?.replace(/^"|"$/g, "") ?? "";
          });
          return obj;
        });
        if (onQuickUpload) onQuickUpload(guests);
      } catch {}
    };
    reader.readAsText(file);
  };

  const quickActions = [
    {
      label: "Add Guest",
      icon: Plus,
      onClick: onCreateGuest,
      variant: "default" as const,
      className:
        "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg",
    },
    {
      label: "Refresh",
      icon: RefreshCw,
      onClick: handleRefresh,
      variant: "outline" as const,
      className: isRefreshing ? "animate-pulse" : "",
    },
  ];

  // More actions in the dropdown
  const moreActions = [
    {
      label: "Import Guests (CSV)",
      icon: Upload,
      onClick: () => setIsImportModalOpen(true),
      description: "Import guests from CSV file",
    },
    {
      label: "Export Guests (CSV)",
      icon: Download,
      onClick: handleExportCSV,
      description: "Export guests to CSV file",
    },
    {
      label: "Bulk Actions",
      icon: Users,
      onClick: onBulkActions,
      description: "Perform bulk operations",
    },
    {
      label: "Guest Settings",
      icon: Settings2,
      onClick: () => {},
      description: "Configure guest management",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Primary Actions */}
      {quickActions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              variant={action.variant}
              size="sm"
              onClick={action.onClick}
              className={action.className}
              disabled={action.label === "Refresh" && isRefreshing}
            >
              <IconComponent
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="ml-2 hidden sm:inline">{action.label}</span>
            </Button>
          </motion.div>
        );
      })}

      {/* Quick Upload Button */}
      {onQuickUpload && (
        <>
          <input
            type="file"
            accept=".csv"
            ref={quickUploadInputRef}
            style={{ display: "none" }}
            onChange={handleQuickUploadCSV}
            aria-label="Quick upload CSV file"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickUploadInputRef.current?.click()}
            className="border-green-500 text-green-700 hover:bg-green-50"
          >
            <Upload className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Quick Upload</span>
          </Button>
        </>
      )}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">More</span>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Guest Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {moreActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <DropdownMenuItem
                key={action.label}
                onClick={action.onClick}
                className="flex items-start gap-3 p-3"
              >
                <IconComponent className="mt-0.5 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold">Import Guests from CSV</h2>
            <label htmlFor="csv-upload" className="mb-2 block font-medium">
              CSV File
            </label>
            <input
              id="csv-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="mb-4"
            />
            {importError && (
              <div className="mb-2 text-red-600">{importError}</div>
            )}
            {importSuccess && (
              <div className="mb-2 text-green-600">{importSuccess}</div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsImportModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="ml-4 hidden items-center gap-4 border-l border-gray-200 pl-4 dark:border-gray-700 lg:flex"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>System Online</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span>Auto-sync Enabled</span>
        </div>
      </motion.div>
    </div>
  );
}

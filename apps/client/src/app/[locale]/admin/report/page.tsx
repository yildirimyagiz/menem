"use client";

import { useEffect, useState } from "react";

import type { Report, ReportStatus, ReportType } from "@reservatior/validators";

import { api } from "~/trpc/react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { DataTablePagination } from "./components/data-table-pagination";
import { QuickActions } from "./components/QuickActions";
import { ReportFilters } from "./components/ReportFilters";
import { ReportStats } from "./components/ReportStats";
import { UserNav } from "./components/user-nav";

const PAGE_SIZE = 10;

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: [] as string[],
    type: [] as string[],
    agency: [] as string[],
  });
  const [page, setPage] = useState(1);

  // Fetch reports using TRPC
  const {
    data: fetchedReports,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = api.report.all.useQuery({
    page,
    pageSize: PAGE_SIZE,
    title: searchQuery,
    reportType: selectedFilters.type[0],
    status: selectedFilters.status[0],
    agencyId: selectedFilters.agency[0],
  });

  // Get report statistics
  const { data: reportStats } = api.report.summary.useQuery();

  useEffect(() => {
    if (fetchedReports?.data) {
      setReports(fetchedReports.data);
    } else {
      setReports([]);
    }
    setIsLoading(queryLoading);
    setError(queryError ? queryError.message : null);
  }, [fetchedReports, queryLoading, queryError]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesStatus =
      selectedFilters.status.length === 0 ||
      selectedFilters.status.includes(report.status);
    const matchesType =
      selectedFilters.type.length === 0 ||
      selectedFilters.type.includes(report.reportType);
    const matchesAgency =
      selectedFilters.agency.length === 0 ||
      (report.agencyId && selectedFilters.agency.includes(report.agencyId));
    return matchesSearch && matchesStatus && matchesType && matchesAgency;
  });

  const handleFilterChange = (filterType: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }));
    setPage(1); // Reset to first page on filter change
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Report Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all reports across your properties
            </p>
          </div>

          <ReportStats stats={reportStats} />

          <div className="mt-6 space-y-4">
            <QuickActions onRefresh={handleRefresh} />
            <ReportFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Report Management
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  Manage and track all reports across your properties
                </p>
              </div>
              <UserNav followers={[]} />
            </div>
          </div>

          {/* Stats Cards */}
          <ReportStats stats={reportStats} />

          {/* Quick Actions and Filters */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <QuickActions onRefresh={handleRefresh} />
            <ReportFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="rounded-xl bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            {isLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Loading reports...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-16">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xl text-red-600">!</span>
                  </div>
                  <p className="text-lg text-red-600">
                    Error loading reports: {error}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <DataTable columns={columns} data={filteredReports} />
                <DataTablePagination
                  page={page}
                  totalPages={fetchedReports?.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// import type { Reservation } from "@reservatior/validators";
// import { api } from "~/trpc/react";
// import { columns } from "./components/columns";
// import { DataTable } from "./components/data-table";
// import { QuickActions } from "./components/QuickActions";
// import { ReservationFilters } from "./components/ReservationFilters";
// import { ReservationStats } from "./components/ReservationStats";
// import { UserNav } from "./components/user-nav";
// import { DataTablePagination } from "./components/data-table-pagination";

export default function ReservationPage() {
  const t = useTranslations("Admin");
  // const [reservations, setReservations] = useState<Reservation[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedFilters, setSelectedFilters] = useState({
  //   status: [] as string[],
  //   type: [] as string[],
  //   property: [] as string[],
  // });
  // const [page, setPage] = useState(1);

  // // Fetch reservations using TRPC
  // const {
  //   data: fetchedReservations,
  //   isLoading: queryLoading,
  //   error: queryError,
  //   refetch,
  // } = api.reservation.all.useQuery({
  //   page,
  //   pageSize: 10,
  //   // ...filters
  // });

  // // Get reservation statistics
  // const { data: reservationStats } = api.reservation.summary.useQuery();

  // useEffect(() => {
  //   if (fetchedReservations?.data) {
  //     setReservations(fetchedReservations.data);
  //   } else {
  //     setReservations([]);
  //   }
  //   setIsLoading(queryLoading);
  //   setError(queryError ? queryError.message : null);
  // }, [fetchedReservations, queryLoading, queryError]);

  // const filteredReservations = reservations.filter((reservation) => {
  //   // Implement filtering logic here
  //   return true;
  // });

  // const handleFilterChange = (filterType: string, values: string[]) => {
  //   setSelectedFilters((prev) => ({
  //     ...prev,
  //     [filterType]: values,
  //   }));
  //   setPage(1); // Reset to first page on filter change
  // };

  // const handleRefresh = () => {
  //   refetch();
  // };

  // const handlePageChange = (newPage: number) => {
  //   setPage(newPage);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("reservations.title", { defaultValue: "Reservation Management" })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("reservations.description", { defaultValue: "Manage and track all reservations across your properties" })}
            </p>
          </div>

          {/* <ReservationStats stats={reservationStats} /> */}

          <div className="mt-6 space-y-4">
            {/* <QuickActions onRefresh={handleRefresh} /> */}
            {/* <ReservationFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            /> */}
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
                  {t("reservations.title", { defaultValue: "Reservation Management" })}
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  {t("reservations.description", { defaultValue: "Manage and track all reservations across your properties" })}
                </p>
              </div>
              {/* <UserNav followers={[]} /> */}
            </div>
          </div>

          {/* Stats Cards */}
          {/* <ReservationStats stats={reservationStats} /> */}

          {/* Quick Actions and Filters */}
          <div className="mb-8 flex items-center justify-between gap-4">
            {/* <QuickActions onRefresh={handleRefresh} /> */}
            {/* <ReservationFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            /> */}
          </div>

          {/* Main Content */}
          <div className="rounded-xl bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            {/* {isLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Loading reservations...
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
                    Error loading reservations: {error}
                  </p>
                </div>
              </div>
            ) : (
              <DataTable columns={columns} data={filteredReservations} />
              <DataTablePagination
                page={page}
                totalPages={fetchedReservations?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            )} */}
            <div className="p-8 text-center text-gray-400">
              {t("reservations.comingSoon", { defaultValue: "Reservation table and features coming soon..." })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

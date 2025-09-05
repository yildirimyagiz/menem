"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import type { Guest, GuestFilterInput } from "@reservatior/validators";

import { api } from "~/trpc/react";
import { columns as guestColumns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import GuestDeleteModal from "./_components/GuestDeleteModal";
import { GuestFilters } from "./_components/GuestFilters";
import GuestModal from "./_components/GuestModal";
import { GuestStats } from "./_components/GuestStats";
import { QuickActions } from "./_components/QuickActions";

const AdminGuestPage = () => {
  const t = useTranslations();
  const [filter] = useState<GuestFilterInput>({
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    pageSize: 20,
  });
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [] as string[],
    nationality: [] as string[],
    country: [] as string[],
  });

  const { data, isPending, isError, refetch, error } = api.guest.all.useQuery(
    filter,
    { refetchOnWindowFocus: false, retry: 2 },
  );

  useEffect(() => {
    if (isError && error) {
      console.error("Error loading guests:", error);
    }
  }, [isError, error]);

  // Fix the data access - use the correct structure from the API response
  const guests: Guest[] = Array.isArray(data?.data?.items)
    ? (data.data.items as Guest[])
    : [];

  const filteredGuests = useMemo(
    () =>
      guests.filter((guest) => {
        const matchesSearch =
          guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.phone.includes(searchQuery) ||
          guest.passportNumber.includes(searchQuery);

        const matchesGender =
          selectedFilters.gender.length === 0 ||
          selectedFilters.gender.includes(guest.gender);

        const matchesNationality =
          selectedFilters.nationality.length === 0 ||
          selectedFilters.nationality.includes(guest.nationality);

        const matchesCountry =
          selectedFilters.country.length === 0 ||
          selectedFilters.country.includes(guest.country);

        return (
          matchesSearch && matchesGender && matchesNationality && matchesCountry
        );
      }),
    [guests, searchQuery, selectedFilters],
  );

  const handleFilterChange = (filterType: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateGuest = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsEditModalOpen(true);
  };

  const handleDeleteGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsDeleteModalOpen(true);
  };

  const handleGuestSaved = () => {
    refetch();
  };

  const handleGuestDeleted = () => {
    refetch();
  };

  // Calculate stats from guest data
  const calculatedStats = useMemo(() => {
    if (!guests.length) return undefined;

    const byGender = guests.reduce(
      (acc, guest) => {
        acc[guest.gender] = (acc[guest.gender] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byNationality = guests.reduce(
      (acc, guest) => {
        acc[guest.nationality] = (acc[guest.nationality] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byCountry = guests.reduce(
      (acc, guest) => {
        acc[guest.country] = (acc[guest.country] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const recentRegistrations = guests.filter(
      (guest) =>
        new Date(guest.createdAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    ).length;

    const activeReservations = guests.reduce(
      (total, guest) => total + (guest.Reservation?.length ?? 0),
      0,
    );

    return {
      total: guests.length,
      byGender,
      byNationality,
      byCountry,
      recentRegistrations,
      activeReservations,
    };
  }, [guests]);

  const handleQuickUpload = (guests: any[]) => {
    // TODO: Implement quick upload logic
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
  {t("guestManagement.title", { defaultValue: "Guest Management" })}
</h1>
<p className="text-gray-600 dark:text-gray-400">
  {t("guestManagement.description", { defaultValue: "Manage and track all guests across your properties" })}
</p>
          </div>

          <GuestStats stats={calculatedStats} />

          <div className="mt-6 space-y-4">
            <QuickActions
              onRefresh={handleRefresh}
              onCreateGuest={handleCreateGuest}
            />
            <GuestFilters
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t("guestManagement.title", { defaultValue: "Guest Management" })}
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  {t("guestManagement.description", { defaultValue: "Manage and track all guests across your properties" })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <GuestStats stats={calculatedStats} />
          </motion.div>

          {/* Quick Actions and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex items-center justify-between gap-4"
          >
            <QuickActions
              onRefresh={handleRefresh}
              onCreateGuest={handleCreateGuest}
            />
            <GuestFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80"
          >
            {isPending ? (
              <div className="flex items-center justify-center p-16">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {t("guestManagement.loading", { defaultValue: "Loading guests..." })}
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
                    {t("guestManagement.error", { defaultValue: "Error loading guests:" })} {error.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <DataTable
                  data={filteredGuests}
                  columns={guestColumns}
                  onQuickUpload={handleQuickUpload}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <GuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onGuestSaved={handleGuestSaved}
      />

      <GuestModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        guest={selectedGuest}
        onGuestSaved={handleGuestSaved}
      />

      <GuestDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        guest={selectedGuest}
        onGuestDeleted={handleGuestDeleted}
      />
    </div>
  );
};

export default AdminGuestPage;

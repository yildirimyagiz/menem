"use client";

import {
  ExclamationTriangleIcon,
  PlusIcon,
  UserGroupIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent } from "@reservatior/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";
import type { GuestFilterInput } from "@reservatior/validators";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import type { Guest } from "~/utils/interfaces";
import GuestFilterForm from "./_components/GuestFilterForm";
import GuestList from "./_components/GuestList";
import GuestModal from "./_components/GuestModal";

// Guest statistics data following admin page pattern
const guestStatsData = [
  {
    title: "totalGuests",
    value: "0",
    change: "+0%",
    changeType: "positive" as const,
    icon: UserGroupIcon,
    color: "from-blue-500 to-cyan-500",
    trend: "up" as const,
    detail: "guestsLoadedText",
  },
  {
    title: "maleGuests",
    value: "0",
    change: "+0%",
    changeType: "positive" as const,
    icon: UserIcon,
    color: "from-green-500 to-emerald-500",
    trend: "up" as const,
    detail: "malePercentageText",
  },
  {
    title: "femaleGuests",
    value: "0",
    change: "+0%",
    changeType: "positive" as const,
    icon: UserIcon,
    color: "from-purple-500 to-pink-500",
    trend: "up" as const,
    detail: "femalePercentageText",
  },
];

export default function ClientGuestPage() {
  const { toast } = useToast();
  const t = useTranslations();
  const [filter, setFilter] = useState<GuestFilterInput>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Enhanced API connection with better error handling and caching
  const { data, isPending, isError, error, refetch } = api.guest.all.useQuery(
    filter,
    {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const deleteGuestMutation = api.guest.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: t("success"),
        description: t("guestDeleteSuccessDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("deleteFailed"),
        description: error.message || t("guestDeleteErrorDescription"),
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: t("guestLoadErrorTitle"),
        description: error.message || t("guestLoadErrorDescription"),
        variant: "destructive",
      });
    }
  }, [isError, error, toast, t]);

  // Extract guests array from data with proper type handling
  const guests: Guest[] = Array.isArray((data as any)?.data?.items)
    ? (data as any).data.items
    : [];
  const totalGuests = (data as any)?.data?.total || guests.length;

  // Calculate statistics
  const maleGuests = guests.filter((g) => g.gender === "MALE").length;
  const femaleGuests = guests.filter((g) => g.gender === "FEMALE").length;
  const malePercentage = guests.length > 0 ? Math.round((maleGuests / guests.length) * 100) : 0;
  const femalePercentage = guests.length > 0 ? Math.round((femaleGuests / guests.length) * 100) : 0;

  // Update stats data with real values
  const updatedStatsData = guestStatsData.map(stat => {
    switch (stat.title) {
      case "totalGuests":
        return { ...stat, value: totalGuests.toString() };
      case "maleGuests":
        return { ...stat, value: maleGuests.toString() };
      case "femaleGuests":
        return { ...stat, value: femaleGuests.toString() };
      default:
        return stat;
    }
  });

  const handleFilterChange = (newFilter: GuestFilterInput) => {
    setFilter(newFilter);
  };

  const handleSearch = (query: string) => {
    setFilter((prev) => ({
      ...prev,
      search: query,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setIsCreateModalOpen(true);
  };

  const router = useRouter();

  const handleView = (guest: Guest) => {
    router.push(`/client/guest/${guest.id}`);
  };

  const handleDelete = async (guestId: string) => {
    try {
      await deleteGuestMutation.mutateAsync(guestId);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingGuest(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent lg:text-4xl">
              {t("guestPageTitle")}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {t("guestPageDescription")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 border border-green-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">{t("systemOnline")}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                  >
                    <PlusIcon className="h-4 w-4" />
                    {t("addGuestButton")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("addGuestTooltip")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {updatedStatsData.map((stat, index) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-gray-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{t(stat.title)}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">{t("vsLastMonth")}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t(stat.detail)}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="flex items-center space-x-3 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {t("guestLoadErrorTitle")}
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                {error?.message || t("guestLoadErrorDescription")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {t("retryButton")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <GuestFilterForm onFilter={handleFilterChange} currentFilter={filter} />

      {/* Guest List */}
      <div className="mt-8">
        <GuestList
          guests={guests}
          isLoading={isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={handleSearch}
          onFilterChange={(filter) => handleFilterChange(filter as GuestFilterInput)}
          onView={handleView}
        />
      </div>

      {/* Guest Modal */}
      <GuestModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        guest={editingGuest}
      />

      {/* Enhanced Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex flex-col gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                  title={t("addNewGuestTooltip")}
                >
                  <PlusIcon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("addNewGuestTooltip")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

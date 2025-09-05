"use client";

import {
  CalendarIcon,
  EnvelopeIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import type { Guest } from "~/utils/interfaces";

interface GuestListProps {
  guests: Guest[];
  isLoading: boolean;
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filter: Record<string, unknown>) => void;
  onView?: (guest: Guest) => void;
}

const GuestList: React.FC<GuestListProps> = ({
  guests,
  isLoading,
  onEdit,
  onDelete,
  onSearch,
  onFilterChange,
  onView,
}) => {
  const t = useTranslations();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleGenderFilterChange = (value: string) => {
    setGenderFilter(value);
    onFilterChange({ gender: value === "all" ? undefined : value });
  };

  const handleDelete = (guestId: string) => {
    setDeletingId(guestId);
    try {
      onDelete(guestId);

      toast({
        title: t("guestDeletedTitle"),
        description: t("guestDeletedDescription"),
      });
    } catch {
      toast({
        title: t("deleteFailedTitle"),
        description: t("deleteFailedDescription"),
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "FEMALE":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 border-pink-200 dark:border-pink-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch = searchQuery
        ? guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.phone.includes(searchQuery) ||
          guest.passportNumber.includes(searchQuery)
        : true;

      const matchesGender =
        genderFilter === "all" || guest.gender === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [guests, searchQuery, genderFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Search and Controls Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative max-w-sm flex-1">
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i: number) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (filteredGuests.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <UserIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("noGuestsFoundTitle")}
          </h3>
          <p className="mb-6 max-w-md text-center text-gray-500 dark:text-gray-400">
            {searchQuery
              ? t("noGuestsFoundWithSearch")
              : t("noGuestsFoundDescription")}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setGenderFilter("all");
                onSearch("");
                onFilterChange({});
              }}
            >
              {t("clearFilters")}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Enhanced Search and Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center space-x-3">
            <div className="relative max-w-sm flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t("searchGuestsPlaceholder")}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              value={genderFilter}
              onValueChange={handleGenderFilterChange}
            >
              <SelectTrigger className="w-32 transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder={t("gender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="MALE">{t("male")}</SelectItem>
                <SelectItem value="FEMALE">{t("female")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border bg-background p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("gridView")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("listView")}</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <FunnelIcon className="h-4 w-4" />
              <span>
                {filteredGuests.length} {t("guest")}
                {filteredGuests.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Guest Cards/List */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.map((guest, index) => (
              <Card
                key={guest.id}
                className={cn(
                  "group border-0 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                  "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
                  "hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20",
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12 shadow-lg ring-2 ring-white dark:ring-gray-800">
                          {guest.image ? (
                            <AvatarImage
                              src={guest.image}
                              alt={guest.name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                              {getInitials(guest.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-gray-800"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-lg transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {guest.name}
                        </CardTitle>
                        <Badge
                          className={cn(
                            "mt-1 border",
                            getGenderColor(guest.gender),
                          )}
                        >
                          {guest.gender}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {onView && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(guest)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <EyeIcon className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("viewDetails")}</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(guest)}
                            className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <PencilIcon className="h-4 w-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("editGuest")}</TooltipContent>
                      </Tooltip>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                disabled={deletingId === guest.id}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t("deleteGuest")}</TooltipContent>
                          </Tooltip>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("deleteGuestTitle")}</DialogTitle>
                            <DialogDescription>
                              {t("deleteGuestConfirmation", { name: guest.name })}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">{t("cancel")}</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(guest.id)}
                              disabled={deletingId === guest.id}
                            >
                              {deletingId === guest.id
                                ? t("deleting")
                                : t("delete")}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="truncate text-gray-600 dark:text-gray-400">
                        {guest.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {guest.phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span className="truncate text-gray-600 dark:text-gray-400">
                        {guest.city}, {guest.country}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("born")} {format(new Date(guest.birthDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>{t("nationality")}:</span>
                        <span className="font-medium">{guest.nationality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("passport")}:</span>
                        <span className="font-mono font-medium">
                          {guest.passportNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGuests.map((guest, index) => (
              <Card
                key={guest.id}
                className={cn(
                  "group border-0 shadow-sm transition-all duration-300 hover:shadow-md",
                  "bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
                  "hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20",
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        {guest.image ? (
                          <AvatarImage src={guest.image} alt={guest.name} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(guest.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="truncate text-lg font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {guest.name}
                          </h3>
                          <Badge
                            className={cn(
                              "border",
                              getGenderColor(guest.gender),
                            )}
                          >
                            {guest.gender}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <EnvelopeIcon className="h-3 w-3" />
                            <span className="truncate">{guest.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <PhoneIcon className="h-3 w-3" />
                            <span>{guest.phone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPinIcon className="h-3 w-3" />
                            <span className="truncate">
                              {guest.city}, {guest.country}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(guest)}
                        >
                          <EyeIcon className="mr-1 h-4 w-4" />
                          {t("view")}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(guest)}
                      >
                        <PencilIcon className="mr-1 h-4 w-4" />
                        {t("edit")}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="mr-1 h-4 w-4" />
                            {t("delete")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("deleteGuestTitle")}</DialogTitle>
                            <DialogDescription>
                              {t("deleteGuestConfirmation", { name: guest.name })}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">{t("cancel")}</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(guest.id)}
                              disabled={deletingId === guest.id}
                            >
                              {deletingId === guest.id
                                ? t("deleting")
                                : t("delete")}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default GuestList;

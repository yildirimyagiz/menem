"use client";

import { Plus, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import type { User } from "@reservatior/validators";

import { api } from "~/trpc/react";
import AddUser from "./components/AddUser";
import UserTable from "./components/UserTable";
import { useUserManagement } from "./hooks/useUserManagement";

export default function UsersPage() {
  const t = useTranslations("Admin");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 10;

  const {
    selectedUser,
    setSelectedUser,
    editMode,
    editedUser,
    error,
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleCloseSidebar,
    handleCancel,
    handleUserAdded,
    handleInputChange,
    handleUpdateUser,
  } = useUserManagement();

  const { data: fetchedUsers, isLoading: queryLoading } = api.user.all.useQuery(
    {
      page: currentPage,
      pageSize: usersPerPage,
    },
  );

  console.log("[UsersPage] currentPage:", currentPage);
  console.log("[UsersPage] usersPerPage:", usersPerPage);
  console.log("[UsersPage] fetchedUsers:", fetchedUsers);

  // Use paginated data from the API
  const users: User[] = useMemo(
    () =>
      Array.isArray(fetchedUsers?.data?.data)
        ? (fetchedUsers.data.data.filter(Boolean) as User[])
        : [],
    [fetchedUsers],
  );
  const totalUsers = fetchedUsers?.data?.total ?? 0;

  console.log("[UsersPage] users:", users);
  console.log("[UsersPage] totalUsers:", totalUsers);

  const filteredUsers = useMemo(() => {
    if (!users.length) return [];
    return users.filter((user) => {
      const searchableFields = [user.name, user.email, user.role].filter(
        Boolean,
      );
      return searchableFields.some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
  }, [users, searchTerm]);

  if (queryLoading) {
    return (
      <div className="flex h-screen items-center justify-center ios-layout android-layout">
        <div className="mobile-card mobile-fade-in rounded-xl border border-blue-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
          <div className="flex items-center gap-3">
            <div className="mobile-skeleton-avatar" />
            <div className="space-y-2">
              <div className="mobile-skeleton-text h-4 w-32" />
              <div className="mobile-skeleton-text h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex h-screen items-center justify-center ios-layout android-layout">
        <div className="mobile-card mobile-fade-in text-center rounded-xl border border-blue-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mobile-text-lg mb-4">
            {t("noUsersFound", { defaultValue: "No users found. Get started by adding your first user!" })}
          </p>
          <Button className="mobile-button" onClick={() => setShowAddUserForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t("addFirstUser", { defaultValue: "Add First User" })}
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage),
  );

  return (
    <div className="space-y-6 mobile-p-4 ios-layout android-layout">
      {/* Header */}
      <div className="mobile-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mobile-text-xl font-bold lg:text-3xl">{t("userManagement", { defaultValue: "User Management" })}</h1>
            <p className="mobile-text-base text-muted-foreground">
              {t("userManagementDescription", { defaultValue: "Manage and view all your users" })}
            </p>
          </div>
          <Button 
            className="mobile-button" 
            onClick={() => setShowAddUserForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("addNewUser", { defaultValue: "Add New User" })}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mobile-card mobile-fade-in space-y-4 rounded-xl border border-blue-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("searchUsers", { defaultValue: "Search users..." })}
              className="mobile-input pl-10"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              disabled={queryLoading}
              className="mobile-button"
            >
              <Search className="mr-2 h-4 w-4" /> {t("search", { defaultValue: "Search" })}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mobile-fade-in rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/50">
          <p className="mobile-text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* User Table */}
      <div className="mobile-fade-in">
        <UserTable
          users={filteredUsers.slice(
            (currentPage - 1) * usersPerPage,
            currentPage * usersPerPage,
          )}
          onViewDetails={handleViewDetails}
          onEdit={(user) => {
            setSelectedUser(user);
            handleEdit();
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Pagination */}
      <div className="mobile-card mobile-fade-in flex flex-col items-center justify-between gap-4 rounded-xl border border-blue-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
        <div className="mobile-text-sm text-gray-600 dark:text-gray-300">
          {t("showingResults", { 
            start: (currentPage - 1) * usersPerPage + 1,
            end: Math.min(currentPage * usersPerPage, filteredUsers.length),
            total: filteredUsers.length,
            defaultValue: `Showing ${(currentPage - 1) * usersPerPage + 1}-${Math.min(currentPage * usersPerPage, filteredUsers.length)} of ${filteredUsers.length} results`
          })}
        </div>
        <div className="flex gap-2">
                      <Button
              variant="outline"
              size="sm"
              className="mobile-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              {t("previous", { defaultValue: "Previous" })}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="mobile-button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              {t("next", { defaultValue: "Next" })}
            </Button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserForm && (
        <AddUser
          onClose={() => setShowAddUserForm(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
}

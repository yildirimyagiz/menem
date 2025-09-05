"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import type { Task } from "@reservatior/validators";

import { api } from "~/trpc/react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { QuickActions } from "./components/QuickActions";
import { TaskFilters } from "./components/TaskFilters";
import { TaskStats } from "./components/TaskStats";
import { UserNav } from "./components/user-nav";

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    category: [] as string[],
  });

  // Fetch tasks using TRPC with our new schema
  const {
    data: fetchedTasks,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = api.tasks.getAll.useQuery({
    page: 1,
    pageSize: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Get task statistics
  const { data: taskStats } = api.tasks.getStats.useQuery();

  useEffect(() => {
    if (fetchedTasks?.tasks) {
      // Filter out null values and cast to Task type
      const validTasks = fetchedTasks.tasks
        .filter((task) => task !== null)
        .map((task) => task as Task);
      setTasks(validTasks);
    } else {
      setTasks([]);
    }
    setIsLoading(queryLoading);
    setError(queryError ? queryError.message : null);
  }, [fetchedTasks, queryLoading, queryError]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedFilters.status.length === 0 ||
      selectedFilters.status.includes(task.status);

    const matchesPriority =
      selectedFilters.priority.length === 0 ||
      selectedFilters.priority.includes(task.priority);

    const matchesCategory =
      selectedFilters.category.length === 0 ||
      (task.category && selectedFilters.category.includes(task.category));

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleFilterChange = (filterType: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }));
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Task Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all tasks across your properties
            </p>
          </div>

          <TaskStats stats={taskStats} />

          <div className="mt-6 space-y-4">
            <QuickActions onRefresh={handleRefresh} />
            <TaskFilters
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
                  Task Management
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  Manage and track all tasks across your properties
                </p>
              </div>
              <UserNav followers={[]} />
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <TaskStats stats={taskStats} />
          </motion.div>

          {/* Quick Actions and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex items-center justify-between gap-4"
          >
            <QuickActions onRefresh={handleRefresh} />
            <TaskFilters
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
            {isLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Loading tasks...
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
                    Error loading tasks: {error}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <DataTable data={filteredTasks} columns={columns} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

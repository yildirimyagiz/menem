"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "~/utils/interfaces";

interface UseTasksOptions {
  initialPage?: number;
  pageSize?: number;
  onError?: (error: Error) => void;
}

interface UseTasksReturn {
  tasks: (Task | null)[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  filterParams: {
    status?: TaskStatus;
    priority?: TaskPriority;
    type?: TaskType;
    search?: string;
    startDate?: Date;
    dueDate?: Date;
  };
  setFilterParams: (params: Partial<UseTasksReturn["filterParams"]>) => void;
  setPage: (page: number) => void;
  refreshTasks: () => Promise<void>;
  createTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasks = ({
  initialPage = 1,
  pageSize = 10,
  onError,
}: UseTasksOptions = {}): UseTasksReturn => {
  const t = useTranslations("tasks");
  const [tasks, setTasks] = useState<(Task | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [filterParams, setFilterParams] = useState<
    UseTasksReturn["filterParams"]
  >({});

  const handleError = useCallback(
    (error: Error) => {
      setError(error);
      onError?.(error);
    },
    [onError],
  );

  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("pageSize", pageSize.toString());

      // Add filter params if they exist
      if (filterParams.status) params.append("status", filterParams.status);
      if (filterParams.priority)
        params.append("priority", filterParams.priority);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.search) params.append("search", filterParams.search);
      if (filterParams.startDate)
        params.append("startDate", filterParams.startDate.toISOString());
      if (filterParams.dueDate)
        params.append("dueDate", filterParams.dueDate.toISOString());

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) {
        throw new Error(t("errors.fetchFailed"));
      }

      const data = await response.json();
      setTasks(data.tasks);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error(t("errors.unknown")),
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterParams, t, handleError]);

  const createTask = useCallback(
    async (task: Omit<Task, "id">) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          throw new Error(t("errors.createFailed"));
        }

        await refreshTasks();
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error(t("errors.unknown")),
        );
      } finally {
        setLoading(false);
      }
    },
    [t, handleError, refreshTasks],
  );

  const updateTask = useCallback(
    async (id: string, task: Partial<Task>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          throw new Error(t("errors.updateFailed"));
        }

        await refreshTasks();
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error(t("errors.unknown")),
        );
      } finally {
        setLoading(false);
      }
    },
    [t, handleError, refreshTasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(t("errors.deleteFailed"));
        }

        await refreshTasks();
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error(t("errors.unknown")),
        );
      } finally {
        setLoading(false);
      }
    },
    [t, handleError, refreshTasks],
  );

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const updateFilterParams = useCallback(
    (params: Partial<UseTasksReturn["filterParams"]>) => {
      setFilterParams((prev) => ({ ...prev, ...params }));
      setCurrentPage(1); // Reset to first page when filters change
    },
    [],
  );

  return {
    tasks,
    loading,
    error,
    currentPage,
    totalPages,
    filterParams,
    setFilterParams: updateFilterParams,
    setPage,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";

import type { TaskFilterInput } from "@reservatior/validators";

import type { Task } from "~/utils/interfaces";
import TaskDetailModal from "~/shared/components/tasks/TaskDetailModal";
import { api } from "~/trpc/react";
import TaskList from "./components/TaskList";
import TaskListSkeleton from "./components/TaskListSkeleton";
import TabFilters from "./TabFilters";

interface TasksLayoutProps {
  children: React.ReactNode;
}

const TasksLayout: React.FC<TasksLayoutProps> = ({ children }) => {
  const params = useParams();
  const _locale =
    params && typeof params === "object" && "locale" in params && params.locale
      ? (params.locale as string)
      : "en";

  const [filterParams, setFilterParams] = useState<TaskFilterInput>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Modal state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Type for tasksData
  interface TasksDataType {
    tasks: (Task | null)[];
    totalPages: number;
    page: number;
  }

  // Defensive: Only call if api.tasks and api.tasks.getAll.useQuery exist
  let queryResult: ReturnType<typeof api.tasks.getAll.useQuery> | undefined = undefined;
  if (api.tasks && api.tasks.getAll && typeof api.tasks.getAll.useQuery === 'function') {
    queryResult = api.tasks.getAll.useQuery(filterParams, { staleTime: 1000 * 60 * 5 });
  }
  const tasksData = queryResult?.data as TasksDataType | undefined;
  const refetch = queryResult?.refetch ?? (() => {});

  const handleFilterChange = (newFilters: Partial<TaskFilterInput>) => {
    setFilterParams((prev) => ({ ...prev, ...newFilters }));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleTaskUpdated = () => {
    refetch();
  };

  const handleTaskDeleted = () => {
    refetch();
  };

  function isValidTasksData(data: unknown): data is TasksDataType {
    return (
      typeof data === "object" &&
      data !== null &&
      Array.isArray((data as TasksDataType).tasks)
    );
  }

  const transformedTasks: Task[] = isValidTasksData(tasksData)
    ? tasksData.tasks
        .filter((task): task is Task => !!task)
        .map((task) => ({
          ...task,
          description: task.description ?? "",
          category: task.category ?? null,
          labels: Array.isArray(task.labels) ? task.labels : [],
          followers: Array.isArray(task.followers) ? task.followers : [],
        }))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Compact, styled section header */}
      <div className="mb-4">
        <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-extrabold text-transparent">
          Task Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Organize and track your tasks efficiently. Stay on top of your work
          and never miss a deadline.
        </p>
      </div>
      <div className="mb-8">
        <TabFilters
          onChange={handleFilterChange}
          currentFilters={filterParams}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<TaskListSkeleton />}>
            {tasksData && (
              <TaskList
                tasks={transformedTasks}
                totalPages={tasksData.totalPages}
                currentPage={tasksData.page}
                onPageChange={(page) => handleFilterChange({ page })}
                onTaskClick={handleTaskClick}
              />
            )}
          </Suspense>
        </div>
        <div className="lg:col-span-1">{children}</div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </div>
  );
};

export default TasksLayout;

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";

import type { Task } from "~/utils/interfaces";
import ButtonPrimary from "~/shared/ButtonPrimary";
import Pagination from "~/shared/Pagination";

interface TaskListProps {
  tasks: (Task | null)[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  baseUrl?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  createButtonHref?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onTaskClick?: (task: Task) => void;
  customTaskRender?: (task: Task) => React.ReactNode;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalPages,
  currentPage,
  onPageChange,
  baseUrl,
  showCreateButton = true,
  createButtonText,
  createButtonHref,
  emptyStateTitle,
  emptyStateDescription,
  onTaskClick,
  customTaskRender,
}) => {
  const t = useTranslations("tasks");
  const params = useParams();

  // Use locale-aware defaults if not provided
  const defaultBaseUrl = `/${params.locale}/client/tasks`;
  const defaultCreateButtonHref = `/${params.locale}/client/tasks/new`;

  const finalBaseUrl = baseUrl ?? defaultBaseUrl;
  const finalCreateButtonHref = createButtonHref ?? defaultCreateButtonHref;

  const handleTaskClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const renderTask = (task: Task) => {
    if (customTaskRender) {
      return customTaskRender(task);
    }

    const TaskContent = (
      <Card className="group relative flex h-full w-full cursor-pointer flex-col rounded-2xl border border-blue-100 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/90 hover:shadow-2xl">
        {/* Floating status badge */}
        <div className="absolute right-4 top-4 z-10">
          <Badge
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow-md ${
              task.status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : task.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-800"
                  : task.status === "TODO"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {t(`status.${task.status}`)}
          </Badge>
        </div>
        <div className="flex min-h-[120px] flex-col gap-2">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {task.title}
          </h3>
          <p className="mt-1 line-clamp-3 text-sm text-gray-500">
            {task.description}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
              {t("priority.label")}: {t(`priority.${task.priority}`)}
            </Badge>
            <Badge className="rounded bg-purple-50 px-2 py-0.5 font-semibold text-purple-700">
              {t("type.label")}: {t(`type.${task.type}`)}
            </Badge>
          </div>
          <div className="text-gray-400">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : t("noDueDate")}
          </div>
        </div>
      </Card>
    );

    return onTaskClick ? (
      <div onClick={() => handleTaskClick(task)} className="cursor-pointer">
        {TaskContent}
      </div>
    ) : (
      <Link key={task.id} href={`${finalBaseUrl}/${task.id}`}>
        {TaskContent}
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white/80 p-8 text-center shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            {emptyStateTitle ?? t("emptyState.title")}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {emptyStateDescription ?? t("emptyState.description")}
          </p>
          {showCreateButton && (
            <Link href={finalCreateButtonHref} passHref legacyBehavior>
              <Button
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                type="button"
              >
                {createButtonText ?? t("actions.add")}
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <>
          <div className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-purple-50/30 p-4 shadow-inner">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {tasks.map((task) => {
                if (!task) return null;
                return (
                  <div key={task.id} className="flex w-full">
                    {renderTask(task)}
                  </div>
                );
              })}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;

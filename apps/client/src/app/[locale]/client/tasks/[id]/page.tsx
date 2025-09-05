"use client";

import { Fragment, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Popover, Transition } from "@headlessui/react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Edit,
  Home,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Skeleton } from "@reservatior/ui/skeleton";
import { Textarea } from "@reservatior/ui/textarea";
import {
  TaskCategoryEnum,
  TaskLabelEnum,
  TaskPriorityEnum,
  TaskStatusEnum,
  TaskTypeEnum,
} from "@reservatior/validators";

import { api } from "~/trpc/react";

function Avatar({ name, size = 32 }: { name?: string; size?: number }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600"
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {initials}
    </div>
  );
}

interface EditTaskForm {
  title: string;
  description: string;
  status: string;
  type: string;
  priority: string;
  dueDate: string;
  assigneeId: string;
  labels: string[];
  category: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditTaskForm>({
    title: "",
    description: "",
    status: "",
    type: "",
    priority: "",
    dueDate: "",
    assigneeId: "",
    labels: [],
    category: "",
  });
  const [newLabel, setNewLabel] = useState("");

  const {
    data: task,
    isLoading,
    isError,
    error,
    refetch,
  } = api.tasks.getById.useQuery({ id }, { enabled: !!id });

  const { data: users } = api.user.all.useQuery();

  const deleteMutation = api.tasks.delete.useMutation({
    onSuccess: () => router.push("/tasks"),
  });
  const completeMutation = api.tasks.update.useMutation({
    onSuccess: () => refetch(),
  });
  const updateMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      refetch();
      setShowEditModal(false);
    },
  });

  const t = useTranslations("tasks");

  useEffect(() => {
    if (!id) router.push("/tasks");
  }, [id, router]);

  useEffect(() => {
    if (task && showEditModal) {
      setEditForm({
        title: task.title || "",
        description: task.description ?? "",
        status: task.status || "",
        type: task.type || "",
        priority: task.priority || "",
        dueDate:
          task.dueDate && task.dueDate !== null
            ? new Date(task.dueDate).toISOString().split("T")[0]!
            : "",
        assigneeId: task.assignedTo?.id ? String(task.assignedTo.id) : "",
        labels: Array.isArray(task.labels) ? task.labels : [],
        category: task.category || "",
      });
    }
  }, [task, showEditModal]);

  const handleSave = async () => {
    if (!task) return;

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: task.id,
        title: editForm.title,
        description: editForm.description,
        status: editForm.status as any,
        type: editForm.type as any,
        priority: editForm.priority as any,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate) : undefined,
        assignedToId: editForm.assigneeId || undefined,
        labels: editForm.labels as any,
        category: editForm.category as any,
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !editForm.labels.includes(newLabel.trim())) {
      setEditForm((prev) => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()],
      }));
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      labels: prev.labels.filter((label) => label !== labelToRemove),
    }));
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Tasks", href: "/client/tasks" },
    { label: task?.title ?? "Task Detail" },
  ];

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 max-w-2xl">
        <Skeleton className="mb-4 h-10 w-1/2" />
        <Skeleton className="mb-2 h-6 w-1/3" />
        <Skeleton className="mb-4 h-32 w-full" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    );
  }
  if (isError || !task) {
    return (
      <div className="mx-auto mt-10 max-w-2xl text-center">
        <p className="mb-4 font-semibold text-red-500">
          {error?.message ?? "Task not found."}
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-white p-8 shadow">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        {breadcrumbs.map((bc, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1">/</span>}
            {bc.href ? (
              <a href={bc.href} className="text-primary-600 hover:underline">
                {bc.label}
              </a>
            ) : (
              <span>{bc.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-2xl font-bold">{task.title}</h1>
        <Badge variant="secondary" className="px-2 py-1 text-xs">
          {task.status}
        </Badge>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowEditModal(true)}
          title="Edit Task"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete Task"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
        {task.status !== "COMPLETED" && (
          <Button
            variant="secondary"
            size="icon"
            onClick={async () => {
              setIsCompleting(true);
              await completeMutation.mutateAsync({
                id: task.id,
                status: "COMPLETED",
              });
              setIsCompleting(false);
            }}
            disabled={isCompleting}
            title="Mark as Completed"
          >
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </Button>
        )}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="px-2 py-1 text-xs">
          {task.type}
        </Badge>
        {task.priority && (
          <Badge variant="outline" className="px-2 py-1 text-xs">
            Priority: {task.priority}
          </Badge>
        )}
        {task.dueDate && (
          <Badge variant="outline" className="px-2 py-1 text-xs">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Badge>
        )}
        {/* Labels/tags */}
        {task.labels &&
          Array.isArray(task.labels) &&
          task.labels.length > 0 &&
          task.labels.map((label: string) => (
            <Badge
              key={label}
              variant="secondary"
              className="bg-blue-100 px-2 py-1 text-xs text-blue-700"
            >
              {label}
            </Badge>
          ))}
      </div>
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Description</h2>
        <p className="whitespace-pre-line text-gray-700">
          {task.description ?? (
            <span className="text-gray-400">No description provided.</span>
          )}
        </p>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <Avatar name={task.assignedTo?.name ?? undefined} />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gray-500">
              Assignee
            </h3>
            <p className="text-gray-800">
              {task.assignedTo?.name ?? (
                <span className="text-gray-400">Unassigned</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar name={task.createdBy?.name ?? undefined} />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gray-500">
              Created By
            </h3>
            <p className="text-gray-800">
              {task.createdBy?.name ?? (
                <span className="text-gray-400">Unknown</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-gray-500">
            Created At
          </h3>
          <p className="text-gray-800">
            {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-gray-500">
            Updated At
          </h3>
          <p className="text-gray-800">
            {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "-"}
          </p>
        </div>
      </div>
      {/* Related property/facility */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {task.Property && (
          <div className="flex items-center gap-2">
            <Home className="text-primary-500 h-5 w-5" />
            <div>
              <h3 className="mb-1 text-sm font-semibold text-gray-500">
                Property
              </h3>
              <p className="text-gray-800">
                {task.Property?.title ? String(task.Property.title ?? "") : ""}
              </p>
            </div>
          </div>
        )}
        {task.Facility && (
          <div className="flex items-center gap-2">
            <Building2 className="text-primary-500 h-5 w-5" />
            <div>
              <h3 className="mb-1 text-sm font-semibold text-gray-500">
                Facility
              </h3>
              <p className="text-gray-800">
                {task.Facility && task.Facility.name
                  ? String(task.Facility.name ?? "")
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Comments/Activity placeholder */}
      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold">Comments & Activity</h2>
        <div className="rounded border bg-gray-50 p-4 text-sm text-gray-500">
          (Comments and activity will appear here.)
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Task</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Task title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Task description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) =>
                      setEditForm((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TaskStatusEnum.options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value) =>
                      setEditForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TaskTypeEnum.options.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(value) =>
                      setEditForm((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {TaskPriorityEnum.options.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={editForm.assigneeId}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, assigneeId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users?.data?.data?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">{t("category.title")}</Label>
                <Select
                  value={editForm.category || ""}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("category.title")} />
                  </SelectTrigger>
                  <SelectContent>
                    {TaskCategoryEnum.options.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t("category." + category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t("label.title")}</Label>
                <Popover className="relative">
                  {({ open, close }: { open: boolean; close: () => void }) => (
                    <Fragment>
                      <Popover.Button className="w-full rounded-lg border px-3 py-2 text-left text-sm shadow-inner focus:ring-2 focus:ring-blue-400">
                        {editForm.labels.length > 0
                          ? editForm.labels
                              .map((label) => t("label." + label))
                              .join(", ")
                          : t("label.title")}
                        <i
                          className={`las la-angle-down ml-2 transition-transform ${open ? "rotate-180" : ""}`}
                        ></i>
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition-all ease-out duration-300"
                        enterFrom="opacity-0 translate-y-2 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition-all ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-2 scale-95"
                      >
                        <Popover.Panel className="absolute left-0 z-20 mt-2 w-full max-w-xs rounded-2xl bg-white/90 p-4 shadow-2xl ring-1 ring-blue-100 backdrop-blur-lg">
                          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                            {TaskLabelEnum.options.map((label) => (
                              <label
                                key={label}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={editForm.labels.includes(label)}
                                  onChange={() => {
                                    setEditForm((prev) =>
                                      prev.labels.includes(label)
                                        ? {
                                            ...prev,
                                            labels: prev.labels.filter(
                                              (l) => l !== label,
                                            ),
                                          }
                                        : {
                                            ...prev,
                                            labels: [...prev.labels, label],
                                          },
                                    );
                                  }}
                                />
                                <span>{t("label." + label)}</span>
                              </label>
                            ))}
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button size="sm" variant="outline" onClick={close}>
                              {t("common.apply")}
                            </Button>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </Fragment>
                  )}
                </Popover>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editForm.labels.map((label) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="bg-blue-100 px-2 py-1 text-xs text-blue-700"
                    >
                      {t("label." + label)}
                      <button
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            labels: prev.labels.filter((l) => l !== label),
                          }))
                        }
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !editForm.title.trim()}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold">Delete Task?</h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteMutation.mutateAsync({ id: task.id });
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

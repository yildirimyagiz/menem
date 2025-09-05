"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  Edit,
  Home,
  Image as ImageIcon,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useTranslations } from "use-intl";

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
}

interface TaskPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

export default function TaskDetailModal({
  taskId,
  isOpen,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}: TaskDetailModalProps) {
  const t = useTranslations("tasks");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<TaskPhoto | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [editForm, setEditForm] = useState<EditTaskForm>({
    title: "",
    description: "",
    status: "",
    type: "",
    priority: "",
    dueDate: "",
    assigneeId: "",
    labels: [],
  });
  const [newLabel, setNewLabel] = useState("");

  const {
    data: task,
    isLoading,
    isError,
    error,
    refetch,
  } = api.tasks.getById.useQuery(
    { id: taskId! },
    { enabled: !!taskId && isOpen },
  );

  const { data: users } = api.user.all.useQuery();

  const deleteMutation = api.tasks.delete.useMutation({
    onSuccess: () => {
      onTaskDeleted?.();
      onClose();
    },
  });
  const completeMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      refetch();
      onTaskUpdated?.();
    },
  });
  const updateMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      refetch();
      setShowEditModal(false);
      onTaskUpdated?.();
    },
  });

  // Mock photos data - replace with actual API call
  const [photos, setPhotos] = useState<TaskPhoto[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      caption: "Kitchen maintenance",
      uploadedAt: new Date(),
      uploadedBy: "John Doe",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      caption: "Bathroom repair",
      uploadedAt: new Date(),
      uploadedBy: "Jane Smith",
    },
  ]);

  useEffect(() => {
    if (task && showEditModal) {
      setEditForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "",
        type: task.type || "",
        priority: task.priority || "",
        dueDate:
          task.dueDate && task.dueDate !== null
            ? new Date(task.dueDate).toISOString().split("T")[0]!
            : "",
        assigneeId: task.assignedTo?.id ? String(task.assignedTo.id) : "",
        labels: Array.isArray(task.labels) ? task.labels : [],
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

  const handlePhotoUpload = () => {
    // Mock photo upload - replace with actual implementation
    const newPhoto: TaskPhoto = {
      id: Date.now().toString(),
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      caption: photoCaption,
      uploadedAt: new Date(),
      uploadedBy: "Current User",
    };
    setPhotos([...photos, newPhoto]);
    setPhotoCaption("");
    setShowPhotoUpload(false);
  };

  const handlePhotoDelete = (photoId: string) => {
    setPhotos(photos.filter((photo) => photo.id !== photoId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Task Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-1/4" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center">
            <p className="mb-4 font-semibold text-red-500">
              {error?.message || "Task not found."}
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}

        {/* Task Content */}
        {task && (
          <div className="space-y-6">
            {/* Task Header */}
            <div className="flex items-center gap-2">
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

            {/* Task Badges */}
            <div className="flex flex-wrap gap-2">
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

            {/* Description */}
            <div>
              <h2 className="mb-2 text-lg font-semibold">Description</h2>
              <p className="whitespace-pre-line text-gray-700">
                {task.description || (
                  <span className="text-gray-400">
                    No description provided.
                  </span>
                )}
              </p>
            </div>

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Avatar name={task.assignedTo?.name || undefined} />
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-500">
                    Assignee
                  </h3>
                  <p className="text-gray-800">
                    {task.assignedTo?.name || (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar name={task.createdBy?.name || undefined} />
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-500">
                    Created By
                  </h3>
                  <p className="text-gray-800">
                    {task.createdBy?.name || (
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
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-500">
                  Updated At
                </h3>
                <p className="text-gray-800">
                  {task.updatedAt
                    ? new Date(task.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            {/* Related property/facility */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {task.Property && (
                <div className="flex items-center gap-2">
                  <Home className="text-primary-500 h-5 w-5" />
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-500">
                      Property
                    </h3>
                    <p className="text-gray-800">
                      {task.Property && task.Property.title
                        ? String(task.Property.title ?? "")
                        : ""}
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

            {/* Photos Section */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t("photos.title")}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPhotoUpload(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("photos.addPhoto")}
                </Button>
              </div>

              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <Camera className="mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-2 text-gray-500">{t("photos.noPhotos")}</p>
                  <p className="text-sm text-gray-400">
                    {t("photos.noPhotosDescription")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={photo.url}
                          alt={photo.caption || "Task photo"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          onClick={() => setSelectedPhoto(photo)}
                        />
                      </div>
                      {photo.caption && (
                        <p className="mt-2 truncate text-sm text-gray-600">
                          {photo.caption}
                        </p>
                      )}
                      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handlePhotoDelete(photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments/Activity placeholder */}
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-semibold">
                Comments & Activity
              </h2>
              <div className="rounded border bg-gray-50 p-4 text-sm text-gray-500">
                (Comments and activity will appear here.)
              </div>
            </div>
          </div>
        )}

        {/* Photo Upload Modal */}
        {showPhotoUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{t("photos.uploadPhoto")}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPhotoUpload(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8">
                  <ImageIcon className="mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-2 text-gray-500">
                    {t("photos.uploadInstructions")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t("photos.uploadFormats")}
                  </p>
                  <Button variant="outline" className="mt-4">
                    {t("photos.chooseFile")}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="photoCaption">{t("photos.caption")}</Label>
                  <Input
                    id="photoCaption"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder={t("photos.captionPlaceholder")}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPhotoUpload(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button onClick={handlePhotoUpload}>
                  {t("photos.uploadPhoto")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Viewer Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10 bg-white/10 text-white hover:bg-white/20"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || "Task photo"}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
              {selectedPhoto.caption && (
                <div className="absolute bottom-4 left-4 right-4 rounded bg-black/50 p-4 text-white">
                  <p className="text-sm">{selectedPhoto.caption}</p>
                  <p className="mt-1 text-xs text-gray-300">
                    {t("photos.uploadedBy")} {selectedPhoto.uploadedBy}{" "}
                    {t("photos.on")}{" "}
                    {selectedPhoto.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

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
                      setEditForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
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
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="CLEANING">Cleaning</SelectItem>
                        <SelectItem value="REPAIR">Repair</SelectItem>
                        <SelectItem value="INSPECTION">Inspection</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
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
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
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
                  <Label>Labels</Label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {editForm.labels.map((label) => (
                      <Badge
                        key={label}
                        variant="secondary"
                        className="bg-blue-100 px-2 py-1 text-xs text-blue-700"
                      >
                        {label}
                        <button
                          onClick={() => removeLabel(label)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Add label"
                      onKeyPress={(e) => e.key === "Enter" && addLabel()}
                    />
                    <Button
                      variant="outline"
                      onClick={addLabel}
                      disabled={!newLabel.trim()}
                    >
                      Add
                    </Button>
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
                    if (task) {
                      await deleteMutation.mutateAsync({ id: task.id });
                      setShowDeleteConfirm(false);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

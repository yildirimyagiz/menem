import React, { useState } from "react";
import {
  TaskCategory,
  TaskLabel,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@prisma/client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Save,
  User,
  X,
} from "lucide-react";

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
import { Textarea } from "@reservatior/ui/textarea";

import { api } from "~/trpc/react";

// Update options arrays
const priorityOptions: TaskPriority[] = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
  TaskPriority.URGENT,
];

const statusOptions: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
  TaskStatus.CANCELLED,
];

const typeOptions: TaskType[] = [
  TaskType.PROPERTY_MAINTENANCE,
  TaskType.LISTING_REVIEW,
  TaskType.CLIENT_FOLLOW_UP,
  TaskType.DOCUMENT_PROCESSING,
  TaskType.MARKETING_TASK,
  TaskType.SALES_ACTIVITY,
  TaskType.COMPLIANCE_CHECK,
  TaskType.COMMUNICATION_FOLLOW_UP,
];

const categoryOptions: TaskCategory[] = [
  TaskCategory.CLEANING,
  TaskCategory.DECORATION,
  TaskCategory.SERVICE,
  TaskCategory.REPAIR,
  TaskCategory.MOVING,
];

const labelOptions: TaskLabel[] = [
  TaskLabel.CLEANING,
  TaskLabel.DOOR,
  TaskLabel.WINDOW,
  TaskLabel.ELECTRICITY,
  TaskLabel.PLUMPING,
  TaskLabel.ROOF,
  TaskLabel.GATES,
  TaskLabel.FURNITURE,
  TaskLabel.WARDROBE,
];

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.LOW:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case TaskPriority.MEDIUM:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case TaskPriority.HIGH:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case TaskPriority.URGENT:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    case TaskStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case TaskStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case TaskStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const AddTask: React.FC<{ onClose: () => void; onTaskAdded: () => void }> = ({
  onClose,
  onTaskAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [type, setType] = useState<TaskType>(TaskType.PROPERTY_MAINTENANCE);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.SERVICE);
  const [selectedLabels, setSelectedLabels] = useState<TaskLabel[]>([
    TaskLabel.CLEANING,
  ]);
  const [assignedToId, setAssignedToId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mutation hook for adding a task
  const addTaskMutation = api.tasks.create.useMutation();

  const handleLabelChange = (label: TaskLabel) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const newTask = {
      title,
      description: description || undefined,
      priority,
      status,
      type,
      category,
      labels: selectedLabels,
      assignedToId: assignedToId || undefined,
      propertyId: propertyId || undefined,
    };

    try {
      const result = await addTaskMutation.mutateAsync(newTask);

      setSuccessMessage(
        result ? "Task added successfully!" : "Failed to add task",
      );
      if (result) {
        onTaskAdded();
        resetForm();
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority(TaskPriority.MEDIUM);
    setStatus(TaskStatus.TODO);
    setType(TaskType.PROPERTY_MAINTENANCE);
    setCategory(TaskCategory.SERVICE);
    setSelectedLabels([TaskLabel.CLEANING]);
    setAssignedToId("");
    setPropertyId("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Status Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400"
        >
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{successMessage}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        {/* Task Properties */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TaskPriority)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(option)}>
                        {option}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TaskStatus)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(option)}>{option}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              Task Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as TaskType)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as TaskCategory)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Labels */}
        <div>
          <Label className="text-sm font-medium">Labels</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {labelOptions.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handleLabelChange(label)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedLabels.includes(label)
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {selectedLabels.includes(label) ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="assignedTo" className="text-sm font-medium">
              <User className="mr-1 inline h-4 w-4" />
              Assigned To (ID)
            </Label>
            <Input
              id="assignedTo"
              placeholder="Enter user ID..."
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="property" className="text-sm font-medium">
              <Building className="mr-1 inline h-4 w-4" />
              Property (ID)
            </Label>
            <Input
              id="property"
              placeholder="Enter property ID..."
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Task
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddTask;

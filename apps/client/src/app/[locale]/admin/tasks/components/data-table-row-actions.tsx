// src/app/(account-pages)/tasks/components/data-table-row-actions.tsx
"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { TaskSchema } from "@reservatior/validators"; // Ensure this path is correct

import { api } from "~/trpc/react"; // Import TRPC client

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  labels: { value: string; label: string }[]; // Accept labels as props
}

export function DataTableRowActions<TData>({
  row,
  labels, // Destructure labels from props
}: DataTableRowActionsProps<TData>) {
  // Log the original row data for debugging
  console.log("Row original data:", row.original);

  // Check if row.original is an array and handle accordingly
  const taskData = Array.isArray(row.original) ? row.original[0] : row.original;

  // Ensure taskData is defined and has the expected structure
  if (!taskData || typeof taskData !== "object") {
    console.error("Invalid task data:", taskData);
    return null; // Handle the error appropriately
  }

  // Convert string dates to Date objects and ensure helpId is a string
  const formattedTaskData = {
    ...taskData,
    createdAt: new Date(taskData.createdAt), // Convert to Date object
    updatedAt: new Date(taskData.updatedAt), // Convert to Date object
    deletedAt: taskData.deletedAt ? new Date(taskData.deletedAt) : null, // Handle NULL
    helpId: String(taskData.helpId), // Ensure helpId is a string
  };

  // Log the task data for validation
  console.log("Task data for validation:", formattedTaskData);

  // Validate the task object
  const taskValidation = TaskSchema.safeParse(formattedTaskData); // Use safeParse to avoid throwing an error
  if (!taskValidation.success) {
    console.error("Task validation failed:", taskValidation.error);
    return null; // Handle the error appropriately
  }

  const taskObject = taskValidation.data; // Get the validated task object

  // TRPC mutations
  const deleteTaskMutation = api.tasks.delete.useMutation({
    onSuccess: () => {
      console.log("Task deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting task:", error);
    },
  });

  const updateTaskMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      console.log("Task updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating task:", error);
    },
  });

  const handleDelete = async () => {
    try {
      if (taskObject.id) {
        await deleteTaskMutation.mutateAsync({ id: taskObject.id }); // Call the delete mutation
      } else {
        console.error("Task ID is undefined");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (taskObject.id) {
        await updateTaskMutation.mutateAsync({
          id: taskObject.id,
          title: taskObject.title,
          description: taskObject.description || undefined,
          status: taskObject.status,
          type: taskObject.type,
          priority: taskObject.priority,
        });
      } else {
        console.error("Task ID is undefined");
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleUpdate}>Update</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

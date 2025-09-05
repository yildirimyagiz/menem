"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  EyeIcon,
  FolderIcon,
  HeartIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  TagIcon,
  UserIcon,
  WrenchIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import type {
  Task,
  TaskCategory,
  TaskLabel,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@reservatior/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Checkbox } from "@reservatior/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import {
  getCategoryColor,
  getLabelColor,
  getPriorityColor,
  getStatusColor,
  isTaskDueToday,
  isTaskOverdue,
} from "@reservatior/validators";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

// Update mappings to match our new schema enums
const taskStatusMapping: Record<
  TaskStatus,
  { label: string; icon: any; color: string }
> = {
  TODO: {
    label: "To Do",
    icon: XCircleIcon,
    color: "text-gray-600 bg-gray-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: ClockIcon,
    color: "text-blue-600 bg-blue-100",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircleIcon,
    color: "text-green-600 bg-green-100",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: ExclamationCircleIcon,
    color: "text-red-600 bg-red-100",
  },
};

const taskPriorityMapping: Record<
  TaskPriority,
  { label: string; icon: any; color: string }
> = {
  LOW: {
    label: "Low",
    icon: XCircleIcon,
    color: "text-green-600 bg-green-100",
  },
  MEDIUM: {
    label: "Medium",
    icon: XCircleIcon,
    color: "text-yellow-600 bg-yellow-100",
  },
  HIGH: {
    label: "High",
    icon: ExclamationCircleIcon,
    color: "text-orange-600 bg-orange-100",
  },
  URGENT: {
    label: "Urgent",
    icon: ExclamationCircleIcon,
    color: "text-red-600 bg-red-100",
  },
};

const taskTypeMapping: Record<TaskType, { label: string; icon: any }> = {
  PROPERTY_MAINTENANCE: { label: "Property Maintenance", icon: WrenchIcon },
  LISTING_REVIEW: { label: "Listing Review", icon: EyeIcon },
  CLIENT_FOLLOW_UP: { label: "Client Follow-up", icon: HeartIcon },
  DOCUMENT_PROCESSING: { label: "Document Processing", icon: DocumentTextIcon },
  MARKETING_TASK: { label: "Marketing Task", icon: MegaphoneIcon },
  SALES_ACTIVITY: { label: "Sales Activity", icon: ChartBarIcon },
  COMPLIANCE_CHECK: { label: "Compliance Check", icon: ShieldCheckIcon },
  COMMUNICATION_FOLLOW_UP: {
    label: "Communication Follow-up",
    icon: ChatBubbleLeftRightIcon,
  },
};

const taskCategoryMapping: Record<TaskCategory, { label: string; icon: any }> =
  {
    CLEANING: { label: "Cleaning", icon: WrenchScrewdriverIcon },
    REPAIR: { label: "Repair", icon: WrenchIcon },
    DECORATION: { label: "Decoration", icon: EyeIcon },
    SERVICE: { label: "Service", icon: ShieldCheckIcon },
    MOVING: { label: "Moving", icon: BuildingOfficeIcon },
  };

const taskLabelMapping: Record<TaskLabel, { label: string; icon: any }> = {
  CLEANING: { label: "Cleaning", icon: WrenchScrewdriverIcon },
  DOOR: { label: "Door", icon: BuildingOfficeIcon },
  WINDOW: { label: "Window", icon: EyeIcon },
  ELECTRICITY: { label: "Electricity", icon: ShieldCheckIcon },
  PLUMPING: { label: "Plumbing", icon: WrenchIcon },
  ROOF: { label: "Roof", icon: BuildingOfficeIcon },
  GATES: { label: "Gates", icon: BuildingOfficeIcon },
  FURNITURE: { label: "Furniture", icon: BuildingOfficeIcon },
  WARDROBE: { label: "Wardrobe", icon: BuildingOfficeIcon },
};

// Type guard functions for safer type checking
const isTaskStatus = (value: unknown): value is TaskStatus => {
  return (
    typeof value === "string" &&
    ["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(value)
  );
};

const isTaskPriority = (value: unknown): value is TaskPriority => {
  return (
    typeof value === "string" &&
    ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(value)
  );
};

const isTaskType = (value: unknown): value is TaskType => {
  return (
    typeof value === "string" &&
    [
      "PROPERTY_MAINTENANCE",
      "LISTING_REVIEW",
      "CLIENT_FOLLOW_UP",
      "DOCUMENT_PROCESSING",
      "MARKETING_TASK",
      "SALES_ACTIVITY",
      "COMPLIANCE_CHECK",
      "COMMUNICATION_FOLLOW_UP",
    ].includes(value)
  );
};

const isTaskCategory = (value: unknown): value is TaskCategory => {
  return (
    typeof value === "string" &&
    ["CLEANING", "REPAIR", "DECORATION", "SERVICE", "MOVING"].includes(value)
  );
};

const isTaskLabelArray = (value: unknown): value is TaskLabel[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string" &&
        [
          "CLEANING",
          "DOOR",
          "WINDOW",
          "ELECTRICITY",
          "PLUMPING",
          "ROOF",
          "GATES",
          "FURNITURE",
          "WARDROBE",
        ].includes(item),
    )
  );
};

const isDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const task = row.original;
      const isOverdue = isTaskOverdue(task);
      const isDueToday = isTaskDueToday(task);

      return (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="max-w-[300px] truncate font-medium">
              {row.getValue("title")}
            </span>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
            {isDueToday && !isOverdue && (
              <Badge variant="secondary" className="text-xs">
                Due Today
              </Badge>
            )}
          </div>
          {task.description && (
            <span className="max-w-[300px] truncate text-xs text-muted-foreground">
              {task.description}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusValue = row.getValue("status");
      if (!isTaskStatus(statusValue)) return null;

      const status = taskStatusMapping[statusValue];

      if (!status) return null;

      const IconComponent = status.icon;
      return (
        <Badge className={status.color}>
          <IconComponent className="mr-1 h-3 w-3" />
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value: TaskStatus[]) => {
      const statusValue = row.getValue(id);
      return Boolean(isTaskStatus(statusValue) && value.includes(statusValue));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priorityValue = row.getValue("priority");
      if (!isTaskPriority(priorityValue)) return null;

      const priority = taskPriorityMapping[priorityValue];

      if (!priority) return null;

      const IconComponent = priority.icon;
      return (
        <Badge className={priority.color}>
          <IconComponent className="mr-1 h-3 w-3" />
          {priority.label}
        </Badge>
      );
    },
    filterFn: (row, id, value: TaskPriority[]) => {
      const priorityValue = row.getValue(id);
      return Boolean(
        isTaskPriority(priorityValue) && value.includes(priorityValue),
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const typeValue = row.getValue("type");
      if (!isTaskType(typeValue)) return null;

      const type = taskTypeMapping[typeValue];

      if (!type) return null;

      const IconComponent = type.icon;
      return (
        <div className="flex items-center">
          <IconComponent className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{type.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value: TaskType[]) => {
      const typeValue = row.getValue(id);
      return Boolean(isTaskType(typeValue) && value.includes(typeValue));
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categoryValue = row.getValue("category");

      if (!categoryValue || !isTaskCategory(categoryValue)) {
        return (
          <span className="text-sm text-muted-foreground">No category</span>
        );
      }

      const category = taskCategoryMapping[categoryValue];
      const color = getCategoryColor(categoryValue);

      if (!category) return null;

      const IconComponent = category.icon;
      return (
        <Badge className={color}>
          <IconComponent className="mr-1 h-3 w-3" />
          {category.label}
        </Badge>
      );
    },
    filterFn: (row, id, value: TaskCategory[]) => {
      const categoryValue = row.getValue(id);
      return Boolean(
        categoryValue &&
          isTaskCategory(categoryValue) &&
          value.includes(categoryValue),
      );
    },
  },
  {
    accessorKey: "labels",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Labels" />
    ),
    cell: ({ row }) => {
      const labelsValue = row.getValue("labels");

      if (
        !labelsValue ||
        !isTaskLabelArray(labelsValue) ||
        labelsValue.length === 0
      ) {
        return <span className="text-sm text-muted-foreground">No labels</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {labelsValue.slice(0, 3).map((label: TaskLabel, index: number) => {
            const labelInfo = taskLabelMapping[label];
            const color = getLabelColor(label);

            if (!labelInfo) return null;

            const IconComponent = labelInfo.icon;
            return (
              <Badge key={index} className={`${color} text-xs`}>
                <IconComponent className="mr-1 h-2 w-2" />
                {labelInfo.label}
              </Badge>
            );
          })}
          {labelsValue.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{labelsValue.length - 3} more
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value: TaskLabel[]) => {
      const labelsValue = row.getValue(id);
      if (!labelsValue || !isTaskLabelArray(labelsValue)) return false;
      return value.some((label) => labelsValue.includes(label));
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      const task = row.original;
      const assignee = task.assignedTo;

      return (
        <div className="flex items-center">
          <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {assignee
              ? `${assignee.firstName} ${assignee.lastName}`
              : "Unassigned"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      const task = row.original;
      const creator = task.createdBy;

      return (
        <div className="flex items-center">
          <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {creator ? `${creator.firstName} ${creator.lastName}` : "System"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "propertyId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      const task = row.original;
      const property = task.Property;

      return (
        <div className="flex items-center">
          <BuildingOfficeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {property ? property.title : "No Property"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate");

      if (!dueDate || !isDate(dueDate)) {
        return (
          <span className="text-sm text-muted-foreground">No due date</span>
        );
      }

      const isOverdue = isTaskOverdue(row.original);
      const isDueToday = isTaskDueToday(row.original);

      return (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span
            className={`text-sm ${isOverdue ? "font-medium text-red-600" : ""}`}
          >
            {dueDate.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "completedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => {
      const completedAt = row.getValue("completedAt");

      if (!completedAt || !isDate(completedAt)) {
        return (
          <span className="text-sm text-muted-foreground">Not completed</span>
        );
      }

      return (
        <div className="flex items-center">
          <CheckCircleIcon className="mr-2 h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600">
            {completedAt.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");

      if (!isDate(createdAt)) {
        return (
          <span className="text-sm text-muted-foreground">Invalid date</span>
        );
      }

      return (
        <span className="text-sm text-muted-foreground">
          {createdAt.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    accessorKey: "followers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team" />
    ),
    cell: ({ row }) => {
      const followers = row.getValue("followers");

      // Handle JsonValue type - could be string, array, or null
      let followerData: { name: string; image?: string }[] = [];
      if (Array.isArray(followers)) {
        followerData = followers.map((follower: any) => ({
          name:
            follower.name ||
            follower.firstName + " " + follower.lastName ||
            "Unknown",
          image: follower.image || follower.avatar,
        }));
      } else if (typeof followers === "string") {
        try {
          const parsed = JSON.parse(followers);
          followerData = Array.isArray(parsed)
            ? parsed.map((follower: any) => ({
                name:
                  follower.name ||
                  follower.firstName + " " + follower.lastName ||
                  "Unknown",
                image: follower.image || follower.avatar,
              }))
            : [];
        } catch {
          followerData = [];
        }
      }

      if (followerData.length === 0) {
        return <span className="text-sm text-muted-foreground">No team</span>;
      }

      const maxVisible = 3;
      const visibleFollowers = followerData.slice(0, maxVisible);
      const extraCount = followerData.length - maxVisible;

      return (
        <div className="flex items-center -space-x-2">
          {visibleFollowers.map((follower, idx) => (
            <Avatar
              key={follower.name + idx}
              className="h-6 w-6 border-2 border-white bg-gradient-to-br from-blue-200 to-blue-400 text-xs font-bold shadow-sm dark:border-slate-900"
            >
              {follower.image ? (
                <AvatarImage src={follower.image} alt={follower.name} />
              ) : (
                <AvatarFallback>
                  {follower.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
          ))}
          {extraCount > 0 && (
            <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
              +{extraCount}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        labels={Object.keys(taskTypeMapping).map((type) => ({
          value: type as keyof typeof taskTypeMapping,
          label: taskTypeMapping[type as keyof typeof taskTypeMapping].label,
        }))}
      />
    ),
  },
];

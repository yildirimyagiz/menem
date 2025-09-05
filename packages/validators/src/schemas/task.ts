import { z } from "zod";

// Define TaskPriority, TaskStatus, and TaskType locally since imports are not working
const TaskPriority = {
  LOW: "LOW" as const,
  MEDIUM: "MEDIUM" as const,
  HIGH: "HIGH" as const,
  URGENT: "URGENT" as const,
} as const;

const TaskStatus = {
  TODO: "TODO" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  COMPLETED: "COMPLETED" as const,
  CANCELLED: "CANCELLED" as const,
} as const;

const TaskType = {
  PROPERTY_MAINTENANCE: "PROPERTY_MAINTENANCE" as const,
  LISTING_REVIEW: "LISTING_REVIEW" as const,
  CLIENT_FOLLOW_UP: "CLIENT_FOLLOW_UP" as const,
  DOCUMENT_PROCESSING: "DOCUMENT_PROCESSING" as const,
  MARKETING_TASK: "MARKETING_TASK" as const,
  SALES_ACTIVITY: "SALES_ACTIVITY" as const,
  COMPLIANCE_CHECK: "COMPLIANCE_CHECK" as const,
  COMMUNICATION_FOLLOW_UP: "COMMUNICATION_FOLLOW_UP" as const,
} as const;

type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];
type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];
type TaskType = typeof TaskType[keyof typeof TaskType];

// ============================================================================
// HELPER FUNCTION: Accept UUID or CUID for Task IDs
// ============================================================================
export const isValidTaskId = (id: string): boolean => {
  // Accept UUID or CUID (cuid2 or cuid)
  return (
    z.string().uuid().safeParse(id).success || /^c[a-z0-9]{24}$/i.test(id) // CUID v2 regex (24 chars after 'c')
  );
};

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

export const TASK_CONSTANTS = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  PAGINATION: {
    MIN_PAGE: 1,
    MIN_PAGE_SIZE: 1,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE_SIZE: 10,
  },
  DATE_RANGES: {
    MAX_DUE_DATE_DAYS: 365, // 1 year from now
    MIN_DUE_DATE_DAYS: 0, // Today
  },
} as const;

// ============================================================================
// ENUM DEFINITIONS
// ============================================================================

// Enums matching Prisma schema with better documentation
export const TaskStatusEnum = z.nativeEnum(TaskStatus);

export const TaskPriorityEnum = z.nativeEnum(TaskPriority);

export const TaskTypeEnum = z.nativeEnum(TaskType);

export const TaskCategoryEnum = z.enum([
  "CLEANING",
  "REPAIR",
  "DECORATION",
  "SERVICE",
  "MOVING",
]);

export const TaskLabelEnum = z.enum([
  "CLEANING",
  "DOOR",
  "WINDOW",
  "ELECTRICITY",
  "PLUMPING",
  "ROOF",
  "GATES",
  "FURNITURE",
  "WARDROBE",
]);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validates that a due date is not in the past
 */
const validateDueDate = (date: Date | null | undefined) => {
  if (!date) return true;
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to start of day
  return date >= now;
};

/**
 * Validates that completed date is not before creation date
 */
const validateCompletedDate = (
  completedAt: Date | null | undefined,
  createdAt: Date,
) => {
  if (!completedAt) return true;
  return completedAt >= createdAt;
};

/**
 * Validates that at least one assignee is provided for high/urgent priority tasks
 */
const validateAssigneeForHighPriority = (
  priority: TaskPriority,
  assignedToId: string | null | undefined,
  agentId: string | null | undefined,
  agencyId: string | null | undefined,
) => {
  if (priority === "HIGH" || priority === "URGENT") {
    return !!(assignedToId ?? agentId ?? agencyId);
  }
  return true;
};

// ============================================================================
// BASE SCHEMAS
// ============================================================================

// Base task fields that are common across all task schemas
const TaskBaseSchema = z.object({
  title: z
    .string()
    .min(TASK_CONSTANTS.TITLE.MIN_LENGTH, "Title is required")
    .max(
      TASK_CONSTANTS.TITLE.MAX_LENGTH,
      `Title must be at most ${TASK_CONSTANTS.TITLE.MAX_LENGTH} characters`,
    ),
  description: z
    .string()
    .max(
      TASK_CONSTANTS.DESCRIPTION.MAX_LENGTH,
      `Description must be at most ${TASK_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`,
    )
    .nullable()
    .optional(),
  status: z.nativeEnum(TaskStatus),
  type: z.nativeEnum(TaskType),
  priority: z.nativeEnum(TaskPriority),
  category: TaskCategoryEnum.optional(),
  labels: z.array(TaskLabelEnum).default([]),
});

// ============================================================================
// MAIN SCHEMAS
// ============================================================================

// Complete Task Schema with all fields and relations
export const TaskSchema = TaskBaseSchema.extend({
  id: z.string().refine(isValidTaskId, "Invalid task ID format"),
  createdById: z
    .string()
    .refine(isValidTaskId, "Invalid creator ID format")
    .nullable(),
  assignedToId: z
    .string()
    .refine(isValidTaskId, "Invalid assignee ID format")
    .nullable(),
  propertyId: z
    .string()
    .refine(isValidTaskId, "Invalid property ID format")
    .nullable(),
  agentId: z
    .string()
    .refine(isValidTaskId, "Invalid agent ID format")
    .nullable(),
  agencyId: z
    .string()
    .refine(isValidTaskId, "Invalid agency ID format")
    .nullable(),
  facilityId: z
    .string()
    .refine(isValidTaskId, "Invalid facility ID format")
    .nullable(),
  includedServiceId: z
    .string()
    .refine(isValidTaskId, "Invalid included service ID format")
    .nullable(),
  extraChargeId: z
    .string()
    .refine(isValidTaskId, "Invalid extra charge ID format")
    .nullable(),
  dueDate: z
    .date()
    .nullable()
    .refine(validateDueDate, "Due date cannot be in the past"),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  followers: z
    .array(z.string().refine(isValidTaskId, "Invalid follower ID format"))
    .nullable(),
  category: TaskCategoryEnum.nullable(),
  labels: z.array(TaskLabelEnum).nullable(),

  // Relations (optional for flexibility)
  Analytics: z.array(z.any()).optional(),
  Mention: z.array(z.any()).optional(),
  Agency: z.any().optional(),
  Agent: z.any().optional(),
  createdBy: z.any().optional(),
  assignedTo: z.any().optional(),
  Property: z.any().optional(),
  Facility: z.any().optional(),
  IncludedService: z.any().optional(),
  ExtraCharge: z.any().optional(),
  comments: z.any().optional(),
  attachments: z.any().optional(),
})
  .refine((data) => validateCompletedDate(data.completedAt, data.createdAt), {
    message: "Completion date cannot be before creation date",
    path: ["completedAt"],
  })
  .refine(
    (data) =>
      validateAssigneeForHighPriority(
        data.priority,
        data.assignedToId,
        data.agentId,
        data.agencyId,
      ),
    {
      message: "High/Urgent priority tasks must have an assignee",
      path: ["priority"],
    },
  );

// Create Task Schema with sensible defaults
export const CreateTaskSchema = TaskBaseSchema.extend({
  title: z
    .string()
    .min(TASK_CONSTANTS.TITLE.MIN_LENGTH, "Title is required")
    .max(
      TASK_CONSTANTS.TITLE.MAX_LENGTH,
      `Title must be at most ${TASK_CONSTANTS.TITLE.MAX_LENGTH} characters`,
    ),
  description: z
    .string()
    .max(
      TASK_CONSTANTS.DESCRIPTION.MAX_LENGTH,
      `Description must be at most ${TASK_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`,
    )
    .optional(),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  type: z.nativeEnum(TaskType),
  priority: z.nativeEnum(TaskPriority).default("MEDIUM"),
  category: TaskCategoryEnum.optional(),
  labels: z.array(TaskLabelEnum).default([]),

  // Optional IDs
  createdById: z
    .string()
    .refine(isValidTaskId, "Invalid creator ID format")
    .optional(),
  assignedToId: z
    .string()
    .refine(isValidTaskId, "Invalid assignee ID format")
    .optional(),
  propertyId: z
    .string()
    .refine(isValidTaskId, "Invalid property ID format")
    .optional(),
  agentId: z
    .string()
    .refine(isValidTaskId, "Invalid agent ID format")
    .optional(),
  agencyId: z
    .string()
    .refine(isValidTaskId, "Invalid agency ID format")
    .optional(),
  facilityId: z
    .string()
    .refine(isValidTaskId, "Invalid facility ID format")
    .optional(),
  includedServiceId: z
    .string()
    .refine(isValidTaskId, "Invalid included service ID format")
    .optional(),
  extraChargeId: z
    .string()
    .refine(isValidTaskId, "Invalid extra charge ID format")
    .optional(),

  // Dates
  dueDate: z
    .date()
    .refine(validateDueDate, "Due date cannot be in the past")
    .optional(),
  completedAt: z.date().optional(),

  // Arrays and relations
  followers: z
    .array(z.string().refine(isValidTaskId, "Invalid follower ID format"))
    .default([]),
  comments: z.any().optional(),
  attachments: z.any().optional(),
}).refine(
  (data) =>
    validateAssigneeForHighPriority(
      data.priority,
      data.assignedToId,
      data.agentId,
      data.agencyId,
    ),
  {
    message: "High/Urgent priority tasks must have an assignee",
    path: ["priority"],
  },
);

// Update Task Schema - all fields optional except ID
export const UpdateTaskSchema = z.object({
  id: z.string().refine(isValidTaskId, "Invalid task ID format"),
  title: z
    .string()
    .min(TASK_CONSTANTS.TITLE.MIN_LENGTH, "Title is required")
    .max(
      TASK_CONSTANTS.TITLE.MAX_LENGTH,
      `Title must be at most ${TASK_CONSTANTS.TITLE.MAX_LENGTH} characters`,
    )
    .optional(),
  description: z
    .string()
    .max(
      TASK_CONSTANTS.DESCRIPTION.MAX_LENGTH,
      `Description must be at most ${TASK_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`,
    )
    .optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  type: z.nativeEnum(TaskType).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: TaskCategoryEnum.optional(),
  labels: z.array(TaskLabelEnum).optional(),

  // Optional IDs
  createdById: z
    .string()
    .refine(isValidTaskId, "Invalid creator ID format")
    .optional(),
  assignedToId: z
    .string()
    .refine(isValidTaskId, "Invalid assignee ID format")
    .optional(),
  propertyId: z
    .string()
    .refine(isValidTaskId, "Invalid property ID format")
    .optional(),
  agentId: z
    .string()
    .refine(isValidTaskId, "Invalid agent ID format")
    .optional(),
  agencyId: z
    .string()
    .refine(isValidTaskId, "Invalid agency ID format")
    .optional(),
  facilityId: z
    .string()
    .refine(isValidTaskId, "Invalid facility ID format")
    .optional(),
  includedServiceId: z
    .string()
    .refine(isValidTaskId, "Invalid included service ID format")
    .optional(),
  extraChargeId: z
    .string()
    .refine(isValidTaskId, "Invalid extra charge ID format")
    .optional(),

  // Dates
  dueDate: z
    .date()
    .refine(validateDueDate, "Due date cannot be in the past")
    .optional(),
  completedAt: z.date().optional(),

  // Arrays and relations
  followers: z
    .array(z.string().refine(isValidTaskId, "Invalid follower ID format"))
    .optional(),
  comments: z.any().optional(),
  attachments: z.any().optional(),
});

// ============================================================================
// FILTER & QUERY SCHEMAS
// ============================================================================

// Enhanced Task Filter Schema with better validation
export const TaskFilterSchema = z
  .object({
    // Text search
    title: z.string().optional(),

    // Enums
    status: z.nativeEnum(TaskStatus).optional(),
    type: z.nativeEnum(TaskType).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    category: TaskCategoryEnum.optional(),
    labels: z.array(TaskLabelEnum).optional(),

    // IDs
    createdById: z
      .string()
      .refine(isValidTaskId, "Invalid creator ID format")
      .optional(),
    assignedToId: z
      .string()
      .refine(isValidTaskId, "Invalid assignee ID format")
      .optional(),
    propertyId: z
      .string()
      .refine(isValidTaskId, "Invalid property ID format")
      .optional(),
    agentId: z
      .string()
      .refine(isValidTaskId, "Invalid agent ID format")
      .optional(),
    agencyId: z
      .string()
      .refine(isValidTaskId, "Invalid agency ID format")
      .optional(),
    facilityId: z
      .string()
      .refine(isValidTaskId, "Invalid facility ID format")
      .optional(),
    includedServiceId: z
      .string()
      .refine(isValidTaskId, "Invalid included service ID format")
      .optional(),
    extraChargeId: z
      .string()
      .refine(isValidTaskId, "Invalid extra charge ID format")
      .optional(),
    followedByUserId: z
      .string()
      .refine(isValidTaskId, "Invalid follower ID format")
      .optional(),

    // Date ranges
    createdAtFrom: z.date().optional(),
    createdAtTo: z.date().optional(),
    dueDateFrom: z.date().optional(),
    dueDateTo: z.date().optional(),
    completedAtFrom: z.date().optional(),
    completedAtTo: z.date().optional(),

    // Sorting
    sortBy: z
      .enum([
        "createdAt",
        "updatedAt",
        "dueDate",
        "completedAt",
        "title",
        "status",
        "priority",
        "type",
        "category",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),

    // Pagination
    page: z
      .number()
      .int("Page must be an integer")
      .min(
        TASK_CONSTANTS.PAGINATION.MIN_PAGE,
        `Page must be at least ${TASK_CONSTANTS.PAGINATION.MIN_PAGE}`,
      )
      .default(TASK_CONSTANTS.PAGINATION.MIN_PAGE),
    pageSize: z
      .number()
      .int("Page size must be an integer")
      .min(
        TASK_CONSTANTS.PAGINATION.MIN_PAGE_SIZE,
        `Page size must be at least ${TASK_CONSTANTS.PAGINATION.MIN_PAGE_SIZE}`,
      )
      .max(
        TASK_CONSTANTS.PAGINATION.MAX_PAGE_SIZE,
        `Page size must be at most ${TASK_CONSTANTS.PAGINATION.MAX_PAGE_SIZE}`,
      )
      .default(TASK_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE),
  })
  .refine(
    (data) => {
      if (data.createdAtFrom && data.createdAtTo) {
        return data.createdAtFrom <= data.createdAtTo;
      }
      return true;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["createdAtFrom"],
    },
  )
  .refine(
    (data) => {
      if (data.dueDateFrom && data.dueDateTo) {
        return data.dueDateFrom <= data.dueDateTo;
      }
      return true;
    },
    {
      message: "Due date start must be before or equal to due date end",
      path: ["dueDateFrom"],
    },
  )
  .refine(
    (data) => {
      if (data.completedAtFrom && data.completedAtTo) {
        return data.completedAtFrom <= data.completedAtTo;
      }
      return true;
    },
    {
      message:
        "Completion date start must be before or equal to completion date end",
      path: ["completedAtFrom"],
    },
  );

// ============================================================================
// SPECIALIZED SCHEMAS
// ============================================================================

// Follow/Unfollow Task Schema
export const FollowTaskSchema = z.object({
  taskId: z.string().refine(isValidTaskId, "Invalid task ID format"),
  userId: z.string().refine(isValidTaskId, "Invalid user ID format"),
});

// Bulk operations schema
export const BulkTaskOperationSchema = z.object({
  taskIds: z
    .array(z.string().refine(isValidTaskId, "Invalid task ID format"))
    .min(1, "At least one task ID is required"),
  operation: z.enum(["delete", "update_status", "assign", "change_priority"]),
  data: z.record(z.any()).optional(), // Additional data for the operation
});

// Task statistics schema
export const TaskStatsSchema = z.object({
  total: z.number().int().min(0),
  byStatus: z.record(z.number().int().min(0)),
  byPriority: z.record(z.number().int().min(0)),
  byType: z.record(z.number().int().min(0)),
  byCategory: z.record(z.number().int().min(0)),
  byLabel: z.record(z.number().int().min(0)),
  overdue: z.number().int().min(0),
  dueToday: z.number().int().min(0),
  dueThisWeek: z.number().int().min(0),
});

// ============================================================================
// TYPE INFERENCES
// ============================================================================

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskFilterInput = z.infer<typeof TaskFilterSchema>;
export type FollowTaskInput = z.infer<typeof FollowTaskSchema>;
export type BulkTaskOperationInput = z.infer<typeof BulkTaskOperationSchema>;
export type TaskStats = z.infer<typeof TaskStatsSchema>;

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type TaskCategory = z.infer<typeof TaskCategoryEnum>;
export type TaskLabel = z.infer<typeof TaskLabelEnum>;

// ============================================================================
// HELPER FUNCTIONS FOR VALIDATION
// ============================================================================

/**
 * Validates a task title
 */
export const isValidTaskTitle = (title: string): boolean => {
  return z
    .string()
    .min(TASK_CONSTANTS.TITLE.MIN_LENGTH)
    .max(TASK_CONSTANTS.TITLE.MAX_LENGTH)
    .safeParse(title).success;
};

/**
 * Checks if a task is overdueTaskStatus
 */
export const isTaskOverdue = (task: Task): boolean => {
  if (
    !task.dueDate ||
    task.status === "COMPLETED" ||
    task.status === "CANCELLED"
  ) {
    return false;
  }
  return new Date() > task.dueDate;
};

/**
 * Checks if a task is due today
 */
export const isTaskDueToday = (task: Task): boolean => {
  if (!task.dueDate) return false;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  return (
    today.getFullYear() === dueDate.getFullYear() &&
    today.getMonth() === dueDate.getMonth() &&
    today.getDate() === dueDate.getDate()
  );
};

/**
 * Gets the priority color for UI display
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case "LOW":
      return "text-green-600 bg-green-100";
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-100";
    case "HIGH":
      return "text-orange-600 bg-orange-100";
    case "URGENT":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

/**
 * Gets the status color for UI display
 */
export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case "TODO":
      return "text-gray-600 bg-gray-100";
    case "IN_PROGRESS":
      return "text-blue-600 bg-blue-100";
    case "COMPLETED":
      return "text-green-600 bg-green-100";
    case "CANCELLED":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

/**
 * Gets the category color for UI display
 */
export const getCategoryColor = (category: TaskCategory): string => {
  switch (category) {
    case "CLEANING":
      return "text-blue-600 bg-blue-100";
    case "REPAIR":
      return "text-orange-600 bg-orange-100";
    case "DECORATION":
      return "text-purple-600 bg-purple-100";
    case "SERVICE":
      return "text-green-600 bg-green-100";
    case "MOVING":
      return "text-indigo-600 bg-indigo-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

/**
 * Gets the label color for UI display
 */
export const getLabelColor = (label: TaskLabel): string => {
  switch (label) {
    case "CLEANING":
      return "text-blue-600 bg-blue-100";
    case "DOOR":
      return "text-brown-600 bg-brown-100";
    case "WINDOW":
      return "text-cyan-600 bg-cyan-100";
    case "ELECTRICITY":
      return "text-yellow-600 bg-yellow-100";
    case "PLUMPING":
      return "text-blue-600 bg-blue-100";
    case "ROOF":
      return "text-gray-600 bg-gray-100";
    case "GATES":
      return "text-gray-600 bg-gray-100";
    case "FURNITURE":
      return "text-amber-600 bg-amber-100";
    case "WARDROBE":
      return "text-amber-600 bg-amber-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

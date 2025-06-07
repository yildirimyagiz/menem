import { z } from "zod";

// Permission Schema
export const PermissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  User: z.array(z.any()).optional(),
});

// Create Permission Schema
export const CreatePermissionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

// Update Permission Schema
export const UpdatePermissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

// Permission Filter Schema
export const PermissionFilterSchema = z.object({
  name: z.string().optional(),
  sortBy: z.enum(["name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Permission = z.infer<typeof PermissionSchema>;
export type CreatePermissionInput = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>;
export type PermissionFilterInput = z.infer<typeof PermissionFilterSchema>;

import type { Permission, Prisma, User } from "@reservatior/db";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreatePermissionSchema,
  PermissionFilterSchema,
  UpdatePermissionSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  getPaginationParams,
  paginationInputSchema,
} from "../helpers/pagination";
import { protectedProcedure } from "../trpc";

type PermissionWithUsers = Prisma.PermissionGetPayload<{
  include: { User: true };
}>;

type SanitizedPermission = Omit<Permission, "User"> & {
  users: { id: string; name: string | null }[];
};

// Utility to sanitize permission data
function sanitizePermission(
  permission: PermissionWithUsers | null,
): SanitizedPermission | null {
  if (!permission) return null;
  const { User, ...rest } = permission;
  return {
    ...rest,
    users: (User || []).map((user: User) => ({
      id: user.id,
      name: user.name,
    })),
  };
}

export const permissionRouter = {
  list: protectedProcedure
    .input(
      z
        .object({
          ...paginationInputSchema.shape,
          ...PermissionFilterSchema.omit({
            page: true,
            pageSize: true,
          }).shape,
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const where = {
        ...(input?.name && {
          name: {
            contains: input.name,
            mode: "insensitive" as Prisma.QueryMode,
          },
        }),
      };

      const [permissions, total] = await Promise.all([
        ctx.db.permission.findMany({
          where,
          orderBy: input?.sortBy
            ? { [input.sortBy]: input.sortOrder ?? "asc" }
            : { name: "asc" },
          skip,
          take,
          include: {
            User: true,
          },
        }),
        ctx.db.permission.count({ where }),
      ]);

      return {
        data: permissions.map(sanitizePermission),
        page,
        limit,
        total,
      };
    }),

  byId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const permission = await ctx.db.permission.findFirst({
        where: { id: input },
        include: {
          User: true,
        },
      });

      if (!permission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Permission not found",
        });
      }

      return sanitizePermission(permission);
    }),

  create: protectedProcedure
    .input(CreatePermissionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const permission = await ctx.db.permission.create({
          data: {
            ...input,
            id: crypto.randomUUID(),
          },
          include: {
            User: true,
          },
        });
        return sanitizePermission(permission);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Create permission failed:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create permission: ${error.message}`,
            cause: error,
          });
        }
        console.error("Create permission failed with unknown error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while creating the permission",
        });
      }
    }),

  update: protectedProcedure
    .input(UpdatePermissionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      try {
        const permission = await ctx.db.permission.update({
          where: { id },
          data,
          include: {
            User: true,
          },
        });
        return sanitizePermission(permission);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Permission not found for update.",
          });
        }
        console.error("Update permission failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during update.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const permission = await ctx.db.permission.delete({
          where: { id: input },
          include: {
            User: true,
          },
        });
        return sanitizePermission(permission);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Permission not found or already deleted.",
          });
        }
        console.error("Delete permission failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during delete.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  assignToUser: protectedProcedure
    .input(
      z.object({
        permissionId: z.string().uuid(),
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            Permission: {
              connect: { id: input.permissionId },
            },
          },
        });
        return { success: true };
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User or Permission not found for assignment.",
          });
        }
        console.error("Assign permission to user failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during assignment.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  removeFromUser: protectedProcedure
    .input(
      z.object({
        permissionId: z.string().uuid(),
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            Permission: {
              disconnect: { id: input.permissionId },
            },
          },
        });
        return { success: true };
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User or Permission not found for removal.",
          });
        }
        console.error("Remove permission from user failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during removal.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),
} satisfies TRPCRouterRecord;

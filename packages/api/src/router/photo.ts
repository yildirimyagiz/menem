import { randomUUID } from "crypto";
import type { PhotoType, Prisma } from "@prisma/client";
import {
  CreatePhotoSchema,
  PhotoFilterSchema,
  UpdatePhotoSchema,
} from "@reservatior/validators";
import { z } from "zod";

import {
  getPaginationParams,
  paginationInputSchema,
} from "../helpers/pagination";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const photoInclude = {
  Agency: true,
  Agent: true,

  Post: true,
  Property: true,
  User: true,
} as const satisfies Prisma.PhotoInclude;

type PhotoWithIncludes = Prisma.PhotoGetPayload<{
  include: typeof photoInclude;
}>;

export interface SanitizedPhoto {
  id: string;
  url: string;
  type: PhotoType;
  caption: string | null;
  featured: boolean;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
  dominantColor: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  userId: string | null;
  agencyId: string | null;
  propertyId: string | null;
  agentId: string | null;
  postId: string | null;
  agency: { id: string; name: string } | null;
  agent: { id: string; name: string } | null;

  post: { id: string; title: string } | null;
  property: { id: string; title: string } | null;
  user: { id: string; name: string | null } | null;
}

function sanitizePhoto(photo: PhotoWithIncludes): SanitizedPhoto {
  const { Agency, Agent, Post, Property, User, ...rest } = photo;

  return {
    ...rest,
    agency: Agency ? { id: Agency.id, name: Agency.name } : null,
    agent: Agent ? { id: Agent.id, name: Agent.name } : null,
    post: Post ? { id: Post.id, title: Post.title } : null,
    property: Property ? { id: Property.id, title: Property.title } : null,
    user: User ? { id: User.id, name: User.name } : null,
    id: "",
    url: "",
    type: "COVER",
    caption: null,
    featured: false,
    width: null,
    height: null,
    fileSize: null,
    mimeType: null,
    dominantColor: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,

    userId: null,
    agencyId: null,
    propertyId: null,
    agentId: null,
    postId: null,
  };
}

export const photoRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          ...paginationInputSchema.shape,
          ...PhotoFilterSchema.omit({
            page: true,
            pageSize: true,
          }).shape,
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const where: Prisma.PhotoWhereInput = {
        ...(input?.type && { type: input.type }),
        ...(input?.featured !== undefined && { featured: input.featured }),

        ...(input?.userId && { userId: input.userId }),
        ...(input?.agencyId && { agencyId: input.agencyId }),
        ...(input?.propertyId && { propertyId: input.propertyId }),
        ...(input?.agentId && { agentId: input.agentId }),
        ...(input?.postId && { postId: input.postId }),
        ...(input?.createdAtFrom && {
          createdAt: { gte: input.createdAtFrom },
        }),
        ...(input?.createdAtTo && {
          createdAt: { lte: input.createdAtTo },
        }),
        ...(input?.deletedAt !== undefined && {
          deletedAt: input.deletedAt,
        }),
      };

      const [photos, total] = await Promise.all([
        ctx.db.photo.findMany({
          where,
          orderBy: {
            [input?.sortBy ?? "createdAt"]: input?.sortOrder ?? "desc",
          },
          skip,
          take,
          include: photoInclude,
        }),
        ctx.db.photo.count({ where }),
      ]);

      return {
        data: photos.map(sanitizePhoto),
        page,
        limit,
        total,
      };
    }),

  byId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const photo = await ctx.db.photo.findUnique({
          where: { id: input },
          include: photoInclude,
        });
        if (!photo) {
          throw new Error("Photo not found");
        }
        return sanitizePhoto(photo);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch photo: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching the photo");
      }
    }),

  create: protectedProcedure
    .input(CreatePhotoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const createData: Prisma.PhotoUncheckedCreateInput = {
          id: randomUUID(),
          url: input.url,
          type: input.type,
          caption: input.caption ?? null,
          featured: input.featured,
          width: input.width ?? null,
          height: input.height ?? null,
          fileSize: input.fileSize ?? null,
          mimeType: input.mimeType ?? null,
          dominantColor: input.dominantColor ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),

          userId: input.userId ?? null,
          agencyId: input.agencyId ?? null,
          propertyId: input.propertyId ?? null,
          agentId: input.agentId ?? null,
          postId: input.postId ?? null,
        };

        const photo = await ctx.db.photo.create({
          data: createData,
          include: photoInclude,
        });
        return sanitizePhoto(photo);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2002"
        ) {
          throw new Error("Photo with this URL already exists");
        }
        throw error;
      }
    }),

  update: protectedProcedure
    .input(UpdatePhotoSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateInput } = input;
      try {
        const updateData: Prisma.PhotoUncheckedUpdateInput = {
          ...(updateInput.url && { url: updateInput.url }),
          ...(updateInput.type && { type: updateInput.type }),
          caption: updateInput.caption ?? undefined,
          ...(updateInput.featured !== undefined && {
            featured: updateInput.featured,
          }),
          width: updateInput.width ?? undefined,
          height: updateInput.height ?? undefined,
          fileSize: updateInput.fileSize ?? undefined,
          mimeType: updateInput.mimeType ?? undefined,
          dominantColor: updateInput.dominantColor ?? undefined,
          deletedAt: updateInput.deletedAt ?? undefined,
          updatedAt: new Date(),
        };

        const photo = await ctx.db.photo.update({
          where: { id },
          data: updateData,
          include: photoInclude,
        });
        return sanitizePhoto(photo);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new Error("Photo not found");
        }
        throw error;
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const photo = await ctx.db.photo.delete({
          where: { id: input },
          include: photoInclude,
        });
        return sanitizePhoto(photo);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new Error("Photo not found or already deleted");
        }
        throw error;
      }
    }),

  softDelete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const photo = await ctx.db.photo.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: photoInclude,
        });
        return sanitizePhoto(photo);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new Error("Photo not found");
        }
        throw error;
      }
    }),
});

import { randomUUID } from "crypto";
import type {
  BuildingClass,
  Prisma,
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreatePropertySchema,
  PropertyFilterSchema,
  UpdatePropertySchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Type for property with includes
export type PropertyWithIncludes = Prisma.PropertyGetPayload<{
  include: {
    Agent: true;
    Agency: true;
    Owner: true;
    Photo: true;

    Review: true;
    Location: true;
    PricingRules: true;
    Task: true;
    Analytics: true;
    ComplianceRecord: true;
    Expense: true;
    Mention: true;
    Hashtag: true;
  };
}>;

const sanitizeProperty = (property: PropertyWithIncludes | null) => {
  if (!property) return null;
  let coordinates: { lat: number; lng: number } | null = null;
  if (
    property.Location?.coordinates && // Optional chaining
    typeof property.Location.coordinates === "object" && // Check if it's an object
    property.Location.coordinates !== null // Check for null
  ) {
    // More type-safe access to lat/lng, assuming it's Prisma.JsonValue which can be an object
    const coords = property.Location.coordinates as unknown as {
      lat?: unknown;
      lng?: unknown;
    };
    if (typeof coords.lat === "number" && typeof coords.lng === "number") {
      coordinates = { lat: coords.lat, lng: coords.lng };
    } else {
      // Attempt to parse if it's a stringified JSON, though ideally it's stored as JSONB object
      // This is a fallback and might indicate a data consistency issue.
      // console.warn(`Property ${property.id} Location.coordinates is not a direct lat/lng object:`, property.Location.coordinates);
      // If it's common for coordinates to be stringified JSON, add parsing logic here.
    }
  }
  return {
    ...property,
    coordinates,
    address: property.Location?.address ?? null,
    city: property.Location?.city ?? null,
    country: property.Location?.country ?? null,
    postalCode: property.Location?.postalCode ?? null,
    features: Array.isArray(property.features) ? property.features : [],
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    Agent: property.Agent ?? null,
    Agency: property.Agency ?? null,
    Owner: property.Owner ?? null,
    Photo: property.Photo ?? [],

    Review: property.Review ?? [],
    PricingRules: property.PricingRules ?? [],
    Task: property.Task ?? [],
    Analytics: property.Analytics ?? [],
    ComplianceRecord: property.ComplianceRecord ?? [],
    Expense: property.Expense ?? [],
    Mention: property.Mention ?? [],
    Hashtag: property.Hashtag ?? [],
    Location: property.Location ?? null,
  };
};

export const propertyRouter = {
  // Existing property operations
  all: protectedProcedure
    .input(PropertyFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      // Generate a cache key based on filters and pagination
      const filterKey = JSON.stringify({ ...input });
      const cacheKey = `properties:${page}:${limit}:${filterKey}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.PropertyWhereInput = {
          title: input?.title
            ? { contains: input.title, mode: "insensitive" }
            : undefined,
          category: input?.category
            ? (input.category as PropertyCategory)
            : undefined,
          propertyStatus: input?.status
            ? (input.status as PropertyStatus)
            : undefined,
          ownerId: input?.ownerId ?? undefined,
          agencyId: input?.agencyId ?? undefined,
          condition: input?.condition
            ? (input.condition as PropertyCondition)
            : undefined,
          createdAt:
            input?.createdAtFrom || input?.createdAtTo
              ? {
                  gte: input?.createdAtFrom ?? undefined,
                  lte: input?.createdAtTo ?? undefined,
                }
              : undefined,
          deletedAt: null,
        };
        const [properties, total] = await Promise.all([
          ctx.db.property.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agent: true,
              Agency: true,
              Owner: true,
              Photo: true,
              Review: true,
              PricingRules: true,
              Task: true,
              Analytics: true,
              ComplianceRecord: true,
              Expense: true,
              Mention: true,
              Hashtag: true,
              Location: true,
            },
          }),
          ctx.db.property.count({ where }),
        ]);
        return {
          data: properties.map((property) => sanitizeProperty(property)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(
      z.object({
        id: z.union([z.string(), z.number()]).transform((val) => String(val)),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // Add logging to debug the issue
        // console.log(
        //   `Fetching property with ID: ${input.id} (type: ${typeof input.id})`,
        // );

        // Try to find all properties with similar IDs to help debug
        // const allProperties = await ctx.db.property.findMany({
        //   take: 5,
        //   select: { id: true },
        //   orderBy: { createdAt: "desc" },
        // });
        // console.log(
        //   `Available property IDs for reference:`,
        //   allProperties.map((p) => p.id),
        // );

        // First check if the property exists at all, including deleted ones
        // const propertyExists = await ctx.db.property.findUnique({
        //   where: { id: input.id },
        //   select: { id: true, deletedAt: true },
        // });

        // if (!propertyExists) {
        //   // console.log(
        //   //   `Property with ID ${input.id} does not exist in the database`,
        //   // );
        //   throw new TRPCError({ code: "NOT_FOUND", message: `Property with ID ${input.id} not found` });
        // }

        // if (propertyExists.deletedAt) {
        //   // console.log(
        //   //   `Property with ID ${input.id} exists but was deleted on ${propertyExists.deletedAt}`,
        //   // );
        //   throw new TRPCError({ code: "GONE", message: `Property with ID ${input.id} has been deleted` });
        // }

        // Now fetch the full property with all includes
        const property = await ctx.db.property.findUnique({
          // Use findUnique for ID-based lookups
          where: {
            id: input.id,
            deletedAt: null,
          },
          include: {
            Agent: true,
            Agency: true,
            Owner: true,
            Photo: true,
            Review: true,
            PricingRules: true,
            Task: true,
            Analytics: true,
            ComplianceRecord: true,
            Expense: true,
            Mention: true,
            Hashtag: true,
            Location: true,
          },
        });

        if (!property) {
          // console.log(
          //   `Property with ID ${input.id} not found (or was deleted)`,
          // );
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Property with ID ${input.id} not found or has been deleted`,
          });
        }

        return sanitizeProperty(property);
      } catch (error) {
        // console.error(
        //   `Error fetching property: ${error instanceof Error ? error.message : "Unknown error"}`,
        // );
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch property.",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(CreatePropertySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const property = await ctx.db.property.create({
          data: {
            id: randomUUID(),
            title: input.title ?? "",
            description: input.description ?? "",
            size: input.size ?? 0,
            ownerId: input.ownerId ?? null,
            agencyId: input.agencyId ?? null,
            category: input.category as PropertyCategory,
            propertyType: input.propertyType as PropertyType,
            propertyStatus: input.propertyStatus as PropertyStatus,
            condition: input.condition!,
            features: input.features
              ? { set: input.features as PropertyFeatures[] }
              : { set: [] },
            amenities: input.amenities
              ? { set: input.amenities as unknown as PropertyAmenities[] }
              : { set: [] },
            updatedAt: new Date(),
            locationId: input.locationId ?? null,
          },
          include: {
            Agent: true,
            Agency: true,
            Owner: true,
            Photo: true,

            Review: true,
            PricingRules: true,
            Task: true,
            Analytics: true,
            ComplianceRecord: true,
            Expense: true,
            Mention: true,
            Hashtag: true,
            Location: true,
          },
        });
        return sanitizeProperty(property);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // console.error("Create property failed:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create property: ${err.message}`,
            cause: err,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while creating the property.",
        });
      }
    }),

  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const favorites = await ctx.db.favorite.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        property: true,
      },
    });
    return favorites.map((favorite) => favorite.property);
  }),

  update: protectedProcedure
    .input(UpdatePropertySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updateData: Prisma.PropertyUpdateInput = {
        category: data.category!,
        propertyType: data.propertyType!,
        propertyStatus: data.status!,
        condition: data.condition!,
        buildingClass:
          data.buildingClass !== undefined
            ? { set: data.buildingClass as BuildingClass }
            : undefined,
        features: data.features
          ? { set: data.features as PropertyFeatures[] }
          : undefined,
        amenities: data.amenities
          ? { set: data.amenities as unknown as PropertyAmenities[] }
          : undefined,
        updatedAt: new Date(),
      };
      if (data.ownerId) {
        updateData.Owner = { connect: { id: data.ownerId } };
      }
      if (data.agencyId) {
        updateData.Agency = { connect: { id: data.agencyId } };
      }
      if (data.locationId) {
        updateData.Location = { connect: { id: data.locationId } };
      }
      const property = await ctx.db.property.update({
        where: { id },
        data: updateData,
        include: {
          Agent: true,
          Agency: true,
          Owner: true,
          Photo: true,

          Review: true,
          PricingRules: true,
          Task: true,
          Analytics: true,
          ComplianceRecord: true,
          Expense: true,
          Mention: true,
          Hashtag: true,
          Location: true,
        },
      });
      return sanitizeProperty(property);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.property.update({
          where: { id: input },
          data: { deletedAt: new Date() },
        });
        return { success: true };
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          (error as { code?: string }).code === "P2025" // More robust type check
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found or already deleted.",
          });
        }
        // console.error("Delete property failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during soft delete.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),
  // --- ML/Analytics routes ---
  getAnalysis: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Use analyticsRouter.byId for property analytics
      const analytics = await ctx.db.analytics.findFirst({
        where: { propertyId: input.propertyId, deletedAt: null },
      });
      if (!analytics) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No analysis found for property or it has been deleted.",
        });
      }
      // Use the same sanitizer as analyticsRouter
      // (import or inline if needed)
      return {
        ...analytics,
        // Add any custom transformation if needed
      };
    }),

  analyzePhotos: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        coverImage: z.string(),
        additionalImages: z.array(z.string()).optional(),
        data: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if a PHOTO_ANALYSIS record already exists for this property.
        const existingAnalysis = await ctx.db.analytics.findFirst({
          where: {
            propertyId: input.propertyId,
            type: "ML_PROPERTY_SCORE",
            deletedAt: null,
          },
        });

        if (existingAnalysis) {
          // If an analysis exists, update it with new data.
          const updatedAnalysis = await ctx.db.analytics.update({
            where: { id: existingAnalysis.id },
            data: {
              data: {
                ...(existingAnalysis.data &&
                typeof existingAnalysis.data === "object"
                  ? existingAnalysis.data
                  : {}),
                ...input.data,
              },
            },
          });
          return { success: true, analytics: updatedAnalysis };
        } else {
          // If no analysis exists, create a new one.
          const newAnalysis = await ctx.db.analytics.create({
            data: {
              id: randomUUID(),
              entityId: input.propertyId,
              entityType: "property",
              type: "ML_PROPERTY_SCORE",
              data: input.data ?? {},
              propertyId: input.propertyId,
            },
          });
          return { success: true, analytics: newAnalysis };
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze photos",
          cause: error,
        });
      }
    }),
  updatePhotoAnalysisData: protectedProcedure
    .input(
      z.object({ propertyId: z.string(), data: z.record(z.string(), z.any()) }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use analyticsRouter.update for property analytics
      const analytics = await ctx.db.analytics.findFirst({
        where: { propertyId: input.propertyId },
      });
      if (!analytics)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No analytics record found for property.",
        });
      const updated = await ctx.db.analytics.update({
        where: { id: analytics.id },
        data: { data: input.data },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          Reservation: true,
          Task: true,
          User: true,
        },
      });
      return {
        success: true,
        updatedSettings: updated.data,
      };
    }),
  // --- Helper routes for frontend ---
  totalCount: protectedProcedure
    .input(PropertyFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      // Reuse the same filter as in the 'all' query
      const where: Prisma.PropertyWhereInput = {
        title: input?.title
          ? { contains: input.title, mode: "insensitive" }
          : undefined,
        category: input?.category
          ? (input.category as PropertyCategory)
          : undefined,
        propertyStatus: input?.status
          ? (input.status as PropertyStatus)
          : undefined,
        ownerId: input?.ownerId ?? undefined,
        agencyId: input?.agencyId ?? undefined,
        condition: input?.condition
          ? (input.condition as PropertyCondition)
          : undefined,
        createdAt:
          input?.createdAtFrom || input?.createdAtTo
            ? {
                gte: input?.createdAtFrom ?? undefined,
                lte: input?.createdAtTo ?? undefined,
              }
            : undefined,
        deletedAt: null,
      };
      const total = await ctx.db.property.count({ where });
      return { total };
    }),

  uniqueCategories: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.property.findMany({
      where: { deletedAt: null },
      select: { category: true },
      distinct: ["category"],
    });
    return categories.map((c) => c.category);
  }),

  uniqueStatuses: protectedProcedure.query(async ({ ctx }) => {
    const statuses = await ctx.db.property.findMany({
      where: { deletedAt: null },
      select: { propertyStatus: true },
      distinct: ["propertyStatus"],
    });
    return statuses.map((s) => s.propertyStatus);
  }),

  uniqueTypes: protectedProcedure.query(async ({ ctx }) => {
    const types = await ctx.db.property.findMany({
      where: { deletedAt: null },
      select: { propertyType: true },
      distinct: ["propertyType"],
    });
    return types.map((t) => t.propertyType);
  }),

} satisfies TRPCRouterRecord;

export type PropertyRouter = typeof propertyRouter;

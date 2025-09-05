import type {
  Prisma,
  PropertyCategory,
  PropertyCondition,
  PropertyStatus,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";

import {
  CreatePropertySchema,
  PropertyFilterSchema,
  UpdatePropertySchema,
} from "@reservatior/validators";

import { getPaginationParams } from "../helpers/pagination";
import {
  agencyProcedure,
  createTRPCRouter,
  propertyFilteredProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

const propertyInclude = {
  Photo: true,
  Agency: true,
  Owner: true,
  Agent: true,
  Location: true,
  Review: {
    include: {
      User: {
        select: { id: true, name: true, image: true },
      },
    },
  },
  PricingRules: {
    include: {
      currency: true,
    },
  },
  Facility: true,
  Favorite: true,
} as const;

const propertyWithDetailsInclude = {
  ...propertyInclude,
  Expense: true,
  ComplianceRecord: true,
  Mortgage: true,
  Increase: true,
  Photo: true,
  PricingRules: true,
  Review: true,
  Task: true,
  Hashtag: true,
  Facility: true,
  IncludedService: true,
  ExtraCharge: true,
  Availability: true,
  TaxRecord: true,
  Favorite: true,
  Currency: true,
  Discount: true,
  Offer: true,
  Reservation: true,
  Tenant: true,
  Guest: true,
  Contract: true,
  Report: true,
};

type PropertyWithIncludes = Prisma.PropertyGetPayload<{
  include: typeof propertyInclude;
}>;

type PropertyWithDetails = Prisma.PropertyGetPayload<{
  include: typeof propertyWithDetailsInclude;
}>;

type PropertyFilterInput = z.infer<typeof PropertyFilterSchema> | undefined;

const sanitizeProperty = <
  T extends {
    Favorite: { userId: string }[];
    Review: { rating: number }[];
    Location?: {
      address?: string | null;
      city?: string | null;
      country?: string | null;
      postalCode?: string | null;
    } | null;
  },
>(
  property: T | null,
  userId?: string,
) => {
  if (!property) return null;

  const { Favorite, ...restOfProperty } = property;

  return {
    ...restOfProperty,
    isFavorite: userId ? Favorite.some((fav) => fav.userId === userId) : false,
    averageRating:
      property.Review.length > 0
        ? property.Review.reduce((acc, review) => acc + review.rating, 0) /
          property.Review.length
        : 0,
    address: property.Location?.address ?? null,
    city: property.Location?.city ?? null,
    country: property.Location?.country ?? null,
    postalCode: property.Location?.postalCode ?? null,
  };
};

const photoSubrouter = createTRPCRouter({
  getAnalysis: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const analytics = await ctx.db.analytics.findFirst({
        where: { propertyId: input.propertyId, deletedAt: null },
      });
      if (!analytics) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No analysis found for property or it has been deleted.",
        });
      }
      return {
        ...analytics,
      };
    }),

  analyzePhotos: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        coverImage: z.string(),
        additionalImages: z.array(z.string()).optional(),
        data: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Import ML client dynamically to avoid circular deps
      const { analyzePropertyPhotoML } = await import('../ml/mlClient');
      try {
        // Assume coverImage is a URL or accessible path
        const property = await ctx.db.property.findUnique({
          where: { id: input.propertyId },
          include: { Location: true },
        });
        if (!property) throw new TRPCError({ code: 'NOT_FOUND', message: 'Property not found' });

        // Compose location data if available
        const locationData = property.Location ? {
          address: property.Location.address,
          city: property.Location.city,
          country: property.Location.country,
          postalCode: property.Location.postalCode,
          coordinates: property.Location.coordinates,
        } : undefined;

        // Call ML API for cover image
        let mlResult = null;
        try {
          mlResult = await analyzePropertyPhotoML({
            imageUrl: input.coverImage,
            location: locationData,
          });
        } catch (mlErr: unknown) {
          // Optionally log ML errors but proceed, with safe error extraction
          let message = "ML analysis failed";
          if (mlErr instanceof Error) {
            message = mlErr.message;
          } else if (typeof mlErr === "string") {
            message = mlErr;
          } else {
            try {
              message = JSON.stringify(mlErr);
            } catch {
              // keep default message
            }
          }
          mlResult = { success: false, error: message };
        }

        // Compose analytics data
        const analyticsData = {
          ml: mlResult,
          ...input.data,
        };

        // Store or update analytics
        const existingAnalysis = await ctx.db.analytics.findFirst({
          where: {
            propertyId: input.propertyId,
            type: "ML_PROPERTY_SCORE",
            deletedAt: null,
          },
        });
        if (existingAnalysis) {
          const updatedAnalysis = await ctx.db.analytics.update({
            where: { id: existingAnalysis.id },
            data: {
              data: {
                ...(existingAnalysis.data && typeof existingAnalysis.data === "object"
                  ? existingAnalysis.data
                  : {}),
                ...analyticsData,
              } as Prisma.InputJsonValue,
            },
          });
          return { success: true, analytics: updatedAnalysis };
        } else {
          const newAnalysis = await ctx.db.analytics.create({
            data: {
              id: randomUUID(),
              entityId: input.propertyId,
              entityType: "property",
              type: "ML_PROPERTY_SCORE",
              data: analyticsData as Prisma.InputJsonValue,
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
      z.object({ propertyId: z.string(), data: z.record(z.string(), z.unknown()) }),
    )
    .mutation(async ({ ctx, input }) => {
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
        data: { data: input.data as Prisma.InputJsonValue },
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
});

// Enum label maps
const PropertyAmenitiesLabels: Record<string, string> = {
  POOL: "Swimming Pool",
  GYM: "Fitness Center",
  PARKING: "Parking Lot",
  WIFI: "WiFi",
  AIR_CONDITIONING: "Air Conditioning",
  HEATING: "Heating",
  DISHWASHER: "Dishwasher",
  WASHER_DRYER: "Washer & Dryer",
  FIREPLACE: "Fireplace",
  GARDEN: "Garden",
  TERRACE: "Terrace",
  GARAGE: "Garage",
  SECURITY_SYSTEM: "Security System",
  ELEVATOR: "Elevator",
  CONCIERGE: "Concierge Service",
  PET_FRIENDLY: "Pet Friendly",
  SMOKING_ALLOWED: "Smoking Allowed",
  WHEELCHAIR_ACCESSIBLE: "Wheelchair Accessible",
};

const PropertyFeaturesLabels: Record<string, string> = {
  BALCONY: "Balcony",
  ELEVATOR: "Elevator",
  HARDWOOD_FLOORS: "Hardwood Floors",
  CARPETED_FLOORS: "Carpeted Floors",
  TILE_FLOORS: "Tile Floors",
  WALK_IN_CLOSET: "Walk-in Closet",
  BUILT_IN_WARDROBE: "Built-in Wardrobe",
  PANTRY: "Pantry",
  WINE_CELLAR: "Wine Cellar",
  HOME_OFFICE: "Home Office",
  GAME_ROOM: "Game Room",
  THEATER_ROOM: "Theater Room",
  WET_BAR: "Wet Bar",
  WINE_FRIDGE: "Wine Fridge",
  SMART_HOME: "Smart Home Features",
  SOLAR_PANELS: "Solar Panels",
  ROOF_DECK: "Roof Deck",
  STORAGE_UNIT: "Storage Unit",
  BICYCLE_STORAGE: "Bicycle Storage",
  DOORMAN: "Doorman",
};

function mapEnumArrayToLabels<T extends string>(
  values: T[],
  labelMap: Record<T, string>,
) {
  return values.map((value) => ({
    value,
    label: labelMap[value] || value,
  }));
}

// Helper function to build property filter
const buildPropertyFilter = (
  input: PropertyFilterInput,
): Prisma.PropertyWhereInput => {
  const propertyType = input?.propertyType;
  const propertyStatus = input?.propertyStatus;
  const listingType = input?.listingType;
  const priceMin = input?.priceMin ?? input?.minPrice;
  const priceMax = input?.priceMax ?? input?.maxPrice;
  const locationId = input?.locationId;

  return {
    deletedAt: null,
    isActive: true,
    title: input?.title
      ? { contains: input.title, mode: "insensitive" }
      : undefined,
    propertyStatus: propertyStatus,
    propertyType: propertyType
      ? Array.isArray(propertyType)
        ? { in: propertyType }
        : propertyType
      : undefined,
    category: input?.category,
    condition: input?.condition,
    ownerId: input?.ownerId,
    agencyId: input?.agencyId,
    locationId: locationId,
    listingType: listingType,
    size:
      input?.size &&
      (input.size.gte !== undefined || input.size.lte !== undefined)
        ? { gte: input.size.gte, lte: input.size.lte }
        : undefined,
    bedrooms:
      input?.bedrooms &&
      (input.bedrooms.gte !== undefined || input.bedrooms.lte !== undefined)
        ? { gte: input.bedrooms.gte, lte: input.bedrooms.lte }
        : undefined,
    bathrooms:
      input?.bathrooms &&
      (input.bathrooms.gte !== undefined ||
        input.bathrooms.lte !== undefined)
        ? { gte: input.bathrooms.gte, lte: input.bathrooms.lte }
        : undefined,
    yearBuilt:
      input?.yearBuilt &&
      (input.yearBuilt.gte !== undefined ||
        input.yearBuilt.lte !== undefined)
        ? { gte: input.yearBuilt.gte, lte: input.yearBuilt.lte }
        : undefined,
    features: input?.features ? { hasSome: input.features } : undefined,
    amenities: input?.amenities ? { hasSome: input.amenities } : undefined,
    marketValue:
      priceMin !== undefined || priceMax !== undefined
        ? {
            gte: priceMin,
            lte: priceMax,
          }
        : undefined,
    createdAt:
      input?.createdAtFrom || input?.createdAtTo
        ? {
            gte: input.createdAtFrom,
            lte: input.createdAtTo,
          }
        : undefined,
  };
};

// Public property router for unauthenticated users
export const publicPropertyRouter = createTRPCRouter({
  // Public single property by ID
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const property = await ctx.db.property.findUnique({
          where: { id, deletedAt: null },
          include: propertyInclude,
        });

        if (!property) {
          throw new TRPCError({ code: "NOT_FOUND", message: `Property with ID ${id} not found` });
        }

        // Sanitize for public
        const sanitized = sanitizeProperty(property);
        // Add coordinates passthrough for map convenience
        return {
          ...sanitized,
          coordinates: property.Location?.coordinates ?? null,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch property" });
      }
    }),
  // Public properties - accessible to all users (no authentication required)
  all: publicProcedure
    .input(PropertyFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      console.log(
        "[publicProperty.all] Starting public property fetch with input:",
        JSON.stringify(input, null, 2),
      );

      const { skip, take } = getPaginationParams(input ?? {});

      const where = buildPropertyFilter(input);

      // Sorting
      let orderBy: Prisma.PropertyOrderByWithRelationInput = {
        createdAt: "desc",
      };
      const sortOrderAgency = input?.sortOrder ?? "desc";
      if (input?.sortBy === "price") {
        orderBy = { marketValue: sortOrderAgency };
      } else if (input?.sortBy) {
        orderBy = { [input.sortBy]: sortOrderAgency };
      }

      console.log("[publicProperty.all] Executing database query...");
      let properties: PropertyWithIncludes[] = [];
      let total = 0;

      try {
        [properties, total] = await ctx.db.$transaction([
          ctx.db.property.findMany({
            where,
            orderBy,
            skip,
            take,
            include: propertyInclude,
          }),
          ctx.db.property.count({ where }),
        ]);

        console.log(
          `[publicProperty.all] Found ${properties.length} properties out of ${total} total`,
        );

        // Sanitize properties for public access (no user-specific data)
        const sanitizedProperties = properties.map(
          (p: PropertyWithIncludes) => {
            const { Favorite: _Favorite, ...restOfProperty } = p;
            return {
              ...restOfProperty,
              isFavorite: false, // Public users can't have favorites
              averageRating:
                p.Review.length > 0
                  ? p.Review.reduce((acc, review) => acc + review.rating, 0) /
                    p.Review.length
                  : 0,
              address: p.Location?.address ?? null,
              city: p.Location?.city ?? null,
              country: p.Location?.country ?? null,
              postalCode: p.Location?.postalCode ?? null,
              coordinates: p.Location?.coordinates ?? null,
            };
          },
        );

        return { data: sanitizedProperties, total };
      } catch (error) {
        console.error("[publicProperty.all] Database error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch properties",
        });
      }
    }),

  // Public featured properties
  featured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(24).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 4;
      const properties = await ctx.db.property.findMany({
        where: {
          featured: true,
          isActive: true,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: propertyInclude,
      });

      // Sanitize properties for public access
      const sanitizedProperties = properties.map((p: PropertyWithIncludes) => {
        const { Favorite: _Favorite, ...restOfProperty } = p;
        return {
          ...restOfProperty,
          isFavorite: false, // Public users can't have favorites
          averageRating:
            p.Review.length > 0
              ? p.Review.reduce((acc, review) => acc + review.rating, 0) /
                p.Review.length
              : 0,
          address: p.Location?.address ?? null,
          city: p.Location?.city ?? null,
          country: p.Location?.country ?? null,
          postalCode: p.Location?.postalCode ?? null,
          coordinates: p.Location?.coordinates ?? null,
        };
      });

      return { data: sanitizedProperties };
    }),
});

export const propertyRouter = createTRPCRouter({
  photo: photoSubrouter,

  // --- Featured properties endpoint ---
  featured: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(24).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 4;
      const properties = await ctx.db.property.findMany({
        where: {
          featured: true,
          isActive: true,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: propertyInclude,
      });
      const sanitizedProperties = properties.map((p: PropertyWithIncludes) =>
        sanitizeProperty(p, ctx.session.user.id),
      );
      return { data: sanitizedProperties };
    }),

  // Public properties - accessible to all authenticated users
  all: protectedProcedure
    .input(PropertyFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      console.log(
        "[property.all] Starting property fetch with input:",
        JSON.stringify(input, null, 2),
      );

      const { skip, take } = getPaginationParams(input ?? {});

      const where = buildPropertyFilter(input);

      // Sorting
      let orderBy: Prisma.PropertyOrderByWithRelationInput = {
        createdAt: "desc",
      };
      if (input?.sortBy === "price") {
        orderBy = { marketValue: input.sortOrder ?? "desc" };
      } else if (input?.sortBy) {
        orderBy = { [input.sortBy]: input.sortOrder ?? "desc" };
      }

      console.log("[property.all] Executing database query...");
      let properties: PropertyWithIncludes[] = [];
      let total = 0;

      try {
        [properties, total] = await ctx.db.$transaction([
          ctx.db.property.findMany({
            where,
            include: propertyInclude,
            skip,
            take,
            orderBy,
          }),
          ctx.db.property.count({ where }),
        ]);
        console.log(
          `[property.all] Query successful. Found ${total} total properties, returning ${properties.length} properties.`,
        );
      } catch (error) {
        console.error("[property.all] Database query failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch properties",
        });
      }

      const sanitizedProperties = properties.map((p: PropertyWithIncludes) =>
        sanitizeProperty(p, ctx.session.user.id),
      );

      return {
        data: sanitizedProperties,
        total,
      };
    }),

  // Agency/Agent filtered properties - only shows properties the user has access to
  myProperties: propertyFilteredProcedure
    .input(PropertyFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take } = getPaginationParams(input ?? {});
      const userId = ctx.session?.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }
      const userRole = ctx.userRole;
      const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;
      const agentId = (ctx as unknown as { agentId?: string }).agentId;
      const canAccessAllProperties = ctx.canAccessAllProperties;

      // Build authorization filter
      const authFilter: Prisma.PropertyWhereInput = { deletedAt: null };

      if (!canAccessAllProperties) {
        // Filter based on user relationships
        const userRelationships: Prisma.PropertyWhereInput[] = [];

        // Properties owned by the user
        userRelationships.push({ ownerId: userId });

        // Properties managed by the user's agency
        if (agencyId) {
          userRelationships.push({ agencyId });
        }

        // Properties assigned to the user as an agent
        if (agentId) {
          userRelationships.push({ agentId });
        }

        // If user has no relationships, only show their own properties
        if (userRelationships.length > 0) {
          authFilter.OR = userRelationships;
        } else {
          authFilter.ownerId = userId;
        }
      }

      // Build search filter
      const searchFilter: Prisma.PropertyWhereInput = {
        title: input?.title
          ? { contains: input.title, mode: "insensitive" }
          : undefined,
        propertyStatus: input?.propertyStatus,
        propertyType: input?.propertyType,
        category: input?.category,
        condition: input?.condition,
        listingType: input?.listingType,
        size: input?.size,
        bedrooms: input?.bedrooms,
        bathrooms: input?.bathrooms,
        yearBuilt: input?.yearBuilt,
        features: input?.features ? { hasSome: input.features } : undefined,
        amenities: input?.amenities ? { hasSome: input.amenities } : undefined,
        marketValue:
          input?.priceMin ||
          input?.priceMax ||
          input?.minPrice ||
          input?.maxPrice
            ? {
                gte: input.priceMin ?? input.minPrice,
                lte: input.priceMax ?? input.maxPrice,
              }
            : undefined,
        createdAt:
          input?.createdAtFrom || input?.createdAtTo
            ? {
                gte: input.createdAtFrom,
                lte: input.createdAtTo,
              }
            : undefined,
      };

      // Combine filters
      const where: Prisma.PropertyWhereInput = {
        ...authFilter,
        ...searchFilter,
      };

      // Remove undefined values
      Object.keys(where).forEach((key) => {
        if (where[key as keyof typeof where] === undefined) {
          delete where[key as keyof typeof where];
        }
      });

      // Sorting
      let orderBy: Prisma.PropertyOrderByWithRelationInput = {
        createdAt: "desc",
      };
      const sortOrder = input?.sortOrder ?? "desc";
      if (input?.sortBy === "price") {
        orderBy = { marketValue: sortOrder };
      } else if (input?.sortBy) {
        orderBy = { [input.sortBy]: sortOrder };
      }

      try {
        const [properties, total] = await ctx.db.$transaction([
          ctx.db.property.findMany({
            where,
            include: propertyWithDetailsInclude,
            skip,
            take,
            orderBy,
          }),
          ctx.db.property.count({ where }),
        ]);

        const sanitizedProperties = properties.map((p: PropertyWithDetails) =>
          sanitizeProperty(p, userId),
        );

        return {
          data: sanitizedProperties,
          total,
          userRole,
          agencyId,
          agentId,
        };
      } catch (error) {
        console.error("[property.myProperties] Database query failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch properties",
        });
      }
    }),

  // Agency properties - shows all properties for an agency (admin/agency access only)
  agencyProperties: agencyProcedure
    .input(
      z
        .object({
          ...PropertyFilterSchema.shape,
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take } = getPaginationParams(input ?? {});
      const userRole = ctx.userRole;
      const userAgencyId = (ctx as unknown as { agencyId?: string }).agencyId;

      // Check if user can access the requested agency
      if (
        userRole !== "SUPER_ADMIN" &&
        userRole !== "ADMIN" &&
        userAgencyId !== input?.agencyId
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access properties from your own agency",
        });
      }

      const priceMin = input?.priceMin ?? input?.minPrice;
      const priceMax = input?.priceMax ?? input?.maxPrice;
      const where: Prisma.PropertyWhereInput = {
        deletedAt: null,
        agencyId: input?.agencyId,
        title: input?.title
          ? { contains: input.title, mode: "insensitive" }
          : undefined,
        propertyStatus: input?.propertyStatus,
        propertyType: input?.propertyType,
        category: input?.category,
        condition: input?.condition,
        listingType: input?.listingType,
        size: input?.size,
        bedrooms: input?.bedrooms,
        bathrooms: input?.bathrooms,
        yearBuilt: input?.yearBuilt,
        features: input?.features ? { hasSome: input.features } : undefined,
        amenities: input?.amenities ? { hasSome: input.amenities } : undefined,
        marketValue:
          priceMin !== undefined || priceMax !== undefined
            ? {
                gte: priceMin,
                lte: priceMax,
              }
            : undefined,
        createdAt:
          input?.createdAtFrom || input?.createdAtTo
            ? {
                gte: input.createdAtFrom,
                lte: input.createdAtTo,
              }
            : undefined,
      };

      // Remove undefined values
      Object.keys(where).forEach((key) => {
        if (where[key as keyof typeof where] === undefined) {
          delete where[key as keyof typeof where];
        }
      });

      // Sorting
      let orderBy: Prisma.PropertyOrderByWithRelationInput = {
        createdAt: "desc",
      };
      if (input?.sortBy === "price") {
        orderBy = { marketValue: input.sortOrder ?? "desc" };
      } else if (input?.sortBy) {
        orderBy = { [input.sortBy]: input.sortOrder ?? "desc" };
      }

      try {
        const [properties, total] = await ctx.db.$transaction([
          ctx.db.property.findMany({
            where,
            include: propertyWithDetailsInclude,
            skip,
            take,
            orderBy,
          }),
          ctx.db.property.count({ where }),
        ]);

        const sanitizedProperties = properties.map((p: PropertyWithDetails) =>
          sanitizeProperty(p, ctx.session?.user.id),
        );

        return {
          data: sanitizedProperties,
          total,
          agencyId: input?.agencyId,
        };
      } catch (error) {
        console.error(
          "[property.agencyProperties] Database query failed:",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch agency properties",
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const property = await ctx.db.property.findUnique({
        where: { id, deletedAt: null },
        include: propertyWithDetailsInclude,
      });

      if (!property) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Property with ID ${id} not found.`,
        });
      }

      // Check if user has access to this property
      const userRole = ctx.session.user.role ?? "USER";
      const userAgencyId = (ctx.session.user as unknown as { agencyId?: string }).agencyId;
      const canAccess =
        userRole === "SUPER_ADMIN" ||
        userRole === "ADMIN" ||
        property.ownerId === userId ||
        property.agentId === userId ||
        property.agencyId === userAgencyId;

      if (!canAccess && !property.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this property.",
        });
      }

      // Map amenities and features to labels
      const amenitiesWithLabels = mapEnumArrayToLabels(
        property.amenities,
        PropertyAmenitiesLabels,
      );
      const featuresWithLabels = mapEnumArrayToLabels(
        property.features,
        PropertyFeaturesLabels,
      );

      const nearbyProperties = await ctx.db.property.findMany({
        where: {
          Location: { city: property.Location?.city },
          id: { not: id },
          deletedAt: null,
          isActive: true,
        },
        take: 5,
        include: {
          Photo: true,
          Location: true,
          PricingRules: { include: { currency: true } },
          Review: true,
        },
      });

      return {
        ...sanitizeProperty(property, userId),
        amenitiesWithLabels,
        featuresWithLabels,
        Facility: property.Facility ?? null,
        locationAmenities: property.locationAmenities,
        facilityAmenities: property.Facility?.facilityAmenities ?? [],
        nearbyProperties: nearbyProperties.map((p) => {
          const { Review, Location, PricingRules, Photo, ...rest } = p;
          return {
            ...rest,
            address: Location?.address ?? null,
            city: Location?.city ?? null,
            averageRating:
              Review.length > 0
                ? Review.reduce((acc, r) => acc + r.rating, 0) / Review.length
                : 0,
            price: PricingRules[0]?.basePrice ?? null,
            currency: PricingRules[0]?.currency?.code ?? "USD",
            Photo,
          };
        }),
      };
    }),

  create: propertyFilteredProcedure
    .input(CreatePropertySchema)
    .mutation(async ({ ctx, input }) => {
      const { Location, photos, PricingRules: _PricingRules, ...rest } = input;
      const userId = ctx.session?.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }
      const userRole = ctx.userRole;
      const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;

      // Set ownership based on user role
      const ownerId = userId;
      let propertyAgencyId = agencyId;

      // If user is an agent, they can create properties for their agency
      if (userRole === "AGENT" || userRole === "AGENT_ADMIN") {
        if (!agencyId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Agents must be associated with an agency to create properties",
          });
        }
        propertyAgencyId = agencyId;
      }

      const propertyData: Prisma.PropertyCreateInput = {
        ...rest,
        id: randomUUID(),
        Owner: {
          connect: { id: ownerId },
        },
        Agency: propertyAgencyId
          ? { connect: { id: propertyAgencyId } }
          : undefined,
        Agent: rest.agentId ? { connect: { id: rest.agentId } } : undefined,
        Location: Location ? { create: Location } : undefined,
        Photo: photos
          ? { create: photos.map((url: string) => ({ url })) }
          : undefined,
      };

      const newProperty = await ctx.db.property.create({ data: propertyData });

      return newProperty;
    }),

  update: propertyFilteredProcedure
    .input(UpdatePropertySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, Location, photos, buildingClass, PricingRules: _PricingRules, ...rest } =
        input;
      const userId = ctx.session?.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }
      const _userRole = ctx.userRole;
      const canAccessAllProperties = ctx.canAccessAllProperties;
      const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;

      // Check if user can access this property
      const property = await ctx.db.property.findUnique({
        where: { id },
        include: { Owner: true, Agency: true, Agent: true },
      });

      if (!property) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found",
        });
      }

      const canEdit =
        canAccessAllProperties ||
        property.ownerId === userId ||
        property.agentId === userId ||
        property.agencyId === agencyId;

      if (!canEdit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to edit this property",
        });
      }

      const propertyData: Prisma.PropertyUpdateInput = {
        ...rest,
        buildingClass: buildingClass ?? undefined,
        Location: Location ? { update: Location } : undefined,
        Photo: photos
          ? {
              deleteMany: {},
              create: photos.map((url: string) => ({ url })),
            }
          : undefined,
      };

      const updatedProperty = await ctx.db.property.update({
        where: { id },
        data: propertyData,
      });

      return updatedProperty;
    }),

  delete: propertyFilteredProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const userId = ctx.session?.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }
      const _userRole = ctx.userRole;
      const canAccessAllProperties = ctx.canAccessAllProperties;
      const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;

      // Check if user can delete this property
      const property = await ctx.db.property.findUnique({
        where: { id },
        select: { ownerId: true, agentId: true, agencyId: true },
      });

      if (!property) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found",
        });
      }

      const canDelete =
        canAccessAllProperties ||
        property.ownerId === userId ||
        property.agentId === userId ||
        property.agencyId === agencyId;

      if (!canDelete) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this property",
        });
      }

      await ctx.db.property.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { success: true };
    }),

  toggleFavorite: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { propertyId } = input;
      const userId = ctx.session.user.id;

      const existingFavorite = await ctx.db.favorite.findUnique({
        where: { userId_propertyId: { userId, propertyId } },
      });

      if (existingFavorite) {
        await ctx.db.favorite.delete({
          where: { id: existingFavorite.id },
        });
        return { favorited: false };
      } else {
        await ctx.db.favorite.create({
          data: {
            userId,
            propertyId,
          },
        });
        return { favorited: true };
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

  // --- Helper routes for frontend ---
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
        propertyStatus: input?.propertyStatus
          ? (input.propertyStatus as PropertyStatus)
          : undefined,
        ownerId: input?.ownerId ?? undefined,
        agencyId: input?.agencyId ?? undefined,
        condition: input?.condition
          ? (input.condition as PropertyCondition)
          : undefined,
        createdAt:
          input?.createdAtFrom || input?.createdAtTo
            ? {
                gte: input.createdAtFrom ?? undefined,
                lte: input.createdAtTo ?? undefined,
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
});

export type PropertyRouter = typeof propertyRouter;

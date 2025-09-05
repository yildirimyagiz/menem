import { randomUUID } from "crypto";
import type { Location as LocationModel } from "@prisma/client";
// If you see errors about 'LocationModel' being 'any', ensure you have run: pnpm exec prisma generate
// If Prisma types are not generated, fallback to a minimal type for typechecking:
// type LocationModel = any;
import type { TRPCRouterRecord } from "@trpc/server";
import { Prisma } from "@prisma/client";
import {
  CreateLocationSchema,
  LocationFilterSchema,
  UpdateLocationSchema,
} from "@reservatior/validators";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure, publicProcedure } from "../trpc";

// Utility to sanitize location data
const sanitizeLocation = (location: LocationModel | null) => {
  // If LocationModel is 'any', this will not be type safe. Ensure Prisma Client is generated.

  if (!location) return null;
  return {
    id: location.id,
    country: location.country,
    city: location.city,
    district: location.district,
    address: location.address,
    postalCode: location.postalCode,
    coordinates: location.coordinates,
    createdAt: location.createdAt,
    updatedAt: location.updatedAt,
    deletedAt: location.deletedAt,
  };
};

export const locationRouter = {
  all: protectedProcedure
    .input(LocationFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      // Only pass pagination params to getPaginationParams
      const { skip, take, page, limit } = getPaginationParams({
        page:
          input && typeof input === "object" && "page" in input
            ? (input as any).page
            : undefined,
        limit:
          input && typeof input === "object" && "limit" in input
            ? (input as any).limit
            : undefined,
      });
      const cacheKey = `locations:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          country: input?.country
            ? { contains: input.country, mode: "insensitive" }
            : undefined,
          city: input?.city
            ? { contains: input.city, mode: "insensitive" }
            : undefined,
          district: input?.district
            ? { contains: input.district, mode: "insensitive" }
            : undefined,
          address: input?.address
            ? { contains: input.address, mode: "insensitive" }
            : undefined,
          postalCode: input?.postalCode
            ? { contains: input.postalCode, mode: "insensitive" }
            : undefined,
          deletedAt: null,
        } as Record<string, unknown>;
        const [locations, total] = await Promise.all([
          ctx.db.location.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take,
          }) as Promise<LocationModel[]>,
          ctx.db.location.count({ where }),
        ]);
        return {
          data: locations.map(sanitizeLocation),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const location = await ctx.db.location.findFirst({
        where: { id: input.id },
      });
      return sanitizeLocation(location);
    }),

  create: protectedProcedure
    .input(CreateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const location = await ctx.db.location.create({
          data: {
            id: randomUUID(),
            ...input,
          },
        });
        return sanitizeLocation(location);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create location: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const location = await ctx.db.location.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return sanitizeLocation(location);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.location.update({
          where: { id: input },
          data: { deletedAt: new Date() },
        });
        return { success: true };
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new Error("Location not found or already deleted.");
          }
          throw error;
        }
        throw error;
      }
    }),

  places: publicProcedure
    .input(z.object({ city: z.string().optional() }).optional())
    .query(async ({ input }) => {
      // Static curated places for San Francisco, based on Gaby Maeda's city guide
      const sfPlaces = [
        {
          name: "El Farolito",
          description:
            "A well-loved taqueria in the Mission District, famous for burritos, suizas, and salsas.",
          type: "Restaurant",
          address: "2779 Mission St, San Francisco, CA 94110",
        },
        {
          name: "Friends and Family",
          description:
            "Woman-owned, queer-owned cocktail bar in Oakland with outstanding drinks and a fun, chill vibe.",
          type: "Bar",
          address: "468 25th St, Oakland, CA 94612",
        },
        {
          name: "Birba",
          description:
            "Eclectic wine bar in Hayes Valley with a great patio and unique wine list. Home to Thai pop-up Intu-On on Sundays.",
          type: "Wine Bar",
          address: "458 Grove St, San Francisco, CA 94102",
        },
        {
          name: "Del Popolo",
          description:
            "Brick-and-mortar pizzeria known for chewy, naturally fermented dough and potato pizza with fontina and rosemary.",
          type: "Pizzeria",
          address: "855 Bush St, San Francisco, CA 94108",
        },
        {
          name: "Pearl 6101",
          description:
            "Neighborhood restaurant in Outer Richmond with a beautiful space and crave-worthy dishes by chef-owner Mel Lopez.",
          type: "Restaurant",
          address: "6101 California St, San Francisco, CA 94121",
        },
        {
          name: "Josey Baker Bread",
          description:
            "Bakery grinding their own flour, supplying buckwheat, red wheat, cornmeal, and whole-grain mixes to local restaurants.",
          type: "Bakery",
          address: "736 Divisadero St, San Francisco, CA 94117",
        },
        {
          name: "Commis",
          description:
            "Fine-dining restaurant in Oakland with a welcoming vibe and open kitchen.",
          type: "Fine Dining",
          address: "3859 Piedmont Ave, Oakland, CA 94611",
        },
        {
          name: "Californios",
          description:
            "Thoughtful, beautiful, and delicious fine-dining restaurant in San Francisco.",
          type: "Fine Dining",
          address: "355 11th St, San Francisco, CA 94103",
        },
        {
          name: "b. Patisserie",
          description:
            "Pastry shop by Belinda Leong, known for kouign-amann and chocolate sable cookies.",
          type: "Bakery",
          address: "2821 California St, San Francisco, CA 94115",
        },
        {
          name: "The Anchovy Bar",
          description:
            "Sister restaurant to State Bird, specializing in San Francisco Bay anchovies and seafood dishes.",
          type: "Seafood",
          address: "1740 O'Farrell St, San Francisco, CA 94115",
        },
      ];
      // For now, only support San Francisco
      if (!input?.city || input.city.toLowerCase().includes("san francisco")) {
        return sfPlaces;
      }
      // Return empty or placeholder for other cities
      return [];
    }),
} satisfies TRPCRouterRecord;

import type { Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { OfferStatus, OfferType } from "@prisma/client";
import { TRPCError } from "@trpc/server"; // Ensure TRPCError is imported
import { z } from "zod";

import {
  CreateOfferSchema,
  UpdateOfferSchema,
  // OfferFilterSchema, // Assuming you might create this in validators
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { protectedProcedure, publicProcedure } from "../trpc";

const offerInclude = {
  User: true,
  Increase: true,
  Reservation: true,
  Property: {
    select: {
      id: true,
      title: true,
    },
  },
} as const satisfies Prisma.OfferInclude;

type OfferWithIncludes = Prisma.OfferGetPayload<{
  include: typeof offerInclude;
}>;

interface SanitizedIncrease {
  id: string;
  status: string;
  oldRent: number;
  newRent: number;
}

interface SanitizedOffer {
  id: string;

  propertyId: string;
  offerType: OfferType;
  status: OfferStatus;
  basePrice: number;
  discountRate: number | null;
  finalPrice: number;
  guestId: string | null;
  startDate: Date;
  endDate: Date;
  specialRequirements: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  reservationId: string | null;
  increaseId: string | null;
  user: { id: string; name: string } | null;
  increase: SanitizedIncrease | null;

  reservation: { id: string; status: string } | null;
  property: { id: string; title: string } | null;
}

function sanitizeOffer(offer: OfferWithIncludes): SanitizedOffer {
  const { User, Increase, Reservation, Property, ...rest } = offer;
  return {
    ...rest,
    user: User
      ? {
          id: User.id,
          name: User.name ?? "",
        }
      : null,
    increase: Increase
      ? {
          id: Increase.id,
          status: Increase.status,
          oldRent: Increase.oldRent,
          newRent: Increase.newRent,
        }
      : null,
    reservation: Reservation
      ? {
          id: Reservation.id,
          status: Reservation.status,
        }
      : null,
    property: Property
      ? {
          id: Property.id,
          title: Property.title,
        }
      : null,
  };
}

export const offerRouter: TRPCRouterRecord = {
  list: publicProcedure
    // Consider defining this complex input schema in @acme/validators as OfferFilterSchema
    .input(
      z
        .object({
          // Include all fields from OfferFilterSchema
          propertyId: z.string().optional(),
          increaseId: z.string().optional(),
          offerType: z.nativeEnum(OfferType).optional(),
          status: z.nativeEnum(OfferStatus).optional(),
          guestId: z.string().optional(),
          basePriceMin: z.number().optional(),
          basePriceMax: z.number().optional(),
          finalPriceMin: z.number().optional(),
          finalPriceMax: z.number().optional(),
          startDateFrom: z.date().optional(),
          startDateTo: z.date().optional(),
          endDateFrom: z.date().optional(),
          endDateTo: z.date().optional(),
          createdAtFrom: z.date().optional(),
          createdAtTo: z.date().optional(),
          deletedAt: z.date().optional(),
          reservationId: z.string().optional(),
          sortBy: z
            .enum([
              "createdAt",
              "startDate",
              "endDate",
              "basePrice",
              "finalPrice",
              "status",
            ])
            .optional(),
          sortOrder: z.enum(["asc", "desc"]).optional(),
          // Pagination
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
        })
        .partial(),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{
        offers: SanitizedOffer[];
        total: number;
      }> => {
        const { skip, take } = getPaginationParams({
          page: input.page,
          limit: input.limit,
        });

        // Create base where clause
        const where: Prisma.OfferWhereInput = {
          // Always exclude soft-deleted offers unless explicitly requested
          deletedAt: input.deletedAt ? { equals: input.deletedAt } : null,
        };

        // Add propertyId filter if provided
        if (input.propertyId) {
          where.propertyId = input.propertyId;
        }

        // Add other filters if provided
        if (input.increaseId) where.increaseId = input.increaseId;
        if (input.offerType) where.offerType = input.offerType;
        if (input.status) where.status = input.status;
        if (input.guestId) where.guestId = input.guestId;
        if (input.reservationId) where.reservationId = input.reservationId;

        // Add date range filters if provided
        if (input.startDateFrom || input.startDateTo) {
          where.startDate = {
            ...(input.startDateFrom ? { gte: input.startDateFrom } : {}),
            ...(input.startDateTo ? { lte: input.startDateTo } : {}),
          };
        }

        if (input.endDateFrom || input.endDateTo) {
          where.endDate = {
            ...(input.endDateFrom ? { gte: input.endDateFrom } : {}),
            ...(input.endDateTo ? { lte: input.endDateTo } : {}),
          };
        }

        if (input.createdAtFrom || input.createdAtTo) {
          where.createdAt = {
            ...(input.createdAtFrom ? { gte: input.createdAtFrom } : {}),
            ...(input.createdAtTo ? { lte: input.createdAtTo } : {}),
          };
        }

        // Add price range filters if provided
        if (input.basePriceMin || input.basePriceMax) {
          where.basePrice = {
            ...(input.basePriceMin ? { gte: input.basePriceMin } : {}),
            ...(input.basePriceMax ? { lte: input.basePriceMax } : {}),
          };
        }

        if (input.finalPriceMin || input.finalPriceMax) {
          where.finalPrice = {
            ...(input.finalPriceMin ? { gte: input.finalPriceMin } : {}),
            ...(input.finalPriceMax ? { lte: input.finalPriceMax } : {}),
          };
        }

        const [offers, total] = await Promise.all([
          ctx.db.offer.findMany({
            where,
            orderBy: {
              [input.sortBy ?? "createdAt"]: input?.sortOrder ?? "desc",
            },
            skip,
            take,
            include: offerInclude,
          }),
          ctx.db.offer.count({ where }),
        ]);

        return {
          offers: offers.map((offer) => sanitizeOffer(offer)),
          total,
        };
      },
    ),

  byId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }): Promise<SanitizedOffer> => {
      const offer = await ctx.db.offer.findFirst({
        where: { id: input },
        include: offerInclude,
      });

      if (!offer) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Offer not found" });
      }

      return sanitizeOffer(offer);
    }),

  create: protectedProcedure
    .input(CreateOfferSchema)
    .mutation(async ({ ctx, input }): Promise<SanitizedOffer> => {
      try {
        const { propertyId, ...offerData } = input;
        const offer = await ctx.db.offer.create({
          data: {
            ...offerData,
            propertyId,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          include: offerInclude,
        });
        return sanitizeOffer(offer as OfferWithIncludes);
      } catch (error) {
        if (error instanceof Error) {
          // Log the original error for server-side diagnostics
          console.error("Create offer failed:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create offer: ${error.message}`,
            cause: error,
          });
        }
        console.error("Create offer failed with unknown error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while creating the offer",
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateOfferSchema)
    .mutation(async ({ ctx, input }): Promise<SanitizedOffer> => {
      const { id, propertyId, ...data } = input as z.infer<
        typeof UpdateOfferSchema
      > & { propertyId?: string };
      try {
        // Create a new object with only the fields that can be updated
        const updateData: Prisma.OfferUpdateInput = {
          ...(data.status !== undefined && { status: data.status }),
          ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
          ...(data.discountRate !== undefined && {
            discountRate: data.discountRate,
          }),
          ...(data.finalPrice !== undefined && { finalPrice: data.finalPrice }),
          ...(data.startDate !== undefined && { startDate: data.startDate }),
          ...(data.endDate !== undefined && { endDate: data.endDate }),
          ...(data.specialRequirements !== undefined && {
            specialRequirements: data.specialRequirements,
          }),
          ...(data.notes !== undefined && { notes: data.notes }),
          ...(data.deletedAt !== undefined && { deletedAt: data.deletedAt }),
          ...(data.reservationId !== undefined && {
            Reservation: data.reservationId
              ? { connect: { id: data.reservationId } }
              : { disconnect: true },
          }),
          updatedAt: new Date(),
        };

        // Include property relation if propertyId is provided
        if (propertyId !== undefined) {
          updateData.Property = propertyId
            ? { connect: { id: propertyId } }
            : { disconnect: true };
        }

        // Ensure required fields are included
        const offer = await ctx.db.offer.update({
          where: { id },
          data: updateData,
          include: {
            ...offerInclude,
            // Explicitly include all required relations
            User: true,
            Increase: true,
            Reservation: true,
            Property: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        return sanitizeOffer(offer);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Offer not found for update.",
          });
        }
        console.error("Update offer failed:", error);
        // Rethrow as TRPCError if it's not already one or a known Prisma error
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
    .mutation(async ({ ctx, input }): Promise<SanitizedOffer> => {
      try {
        const offer = await ctx.db.offer.delete({
          where: { id: input },
          include: offerInclude,
        });
        return sanitizeOffer(offer);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Offer not found or already deleted.",
          });
        }
        console.error("Delete offer failed:", error);
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

  accept: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }): Promise<SanitizedOffer> => {
      try {
        const offer = await ctx.db.offer.update({
          where: { id: input },
          data: {
            status: "ACCEPTED",
            updatedAt: new Date(),
          },
          include: offerInclude,
        });
        return sanitizeOffer(offer);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Offer not found for accept operation.",
          });
        }
        console.error("Accept offer failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during accept.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  reject: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }): Promise<SanitizedOffer> => {
      try {
        const offer = await ctx.db.offer.update({
          where: { id: input },
          data: {
            status: "REJECTED",
            updatedAt: new Date(),
          },
          include: offerInclude,
        });
        return sanitizeOffer(offer);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Offer not found for reject operation.",
          });
        }
        console.error("Reject offer failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during reject.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),
} satisfies TRPCRouterRecord;

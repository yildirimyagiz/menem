import type {
  Agency,
  Prisma,
  ContractStatus as PrismaContractStatus,
  IncreaseStatus as PrismaIncreaseStatus,
  Property,
  Tenant,
} from "@prisma/client";
// Removed unused ValidatorContractStatus import
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { protectedProcedure } from "../trpc";

// Import Prisma types
type PrismaContract = Prisma.ContractGetPayload<{
  include: {
    Tenant: true;
    Property: true;
    Agency: true;
  };
}>;

// Define the contract status enum to match the Prisma schema
const ContractStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
  "PUBLISHED",
  "EXPIRED",
  "TERMINATED",
  "CANCELLED",
  "OVERDUE",
  "RENEWED",
]);

type ContractStatus = z.infer<typeof ContractStatus>;

// Define the contract with relations type that matches Prisma's generated types
type ContractWithRelations = PrismaContract & {
  Tenant: Tenant | null;
  Property: Property | null;
  Agency: Agency | null;
};

// Map between string and Prisma's ContractStatus
const toPrismaContractStatus = (status: string): PrismaContractStatus => {
  return status as PrismaContractStatus;
};

// Map between Prisma's ContractStatus and string
const toContractStatus = (status: PrismaContractStatus): ContractStatus => {
  return status as ContractStatus;
};

function sanitizeContract(contract: ContractWithRelations | null) {
  if (!contract) return null;

  const { Tenant, Property, Agency, ...rest } = contract;

  return {
    ...rest,
    status: toContractStatus(contract.status),
    startDate: rest.startDate.toISOString(),
    endDate: rest.endDate.toISOString(),
    createdAt: rest.createdAt.toISOString(),
    updatedAt: rest.updatedAt.toISOString(),
    deletedAt: rest.deletedAt?.toISOString(),
    terms: rest.terms as Record<string, unknown> | null,
    metadata: rest.metadata as Record<string, unknown> | null,
    tenant: Tenant
      ? {
          id: Tenant.id,
          name: `${Tenant.firstName} ${Tenant.lastName}`,
        }
      : null,
    property: Property
      ? {
          id: Property.id,
          name: Property.title || "Untitled Property",
        }
      : null,
    agency: Agency
      ? {
          id: Agency.id,
          name: Agency.name || "Unnamed Agency",
        }
      : null,
  };
}

export const contractRouter = {
  getAll: protectedProcedure
    .input(
      z.object({
        status: ContractStatus.optional(),
        tenantId: z.string().optional(),
        propertyId: z.string().optional(),
        agencyId: z.string().optional(),
        startDateFrom: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        startDateTo: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        endDateFrom: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        endDateTo: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        sortBy: z.enum(["startDate", "endDate", "status", "name"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page = 1, pageSize = 20, sortBy, sortOrder, ...filters } = input;
      const { skip, take } = getPaginationParams({ page, limit: pageSize });

      const where: Prisma.ContractWhereInput = {
        deletedAt: null,
      };

      // Apply filters
      if (filters.status) {
        where.status = toPrismaContractStatus(filters.status);
      }
      if (filters.tenantId) {
        where.tenantId = filters.tenantId;
      }
      if (filters.propertyId) {
        where.propertyId = filters.propertyId;
      }
      if (filters.agencyId) {
        where.agencyId = filters.agencyId;
      }
      if (filters.startDateFrom || filters.startDateTo) {
        where.startDate = {};
        if (filters.startDateFrom) {
          where.startDate.gte = new Date(filters.startDateFrom);
        }
        if (filters.startDateTo) {
          where.startDate.lte = new Date(filters.startDateTo);
        }
      }
      if (filters.endDateFrom || filters.endDateTo) {
        where.endDate = {};
        if (filters.endDateFrom) {
          where.endDate.gte = new Date(filters.endDateFrom);
        }
        if (filters.endDateTo) {
          where.endDate.lte = new Date(filters.endDateTo);
        }
      }

      const [contracts, total] = await Promise.all([
        ctx.db.contract.findMany({
          where,
          include: {
            Tenant: true,
            Property: true,
            Agency: true,
          },
          orderBy: {
            [sortBy ?? "createdAt"]: sortOrder ?? "desc",
          },
          skip,
          take,
        }),
        ctx.db.contract.count({ where }),
      ]);

      return {
        data: contracts.map((contract) =>
          sanitizeContract(contract as PrismaContract),
        ),
        total,
      };
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const contract = await ctx.db.contract.findUnique({
        where: { id: input },
        include: {
          Tenant: true,
          Property: true,
          Agency: true,
        },
      });

      if (!contract) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contract not found.",
        });
      }

      return sanitizeContract(contract as PrismaContract);
    }),
  create: protectedProcedure
    .input(
      z
        .object({
          name: z.string().min(1, "Name is required"),
          description: z.string().min(1, "Description is required"),
          status: ContractStatus.optional().default("DRAFT"),
          startDate: z.date().or(z.string().pipe(z.coerce.date())),
          endDate: z.date().or(z.string().pipe(z.coerce.date())),
          tenantId: z.string().min(1, "Tenant ID is required"),
          propertyId: z.string().min(1, "Property ID is required"),
          agencyId: z.string().min(1, "Agency ID is required"),
          terms: z.record(z.any()).optional().nullable(),
          metadata: z.record(z.any()).optional().nullable(),
        })
        .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
          message: "End date must be after start date",
          path: ["endDate"],
        }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { tenantId, propertyId, agencyId, terms, metadata, ...data } =
          input;

        // Prepare the contract data with proper types
        const contractData: Prisma.ContractCreateInput = {
          id: crypto.randomUUID(),
          ...data,
          status: toPrismaContractStatus(input.status), // Zod default handles DRAFT
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          Tenant: { connect: { id: tenantId } },
          Property: { connect: { id: propertyId } },
          Agency: { connect: { id: agencyId } },
          updatedAt: new Date(),
          createdAt: new Date(),
        };

        // Only add terms and metadata if they are provided
        if (terms) {
          contractData.terms = terms as Prisma.InputJsonValue;
        }
        if (metadata) {
          contractData.metadata = metadata as Prisma.InputJsonValue;
        }

        // Create the contract
        const contract = await ctx.db.contract.create({
          data: contractData,
        });

        // Then fetch it with relations to ensure all data is current and sanitized
        const contractWithRelations = await ctx.db.contract.findUnique({
          where: { id: contract.id },
          include: {
            Tenant: true,
            Property: true,
            Agency: true,
          },
        });

        if (!contractWithRelations) {
          // This case should ideally not be reached if create was successful
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Failed to retrieve contract after creation. The contract might have been created but could not be fetched.",
          });
        }
        return sanitizeContract(contractWithRelations as PrismaContract);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create contract: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          name: z.string().min(1, "Name is required").optional(),
          description: z.string().min(1, "Description is required").optional(),
          status: ContractStatus.optional(),
          startDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
          endDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
          terms: z.record(z.any()).optional().nullable(),
          metadata: z.record(z.any()).optional().nullable(),
        })
        .refine(
          (data) => {
            if (data.startDate && data.endDate) {
              return new Date(data.endDate) > new Date(data.startDate);
            }
            return true;
          },
          {
            message: "End date must be after start date",
            path: ["endDate"],
          },
        ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, terms, metadata, status, startDate, endDate, ...data } =
          input;

        const updateData: Prisma.ContractUpdateInput = {
          ...data,
          updatedAt: new Date(),
        };

        // Handle status update if provided
        if (status !== undefined) {
          updateData.status = toPrismaContractStatus(status);
        }

        // Handle date updates if provided
        if (startDate !== undefined) {
          updateData.startDate = new Date(startDate);
        }
        if (endDate !== undefined) {
          updateData.endDate = new Date(endDate);
        }

        // Handle JSON fields
        if (terms !== undefined) {
          updateData.terms = terms as Prisma.InputJsonValue;
        }
        if (metadata !== undefined) {
          updateData.metadata = metadata as Prisma.InputJsonValue;
        }

        // First update the contract
        await ctx.db.contract.update({
          where: { id },
          data: updateData,
        });

        // Then fetch it with relations
        const contract = await ctx.db.contract.findUnique({
          where: { id },
          include: {
            Tenant: true,
            Property: true,
            Agency: true,
          },
        });

        if (!contract) {
          // Should be caught by Prisma P2025, but as a safeguard
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found after update attempt.",
          });
        }

        // Create notifications based on status changes
        if (status) {
          const notificationType = (() => {
            switch (status) {
              case "RENEWED":
                return "LEASE_RENEWAL";
              case "CANCELLED":
              case "TERMINATED":
                return "LEASE_TERMINATION";
              default:
                return null;
            }
          })();

          if (notificationType) {
            // Notify tenant
            await ctx.db.notification.create({
              data: {
                type: notificationType,
                content: `Your contract for ${contract.name} has been ${status.toLowerCase()}`,
                userId: contract.tenantId,
                entityId: contract.id,
                entityType: "CONTRACT",
                agencyId: contract.agencyId,
              },
            });

            // Notify agency
            if (contract.agencyId) {
              await ctx.db.notification.create({
                data: {
                  type: notificationType,
                  content: `Contract ${contract.name} has been ${status.toLowerCase()} by tenant`,
                  userId: contract.agencyId,
                  entityId: contract.id,
                  entityType: "CONTRACT",
                  tenantId: contract.tenantId,
                },
              });
            }
          }
        }

        return sanitizeContract(contract as PrismaContract);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error code for "Record to update not found"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update contract: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        // Perform the soft delete
        await ctx.db.contract.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            status: toPrismaContractStatus("CANCELLED"), // Use mapping function
            updatedAt: new Date(),
          },
        });

        // Then fetch the (soft) deleted contract with relations
        const contract = await ctx.db.contract.findUnique({
          where: { id: input },
          include: {
            Tenant: true,
            Property: true,
            Agency: true,
          },
        });

        if (!contract) {
          // Should be caught by Prisma P2025, but as a safeguard
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found after delete attempt.",
          });
        }

        // Create notifications for cancellation
        await ctx.db.notification.create({
          data: {
            type: "LEASE_TERMINATION",
            content: `Your contract for ${contract.name} has been cancelled`,
            userId: contract.tenantId,
            entityId: contract.id,
            entityType: "CONTRACT",
            agencyId: contract.agencyId,
          },
        });

        // Notify agency if exists
        if (contract.agencyId) {
          await ctx.db.notification.create({
            data: {
              type: "LEASE_TERMINATION",
              content: `Contract ${contract.name} has been cancelled by tenant`,
              userId: contract.agencyId,
              entityId: contract.id,
              entityType: "CONTRACT",
              tenantId: contract.tenantId,
            },
          });
        }

        return sanitizeContract(contract as PrismaContract);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete contract: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  // Alias for getAll to match client expectations
  list: protectedProcedure
    .input(
      z.object({
        status: ContractStatus.optional(),
        tenantId: z.string().optional(),
        propertyId: z.string().optional(),
        agencyId: z.string().optional(),
        startDateFrom: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        startDateTo: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        endDateFrom: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        endDateTo: z.date().or(z.string().pipe(z.coerce.date())).optional(),
        sortBy: z.enum(["startDate", "endDate", "status", "name"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page = 1, pageSize = 20, sortBy, sortOrder, ...filters } = input;
      const { skip, take } = getPaginationParams({ page, limit: pageSize });

      const where: Prisma.ContractWhereInput = {
        deletedAt: null,
      };

      // Apply filters
      if (filters.status) {
        where.status = toPrismaContractStatus(filters.status);
      }
      if (filters.tenantId) {
        where.tenantId = filters.tenantId;
      }
      if (filters.propertyId) {
        where.propertyId = filters.propertyId;
      }
      if (filters.agencyId) {
        where.agencyId = filters.agencyId;
      }
      if (filters.startDateFrom || filters.startDateTo) {
        where.startDate = {};
        if (filters.startDateFrom) {
          where.startDate.gte = new Date(filters.startDateFrom);
        }
        if (filters.startDateTo) {
          where.startDate.lte = new Date(filters.startDateTo);
        }
      }
      if (filters.endDateFrom || filters.endDateTo) {
        where.endDate = {};
        if (filters.endDateFrom) {
          where.endDate.gte = new Date(filters.endDateFrom);
        }
        if (filters.endDateTo) {
          where.endDate.lte = new Date(filters.endDateTo);
        }
      }

      const contracts = await ctx.db.contract.findMany({
        where,
        include: {
          Tenant: true,
          Property: true,
          Agency: true,
        },
        orderBy: {
          [sortBy ?? "createdAt"]: sortOrder ?? "desc",
        },
        skip,
        take,
      });

      return contracts.map((contract) =>
        sanitizeContract(contract as PrismaContract),
      );
    }),

  // Alias for getById to match client expectations
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const contract = await ctx.db.contract.findUnique({
        where: { id: input.id },
        include: {
          Tenant: true,
          Property: true,
          Agency: true,
        },
      });

      if (!contract) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contract not found.",
        });
      }

      return sanitizeContract(contract as PrismaContract);
    }),

  // Alias for getById to match client expectations
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const contract = await ctx.db.contract.findUnique({
        where: { id: input.id },
        include: {
          Tenant: true,
          Property: true,
          Agency: true,
        },
      });

      if (!contract) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contract not found.",
        });
      }

      return sanitizeContract(contract as PrismaContract);
    }),

  // Contract signing functionality
  sign: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        signature: z.string(),
        signedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, signature, signedAt = new Date() } = input;

        const updateData: Prisma.ContractUpdateInput = {
          status: toPrismaContractStatus("ACTIVE"),
          updatedAt: new Date(),
          metadata: {
            signature,
            signedAt: signedAt.toISOString(),
            signedBy: ctx.session.user.id,
          } as Prisma.InputJsonValue,
        };

        await ctx.db.contract.update({
          where: { id },
          data: updateData,
        });

        const contract = await ctx.db.contract.findUnique({
          where: { id },
          include: {
            Tenant: true,
            Property: true,
            Agency: true,
          },
        });

        if (!contract) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found after signing.",
          });
        }

        return sanitizeContract(contract as PrismaContract);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to sign contract: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  // Update contract terms
  updateTerms: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        terms: z.record(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, terms } = input;

        const updateData: Prisma.ContractUpdateInput = {
          terms: terms as Prisma.InputJsonValue,
          updatedAt: new Date(),
        };

        await ctx.db.contract.update({
          where: { id },
          data: updateData,
        });

        const contract = await ctx.db.contract.findUnique({
          where: { id },
          include: {
            Tenant: true,
            Property: true,
            Agency: true,
          },
        });

        if (!contract) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found after terms update.",
          });
        }

        return sanitizeContract(contract as PrismaContract);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contract not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update contract terms: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  // Get increases by contract ID
  byContract: protectedProcedure
    .input(z.object({ contractId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const increases = await ctx.db.increase.findMany({
          where: {
            contractId: input.contractId,
            deletedAt: null,
          },
          include: {
            Property: true,
            Tenant: true,
            Offer: true,
          },
          orderBy: { createdAt: "desc" },
        });

        return increases.map((increase) => ({
          id: increase.id,
          propertyId: increase.propertyId,
          tenantId: increase.tenantId,
          proposedBy: increase.proposedBy,
          oldRent: increase.oldRent,
          newRent: increase.newRent,
          effectiveDate: increase.effectiveDate.toISOString(),
          status: increase.status.toString(),
          contractId: increase.contractId,
          deletedAt: increase.deletedAt?.toISOString() ?? null,
          createdAt: increase.createdAt.toISOString(),
          updatedAt: increase.updatedAt.toISOString(),
          Property: { id: increase.Property.id, title: increase.Property.title },
          Tenant: {
            id: increase.Tenant.id,
            firstName: increase.Tenant.firstName,
            lastName: increase.Tenant.lastName,
          },
          Offer: increase.Offer
            ? { id: increase.Offer.id, status: increase.Offer.status }
            : null,
        }));
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch increases by contract: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  // Create increase for contract
  createIncrease: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        propertyId: z.string(),
        tenantId: z.string(),
        proposedBy: z.string(),
        oldRent: z.number().positive(),
        newRent: z.number().positive(),
        effectiveDate: z.date(),
        status: z
          .enum(["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"])
          .default("PENDING"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const now = new Date();
        const data: Prisma.IncreaseCreateInput = {
          id: crypto.randomUUID(),
          Property: { connect: { id: input.propertyId } },
          Tenant: { connect: { id: input.tenantId } },
          Contract: { connect: { id: input.contractId } },
          proposedBy: input.proposedBy,
          oldRent: input.oldRent,
          newRent: input.newRent,
          effectiveDate: input.effectiveDate,
          status: input.status as unknown as PrismaIncreaseStatus,
          createdAt: now,
          updatedAt: now,
        };

        const increase = await ctx.db.increase.create({
          data,
          include: {
            Property: true,
            Tenant: true,
            Offer: true,
          },
        });

        return {
          id: increase.id,
          propertyId: increase.propertyId,
          tenantId: increase.tenantId,
          proposedBy: increase.proposedBy,
          oldRent: increase.oldRent,
          newRent: increase.newRent,
          effectiveDate: increase.effectiveDate.toISOString(),
          status: increase.status.toString(),
          contractId: increase.contractId,
          deletedAt: increase.deletedAt?.toISOString() ?? null,
          createdAt: increase.createdAt.toISOString(),
          updatedAt: increase.updatedAt.toISOString(),
          Property: { id: increase.Property.id, title: increase.Property.title },
          Tenant: {
            id: increase.Tenant.id,
            firstName: increase.Tenant.firstName,
            lastName: increase.Tenant.lastName,
          },
          Offer: increase.Offer
            ? { id: increase.Offer.id, status: increase.Offer.status }
            : null,
        };
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create increase: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  // Update increase status
  updateIncreaseStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const increase = await ctx.db.increase.update({
          where: { id: input.id },
          data: {
            status: input.status as unknown as PrismaIncreaseStatus,
            updatedAt: new Date(),
          },
          include: {
            Property: true,
            Tenant: true,
            Offer: true,
          },
        });

        return {
          id: increase.id,
          propertyId: increase.propertyId,
          tenantId: increase.tenantId,
          proposedBy: increase.proposedBy,
          oldRent: increase.oldRent,
          newRent: increase.newRent,
          effectiveDate: increase.effectiveDate.toISOString(),
          status: increase.status.toString(),
          contractId: increase.contractId,
          deletedAt: increase.deletedAt?.toISOString() ?? null,
          createdAt: increase.createdAt.toISOString(),
          updatedAt: increase.updatedAt.toISOString(),
          Property: { id: increase.Property.id, title: increase.Property.title },
          Tenant: {
            id: increase.Tenant.id,
            firstName: increase.Tenant.firstName,
            lastName: increase.Tenant.lastName,
          },
          Offer: increase.Offer
            ? { id: increase.Offer.id, status: increase.Offer.status }
            : null,
        };
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Increase not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update increase status: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;

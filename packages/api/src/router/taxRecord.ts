import type { Prisma } from "@prisma/client";
import { Prisma as PrismaRuntime } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TaxRecordFilterSchema = z.object({
  propertyId: z.string().optional(),
  clientId: z.string().uuid().optional(),
  year: z.number().int().optional(),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED", "DISPUTED", "PARTIALLY_PAID", "WAIVED", "EXTENDED"]).optional(),
  taxType: z.enum(["PROPERTY_TAX", "INCOME_TAX", "SALES_TAX", "OCCUPANCY_TAX", "CITY_TAX", "STATE_TAX", "FEDERAL_TAX", "UTILITY_TAX", "MAINTENANCE_TAX", "LUXURY_TAX", "TRANSFER_TAX", "STAMP_DUTY", "OTHER"]).optional(),
  paid: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  dueDateStart: z.date().optional(),
  dueDateEnd: z.date().optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "STRIPE", "CHECK", "MONEY_ORDER", "CRYPTO", "OTHER"]).optional(),
  createdById: z.string().uuid().optional(),
  parentTaxRecordId: z.string().uuid().optional(),
  hasAttachments: z.boolean().optional(),
  overdue: z.boolean().optional(),
  sortBy: z
    .enum(["year", "amount", "dueDate", "paidDate", "createdAt", "updatedAt", "priority", "status"])
    .default("dueDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

const CreateTaxRecordSchema = z.object({
  propertyId: z.string(),
  year: z.number().int(),
  amount: z.number().positive(),
  percentage: z.number().min(0).max(100).optional(),
  taxType: z.enum(["PROPERTY_TAX", "INCOME_TAX", "SALES_TAX", "OCCUPANCY_TAX", "CITY_TAX", "STATE_TAX", "FEDERAL_TAX", "UTILITY_TAX", "MAINTENANCE_TAX", "LUXURY_TAX", "TRANSFER_TAX", "STAMP_DUTY", "OTHER"]).default("PROPERTY_TAX"),
  dueDate: z.date(),
  notes: z.string().optional(),
  clientId: z.string().uuid(),
  
  // Additional fields
  lateFees: z.number().min(0).optional(),
  interestRate: z.number().min(0).max(100).optional(),
  gracePeriod: z.number().int().min(0).optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]).optional(),
  nextDueDate: z.date().optional(),
  
  // Metadata
  tags: z.array(z.string()).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  
  // Related records
  parentTaxRecordId: z.string().uuid().optional(),
  relatedTaxRecords: z.array(z.string().uuid()).optional()
});

const UpdateTaxRecordSchema = z.object({
  id: z.string(),
  propertyId: z.string().optional(),
  year: z.number().int().optional(),
  amount: z.number().positive().optional(),
  percentage: z.number().min(0).max(100).optional(),
  taxType: z.enum(["PROPERTY_TAX", "INCOME_TAX", "SALES_TAX", "OCCUPANCY_TAX", "CITY_TAX", "STATE_TAX", "FEDERAL_TAX", "UTILITY_TAX", "MAINTENANCE_TAX", "LUXURY_TAX", "TRANSFER_TAX", "STAMP_DUTY", "OTHER"]).optional(),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  paid: z.boolean().optional(),
  paidAmount: z.number().min(0).optional(),
  paidDate: z.date().optional(),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED", "DISPUTED", "PARTIALLY_PAID", "WAIVED", "EXTENDED"]).optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "STRIPE", "CHECK", "MONEY_ORDER", "CRYPTO", "OTHER"]).optional(),
  transactionId: z.string().optional(),
  receiptNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  
  // Additional fields
  lateFees: z.number().min(0).optional(),
  interestRate: z.number().min(0).max(100).optional(),
  gracePeriod: z.number().int().min(0).optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]).optional(),
  nextDueDate: z.date().optional(),
  reminderSent: z.boolean().optional(),
  reminderDate: z.date().optional(),
  
  // Metadata
  tags: z.array(z.string()).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional()
});

const BulkOperationSchema = z.object({
  ids: z.array(z.string()),
  operation: z.enum(["MARK_PAID", "MARK_OVERDUE", "DELETE", "UPDATE_STATUS", "UPDATE_PRIORITY"]),
  data: z.object({
    status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED", "DISPUTED", "PARTIALLY_PAID", "WAIVED", "EXTENDED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "STRIPE", "CHECK", "MONEY_ORDER", "CRYPTO", "OTHER"]).optional(),
    transactionId: z.string().optional()
  }).optional()
});

const TaxSummaryFilterSchema = z.object({
  propertyId: z.string().optional(),
  clientId: z.string().uuid().optional(),
  year: z.number().int().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  taxType: z.enum(["PROPERTY_TAX", "INCOME_TAX", "SALES_TAX", "OCCUPANCY_TAX", "CITY_TAX", "STATE_TAX", "FEDERAL_TAX", "UTILITY_TAX", "MAINTENANCE_TAX", "LUXURY_TAX", "TRANSFER_TAX", "STAMP_DUTY", "OTHER"]).optional(),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED", "DISPUTED", "PARTIALLY_PAID", "WAIVED", "EXTENDED"]).optional()
});

export const taxRecordRouter = createTRPCRouter({
  all: protectedProcedure
    .input(TaxRecordFilterSchema)
    .query(async ({ ctx, input }) => {
      const {
        propertyId,
        clientId,
        year,
        status,
        taxType,
        paid,
        isRecurring,
        priority,
        category,
        tags,
        startDate,
        endDate,
        dueDateStart,
        dueDateEnd,
        amountMin,
        amountMax,
        paymentMethod,
        createdById,
        parentTaxRecordId,
        hasAttachments,
        overdue,
        sortBy,
        sortOrder,
        page,
        pageSize,
      } = input;

      const { skip, take } = getPaginationParams({ page, limit: pageSize });

      // Build where clause
      const where: Prisma.TaxRecordWhereInput = {};
      
      if (propertyId) where.propertyId = propertyId;
      if (clientId) where.clientId = clientId;
      if (year) where.year = year;
      if (status) where.status = status;
      if (taxType) where.taxType = taxType;
      if (paid !== undefined) where.paid = paid;
      if (isRecurring !== undefined) where.isRecurring = isRecurring;
      if (priority) where.priority = priority;
      if (category) where.category = category;
      if (paymentMethod) where.paymentMethod = paymentMethod;
      if (createdById) where.createdById = createdById;
      if (parentTaxRecordId) where.parentTaxRecordId = parentTaxRecordId;
      
      // Date filters
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
      
      if (dueDateStart || dueDateEnd) {
        where.dueDate = {};
        if (dueDateStart) where.dueDate.gte = dueDateStart;
        if (dueDateEnd) where.dueDate.lte = dueDateEnd;
      }
      
      // Amount filters
      if (amountMin || amountMax) {
        where.amount = {};
        if (amountMin) where.amount.gte = amountMin;
        if (amountMax) where.amount.lte = amountMax;
      }
      
      // Overdue filter
      if (overdue) {
        where.dueDate = { lt: new Date() };
        where.paid = false;
      }
      
      // Tags filter
      if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
      }
      
      // Has attachments filter (JSON nullable). Use null vs not null check.
      if (hasAttachments !== undefined) {
        where.attachments = hasAttachments
          ? { not: PrismaRuntime.DbNull }
          : { equals: PrismaRuntime.DbNull };
      }

      const [records, total] = await Promise.all([
        ctx.db.taxRecord.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            Property: true,
            Client: true,
            CreatedBy: true,
            UpdatedBy: true,
          },
        }),
        ctx.db.taxRecord.count({ where }),
      ]);

      return {
        data: records,
        total,
        totalPages: Math.ceil(total / pageSize),
        page,
        pageSize,
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const record = await ctx.db.taxRecord.findUnique({
        where: { id: input.id },
        include: {
          Property: true,
          Client: true,
          CreatedBy: true,
          UpdatedBy: true,
          ParentTaxRecord: true,
        },
      });

      if (!record) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tax record not found",
        });
      }

      return record;
    }),

  create: protectedProcedure
    .input(CreateTaxRecordSchema)
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.taxRecord.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
          updatedById: ctx.session.user.id,
          auditTrail: {
            create: {
              action: "CREATED",
              timestamp: new Date(),
              userId: ctx.session.user.id,
              details: "Tax record created"
            }
          }
        },
        include: {
          Property: true,
          Client: true,
          CreatedBy: true,
          UpdatedBy: true,
        },
      });

      return record;
    }),

  update: protectedProcedure
    .input(UpdateTaxRecordSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const record = await ctx.db.taxRecord.update({
        where: { id },
        data: {
          ...data,
          updatedById: ctx.session.user.id,
          auditTrail: {
            create: {
              action: "UPDATED",
              timestamp: new Date(),
              userId: ctx.session.user.id,
              details: "Tax record updated"
            }
          }
        },
        include: {
          Property: true,
          Client: true,
          CreatedBy: true,
          UpdatedBy: true,
        },
      });

      return record;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.taxRecord.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          updatedById: ctx.session.user.id,
          auditTrail: {
            create: {
              action: "DELETED",
              timestamp: new Date(),
              userId: ctx.session.user.id,
              details: "Tax record deleted"
            }
          }
        },
      });

      return record;
    }),

  markAsPaid: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "STRIPE", "CHECK", "MONEY_ORDER", "CRYPTO", "OTHER"]).optional(),
        transactionId: z.string().optional(),
        receiptNumber: z.string().optional(),
        paidAmount: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, paymentMethod, transactionId, receiptNumber, paidAmount } = input;

      const record = await ctx.db.taxRecord.update({
        where: { id },
        data: {
          paid: true,
          paidDate: new Date(),
          status: "PAID",
          paymentMethod,
          transactionId,
          receiptNumber,
          paidAmount: paidAmount ?? undefined,
          updatedById: ctx.session.user.id,
          auditTrail: {
            create: {
              action: "MARKED_PAID",
              timestamp: new Date(),
              userId: ctx.session.user.id,
              details: `Marked as paid${paymentMethod ? ` via ${paymentMethod}` : ''}`
            }
          }
        },
        include: {
          Property: true,
          Client: true,
        },
      });

      return record;
    }),

  bulkOperation: protectedProcedure
    .input(BulkOperationSchema)
    .mutation(async ({ ctx, input }) => {
      const { ids, operation, data } = input;

      let updateData: Prisma.TaxRecordUpdateManyMutationInput = {};

      switch (operation) {
        case "MARK_PAID":
          updateData = {
            ...updateData,
            paid: true,
            paidDate: new Date(),
            status: "PAID",
            paymentMethod: data?.paymentMethod,
            transactionId: data?.transactionId,
          };
          break;
        case "MARK_OVERDUE":
          updateData = {
            ...updateData,
            status: "OVERDUE",
          };
          break;
        case "UPDATE_STATUS":
          updateData = {
            ...updateData,
            status: data?.status,
          };
          break;
        case "UPDATE_PRIORITY":
          updateData = {
            ...updateData,
            priority: data?.priority,
          };
          break;
        case "DELETE":
          updateData = {
            ...updateData,
            deletedAt: new Date(),
          };
          break;
      }

      const result = await ctx.db.taxRecord.updateMany({
        where: { id: { in: ids } },
        data: updateData,
      });

      return {
        updatedCount: result.count,
        operation,
      };
    }),

  summary: protectedProcedure
    .input(TaxSummaryFilterSchema)
    .query(async ({ ctx, input }) => {
      const {
        propertyId,
        clientId,
        year,
        startDate,
        endDate,
        taxType,
        status,
      } = input;

      const where: Prisma.TaxRecordWhereInput = {};
      
      if (propertyId) where.propertyId = propertyId;
      if (clientId) where.clientId = clientId;
      if (year) where.year = year;
      if (taxType) where.taxType = taxType;
      if (status) where.status = status;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [
        totalAmount,
        totalPaid,
        totalPending,
        totalOverdue,
        totalLateFees,
        totalInterest,
        countByStatus,
        countByType,
        countByYear,
        overdueAmount,
        upcomingDueAmount,
        nextDueDate,
      ] = await Promise.all([
        ctx.db.taxRecord.aggregate({
          where,
          _sum: { amount: true },
        }),
        ctx.db.taxRecord.aggregate({
          where: { ...where, paid: true },
          _sum: { amount: true },
        }),
        ctx.db.taxRecord.aggregate({
          where: { ...where, status: "PENDING" },
          _sum: { amount: true },
        }),
        ctx.db.taxRecord.aggregate({
          where: { ...where, status: "OVERDUE" },
          _sum: { amount: true },
        }),
        ctx.db.taxRecord.aggregate({
          where,
          _sum: { lateFees: true },
        }),
        ctx.db.taxRecord.aggregate({
          where,
          _sum: { interestRate: true },
        }),
        ctx.db.taxRecord.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        ctx.db.taxRecord.groupBy({
          by: ['taxType'],
          where,
          _count: true,
        }),
        ctx.db.taxRecord.groupBy({
          by: ['year'],
          where,
          _count: true,
        }),
        ctx.db.taxRecord.aggregate({
          where: { 
            ...where, 
            dueDate: { lt: new Date() },
            paid: false 
          },
          _sum: { amount: true },
        }),
        ctx.db.taxRecord.aggregate({
          where: { 
            ...where, 
            dueDate: { 
              gte: new Date(),
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
            },
            paid: false 
          },
          _sum: { amount: true },
        }),
        ctx.db.taxRecord.findFirst({
          where: { 
            ...where, 
            dueDate: { gte: new Date() },
            paid: false 
          },
          orderBy: { dueDate: 'asc' },
          select: { dueDate: true }
        }),
      ]);

      const total = totalAmount._sum.amount ?? 0;
      const paid = totalPaid._sum.amount ?? 0;
      const pending = totalPending._sum.amount ?? 0;
      const overdue = totalOverdue._sum.amount ?? 0;
      const lateFees = totalLateFees._sum.lateFees ?? 0;
      const interest = totalInterest._sum.interestRate ?? 0;
      const overdueAmountTotal = overdueAmount._sum.amount ?? 0;
      const upcomingAmount = upcomingDueAmount._sum.amount ?? 0;

      return {
        totalAmount: total,
        totalPaid: paid,
        totalPending: pending,
        totalOverdue: overdue,
        totalLateFees: lateFees,
        totalInterest: interest,
        countByStatus: Object.fromEntries(
          countByStatus.map(item => [item.status, item._count])
        ),
        countByType: Object.fromEntries(
          countByType.map(item => [item.taxType, item._count])
        ),
        countByYear: Object.fromEntries(
          countByYear.map(item => [item.year.toString(), item._count])
        ),
        averageAmount: total > 0 ? total / (countByStatus.reduce((sum, item) => sum + item._count, 0)) : 0,
        overdueAmount: overdueAmountTotal,
        upcomingDueAmount: upcomingAmount,
        nextDueDate: nextDueDate?.dueDate ?? null,
      };
    }),

  report: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
      propertyId: z.string().optional(),
      clientId: z.string().uuid().optional(),
      format: z.enum(["PDF", "CSV", "JSON"]).default("JSON")
    }))
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, propertyId, clientId, format } = input;

      const where = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(propertyId && { propertyId }),
        ...(clientId && { clientId }),
      };

      const [records, summary] = await Promise.all([
        ctx.db.taxRecord.findMany({
          where,
          include: {
            Property: true,
            Client: true,
            CreatedBy: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        ctx.db.taxRecord.aggregate({
          where,
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      const report = {
        period: { startDate, endDate },
        summary: {
          totalAmount: summary._sum.amount ?? 0,
          totalRecords: summary._count,
          averageAmount: summary._count > 0 ? (summary._sum.amount ?? 0) / summary._count : 0,
        },
        records,
        generatedAt: new Date(),
        generatedBy: ctx.session.user.id,
        format,
      };

      return report;
    }),

  overdue: protectedProcedure
    .input(z.object({
      propertyId: z.string().optional(),
      daysOverdue: z.number().int().min(1).default(30),
    }))
    .query(async ({ ctx, input }) => {
      const { propertyId, daysOverdue } = input;
      const cutoffDate = new Date(Date.now() - daysOverdue * 24 * 60 * 60 * 1000);

      const where = {
        dueDate: { lt: cutoffDate },
        paid: false,
        ...(propertyId && { propertyId }),
      };

      const records = await ctx.db.taxRecord.findMany({
        where,
        include: {
          Property: true,
          Client: true,
        },
        orderBy: { dueDate: 'asc' },
      });

      return records;
    }),

  upcoming: protectedProcedure
    .input(z.object({
      propertyId: z.string().optional(),
      daysAhead: z.number().int().min(1).default(30),
    }))
    .query(async ({ ctx, input }) => {
      const { propertyId, daysAhead } = input;
      const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

      const where = {
        dueDate: { 
          gte: new Date(),
          lte: futureDate,
        },
        paid: false,
        ...(propertyId && { propertyId }),
      };

      const records = await ctx.db.taxRecord.findMany({
        where,
        include: {
          Property: true,
          Client: true,
        },
        orderBy: { dueDate: 'asc' },
      });

      return records;
    }),

  reminders: protectedProcedure
    .input(z.object({
      propertyId: z.string().optional(),
      daysAhead: z.number().int().min(1).default(7),
    }))
    .mutation(async ({ ctx, input }) => {
      const { propertyId, daysAhead } = input;
      const reminderDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

      const where = {
        dueDate: { 
          gte: new Date(),
          lte: reminderDate,
        },
        paid: false,
        reminderSent: false,
        ...(propertyId && { propertyId }),
      };

      const records = await ctx.db.taxRecord.findMany({
        where,
        include: {
          Property: true,
          Client: true,
        },
      });

      // Update reminder status
      const updatedRecords = await Promise.all(
        records.map(record =>
          ctx.db.taxRecord.update({
            where: { id: record.id },
            data: {
              reminderSent: true,
              reminderDate: new Date(),
              updatedById: ctx.session.user.id,
            },
          })
        )
      );

      return {
        records: updatedRecords,
        count: updatedRecords.length,
        reminderDate: new Date(),
      };
    }),
});

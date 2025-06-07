import type { Agency } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  AgencyFilterSchema,
  CreateAgencySchema,
  UpdateAgencySchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

const QuerySchema = AgencyFilterSchema.extend({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

type QueryInput = z.infer<typeof QuerySchema>;

// Define types for JSON fields
type AgencySettings = Partial<{
  theme: string;
  logo: string;
  customDomain: string;
  defaultLanguage: string;
  defaultCurrency: string;
  defaultTimezone: string;
  defaultDateFormat: string;
  defaultTimeFormat: string;
  defaultNumberFormat: string;
  defaultCountry: string;
  defaultState: string;
  defaultCity: string;
  defaultZipCode: string;
  defaultAddress: string;
  defaultPhone: string;
  defaultEmail: string;
  defaultWebsite: string;
  defaultFacebook: string;
  defaultTwitter: string;
  defaultInstagram: string;
  defaultLinkedin: string;
  defaultYoutube: string;
  defaultPinterest: string;
  defaultTiktok: string;
  defaultSnapchat: string;
  defaultWhatsapp: string;
  defaultTelegram: string;
  defaultSkype: string;
  defaultViber: string;
  defaultLine: string;
  defaultWechat: string;
  defaultKakao: string;
  defaultVk: string;
  defaultOk: string;
  defaultQq: string;
  defaultWeibo: string;
}>;

type AgencyIntegration = Partial<{
  provider: string;
  config: Record<string, string | number | boolean | null>;
  enabled: boolean;
}>;

// Utility to sanitize agency data
function sanitizeAgency(agency: Agency | null): Agency | null {
  if (!agency) return null;

  let settings: AgencySettings | null = null;
  let integration: AgencyIntegration | null = null;

  if (typeof agency.settings === "object" && agency.settings !== null) {
    settings = agency.settings as AgencySettings;
  }

  if (typeof agency.integration === "object" && agency.integration !== null) {
    integration = agency.integration as AgencyIntegration;
  }

  return {
    ...agency,
    settings,
    integration,
  };
}

export const agencyRouter = {
  all: protectedProcedure
    .input(QuerySchema.optional())
    .query(async ({ ctx, input }) => {
      const safeInput: QueryInput | Record<string, never> = input ?? {};
      const { skip, take, page, limit } = getPaginationParams(safeInput);
      const cacheKey = `agencies:${page}:${limit}`;

      return await withCacheAndFormat(cacheKey, async () => {
        const searchTerm = input?.search?.toLowerCase();
        const searchQuery = searchTerm
          ? {
              search: searchTerm,
            }
          : undefined;

        const emailTerm = input?.email;
        const emailQuery = emailTerm
          ? {
              email: emailTerm,
            }
          : undefined;

        const active = input?.isActive;
        const owner = input?.ownerId;
        const deleted = input?.hasDeleted;

        const dateFrom = input?.createdFrom;
        const dateTo = input?.createdTo;

        const where = {
          ...searchQuery,
          ...emailQuery,
          isActive: active,
          ownerId: owner,
          deletedAt: deleted ? undefined : null,
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
        };

        const [agencies, total] = await Promise.all([
          ctx.db.agency.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              _count: {
                select: {
                  Agent: true,
                },
              },
            },
          }),
          ctx.db.agency.count({ where }),
        ]);

        return {
          data: agencies.map(sanitizeAgency),
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const agency = await ctx.db.agency.findFirst({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              Agent: true,
              Property: true,
            },
          },
        },
      });

      return sanitizeAgency(agency);
    }),

  create: protectedProcedure
    .input(CreateAgencySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const agency = await ctx.db.agency.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            status: input.status ?? "PENDING",
            updatedAt: new Date(),
          },
        });
        return sanitizeAgency(agency);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create agency: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateAgencySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input as { id: string; [key: string]: unknown };
      try {
        const agency = await ctx.db.agency.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        });
        return sanitizeAgency(agency);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to update agency: ${err.message}`);
        }
        throw err;
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const agency = await ctx.db.agency.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return sanitizeAgency(agency);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new Error("Agency not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;

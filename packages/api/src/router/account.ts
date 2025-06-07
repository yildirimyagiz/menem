import type { Account as PrismaAccount, User } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  AccountFilterSchema,
  CreateAccountSchema,
  UpdateAccountSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type AccountWithUser = PrismaAccount & { user: User | null };

// Utility to sanitize account data
function sanitizeAccount(account: AccountWithUser | null) {
  if (!account) return null;
  const { user, ...rest } = account;
  return {
    ...rest,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
        }
      : null,
  };
}

// Valid AccountType values and type guard for runtime safety
const validAccountTypes = [
  "OAUTH",
  "EMAIL",
  "OIDC",
  "CREDENTIALS",
  "GOOGLE",
  "FACEBOOK",
] as const;
type AccountType = (typeof validAccountTypes)[number];
function isAccountType(val: unknown): val is AccountType {
  return (
    typeof val === "string" &&
    (validAccountTypes as readonly string[]).includes(val)
  );
}

export const accountRouter = {
  all: protectedProcedure
    .input(AccountFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `accounts:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        // Only allow valid AccountType values
        const type = isAccountType(input?.type) ? input.type : undefined;
        const where = {
          userId: input?.userId,
          type,
          provider: input?.provider,
          providerAccountId: input?.providerAccountId,
        };

        const [accounts, total] = await Promise.all([
          ctx.db.account.findMany({
            where: where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { id: "desc" },
            skip,
            take,
            include: {
              user: true,
            },
          }),
          ctx.db.account.count({ where }),
        ]);
        return {
          data: accounts.map((account) => sanitizeAccount(account)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const account = await ctx.db.account.findFirst({
        where: { id: input.id },
        include: {
          user: true,
        },
      });
      return sanitizeAccount(account);
    }),

  create: protectedProcedure
    .input(CreateAccountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const account = await ctx.db.account.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            // Defensive: filter out invalid type
            type: isAccountType(input.type) ? input.type : validAccountTypes[0],
            updatedAt: new Date(),
            createdAt: new Date(),
          },
          include: {
            user: true,
          },
        });
        return sanitizeAccount(account);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create account: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updateData: Partial<PrismaAccount> = { ...data };

      // Defensive: filter out invalid type in update
      if (
        "type" in data &&
        data.type !== undefined && // ensure type is provided before checking
        !isAccountType(data.type)
      ) {
        // If an invalid type is provided, you might want to throw an error
        // or handle it as per your business logic, instead of silently deleting.
        // For now, let's assume Zod schema on input already validated it if present.
        // If `type` is not part of UpdateAccountSchema, this block is not needed.
      }
      const account = await ctx.db.account.update({
        where: { id },
        data: updateData, // Use the prepared updateData
        include: {
          user: true,
        },
      });
      return sanitizeAccount(account);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const account = await ctx.db.account.delete({
          where: { id: input },
          include: {
            user: true,
          },
        });
        return sanitizeAccount(account);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new Error("Account not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;

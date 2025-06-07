import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { invalidateSessionToken } from "@acme/auth";
import { db } from "@acme/db";
import { CreateUserSchema } from "@acme/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }

    // Delete all related accounts
    await db.account.deleteMany({ where: { userId } });

    // Delete the user
    await db.user.delete({ where: { id: userId } });

    // Invalidate session token if present
    if (ctx.token) {
      await invalidateSessionToken(ctx.token);
    }

    return { success: true };
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
  signUp: publicProcedure
    .input(
      CreateUserSchema.extend({
        password: z.string().min(6, "Password must be at least 6 characters"),
        phone: z.string().optional(),
        userName: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      // Map frontend fields to backend and clean up data for Prisma
      const { userName, phone, password, agencyId, ...rest } = input;
      const data: any = {
        ...rest,
        username: userName ?? input.username,
        phoneNumber: phone ?? input.phoneNumber,
      };
      // Remove undefined fields
      Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
      // Remove userName and agencyId if present
      delete data.userName;
      delete data.agencyId;
      // Handle agency relation
      if (agencyId) {
        data.Agency = { connect: { id: agencyId } };
      }

      // Check if user exists by email or phone
      // Build OR conditions for Prisma
      const orConditions: { email?: string; phoneNumber?: string }[] = [{ email: data.email }];
      if (data.phoneNumber) {
        orConditions.push({ phoneNumber: data.phoneNumber });
      }
      const existingUser = await db.user.findFirst({
        where: {
          OR: orConditions,
        },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists with this email or phone.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create the user (without password)
      const user = await db.user.create({
        data,
      });

      // Create the credentials Account
      await db.account.create({
        data: {
          userId: user.id,
          type: "CREDENTIALS",
          provider: "credentials",
          providerAccountId: user.id, // or user.email if unique
          refresh_token: null,
          id_token: null,
          token_type: null,
          scope: null,
          expires_at: null,
          session_state: null,
          access_token: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { success: true, userId: user.id };
    }),

  getUserById: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return user;
    }),
} satisfies TRPCRouterRecord;

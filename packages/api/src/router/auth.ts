import { invalidateSessionToken } from "@reservatior/auth";
import { db } from "@reservatior/db";
import { CreateUserSchema } from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

import { protectedProcedure, publicProcedure } from "../trpc";
import { createJWT } from "../utils/jwt";

// Google login is now handled by NextAuth.js. Do not import google-auth-library here.

export const authRouter = {
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({ where: { email: input.email } });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      // Find credentials account
      const account = await db.account.findFirst({
        where: { userId: user.id, provider: "credentials" },
      });
      if (!account) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No credentials account",
        });
      }
      // Compare password
      const valid = await bcrypt.compare(
        input.password,
        account.access_token ?? "",
      );
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }
      // Issue JWT
      const token = createJWT({ userId: user.id });
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    // protectedProcedure guarantees session and user exist
    const userId = ctx.session.user.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
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
      // Map frontend fields to backend and build a typed Prisma payload
      const { userName, phone, agencyId, ...rest } = input;
      const username = userName ?? input.username;
      const phoneNumber = phone ?? input.phoneNumber;
      const emailForCheck = rest.email;
      const phoneForCheck = phoneNumber;

      const userData: Prisma.UserCreateInput = {
        email: rest.email,
        ...(rest.name ? { name: rest.name } : {}),
        ...(username ? { username } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(rest.preferences !== undefined
          ? { preferences: rest.preferences as unknown as Prisma.InputJsonValue }
          : {}),
        ...(agencyId
          ? ({ Agency: { connect: { id: agencyId } } } as unknown as Pick<
              Prisma.UserCreateInput,
              "Agency"
            >)
          : {}),
      };

      // Check if user exists by email or phone
      // Build OR conditions for Prisma
      const orConditions: { email?: string; phoneNumber?: string }[] = [
        { email: emailForCheck },
      ];
      if (phoneForCheck) {
        orConditions.push({ phoneNumber: phoneForCheck });
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
        data: userData,
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

      // Issue JWT
      const token = createJWT({ userId: user.id });
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          // ...any other fields you want to expose
        },
      };
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
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return user;
    }),
};

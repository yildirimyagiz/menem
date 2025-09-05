import { randomUUID } from "crypto";
import type {
  Account,
  AccountType,
  Agency,
  Agent,
  Analytics,
  CommunicationLog,
  Currency,
  ExtraCharge,
  Facility,
  Hashtag,
  IncludedService,
  Mention,
  Notification,
  Offer,
  Permission,
  Photo,
  Post,
  Prisma,
  User as PrismaUser,
  Property,
  Reservation,
  Review,
  Role,
  Session,
  Subscription,
  Task,
  Tenant,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserFilterSchema,
} from "@reservatior/validators";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type UserWithIncludes = Omit<PrismaUser, "responseTime"> & {
  Agency?: Agency | null;
  Account?: Account[];
  Analytics?: Analytics[];
  CommunicationLog?: CommunicationLog[];
  Hashtag?: Hashtag[];
  MentionsByUser?: Mention[];
  MentionsToUser?: Mention[];
  MentionsGenericUser?: Mention[];
  createdEvents?: Event[];
  attendingEvents?: Event[];
  Notification?: Notification[];
  Offer?: Offer[];
  Photo?: Photo[];
  Post?: Post[];
  Reservation?: Reservation[];
  Review?: Review[];
  Session?: Session[];
  TasksAssigned?: Task[];
  TasksCreated?: Task[];
  Tenant?: Tenant | null;
  OwnedAgencies?: Agency[];
  Permission?: Permission[];
  OwnedProperties?: Property[];
  ListedProperties?: Property[];
  PurchasedProperties?: Property[];
  Facility?: Facility | null;
  IncludedService?: IncludedService | null;
  ExtraCharge?: ExtraCharge | null;
  Agent?: Agent[];
  Subscription?: Subscription[];
  responseTime?: string | null;
  Currency?: Currency | null;
};

const sanitizeUser = (user: UserWithIncludes | null) => {
  if (!user) return null;

  return {
    ...user,
    // Ensure responseTime is properly typed as string | null
    responseTime: user.responseTime ?? null,
    // Handle all relations with null/array fallbacks
    Agency: user.Agency ?? null,
    Account: user.Account ?? [],
    Analytics: user.Analytics ?? [],
    CommunicationLog: user.CommunicationLog ?? [],
    Hashtag: user.Hashtag ?? [],
    MentionsByUser: user.MentionsByUser ?? [],
    MentionsToUser: user.MentionsToUser ?? [],
    MentionsGenericUser: user.MentionsGenericUser ?? [],
    Notification: user.Notification ?? [],
    Offer: user.Offer ?? [],
    Photo: user.Photo ?? [],
    Post: user.Post ?? [],
    Reservation: user.Reservation ?? [],
    Review: user.Review ?? [],
    Session: user.Session ?? [],
    TasksAssigned: user.TasksAssigned ?? [],
    TasksCreated: user.TasksCreated ?? [],
    Tenant: user.Tenant ?? null,
    Permission: user.Permission ?? [],
    OwnedAgencies: user.OwnedAgencies ?? [],
    OwnedProperties: user.OwnedProperties ?? [],
    ListedProperties: user.ListedProperties ?? [],
    PurchasedProperties: user.PurchasedProperties ?? [],
    Facility: user.Facility ?? null,
    IncludedService: user.IncludedService ?? null,
    ExtraCharge: user.ExtraCharge ?? null,
    Agent: user.Agent ?? [],
    Subscription: user.Subscription ?? [],
    Currency: user.Currency ?? null,
  };
};

export const userRouter = {
  all: protectedProcedure
    .input(UserFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `users:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          email: input?.email ? { contains: input.email } : undefined,
          username: input?.username ? { contains: input.username } : undefined,
          role: input?.role ? { equals: input.role as Role } : undefined,
          isActive: input?.isActive,
          agencyId: input?.agencyId ?? undefined,
          createdAt:
            input?.createdAtFrom || input?.createdAtTo
              ? {
                  gte: input.createdAtFrom,
                  lte: input.createdAtTo,
                }
              : undefined,
          lastLogin:
            input?.lastLoginFrom || input?.lastLoginTo
              ? {
                  gte: input.lastLoginFrom,
                  lte: input.lastLoginTo,
                }
              : undefined,
          deletedAt: input?.deletedAt,
        };

        const [users, total] = await Promise.all([
          ctx.db.user.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agency: true,
              Account: true,
              Analytics: true,
              CommunicationLog: true,
              Hashtag: true,
              Notification: true,
              Offer: true,
              Photo: true,
              Post: true,
              Reservation: true,
              Review: true,
              Session: true,
              Tenant: true,
              Permission: true,
              Currency: true,
            },
          }),
          ctx.db.user.count({ where }),
        ]);
        const sanitizedUsers = users.map((user: UserWithIncludes | null) =>
          sanitizeUser(user),
        );
        const totalPages = Math.ceil(total / limit);

        return {
          data: sanitizedUsers,
          page,
          limit,
          total,
          totalPages,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: input.id },
        include: {
          Agency: true,
          Account: true,
          Analytics: true,
          CommunicationLog: true,
          Hashtag: true,
          MentionsByUser: true,
          MentionsToUser: true,
          MentionsGenericUser: true,
          Notification: true,
          Offer: true,
          Photo: true,
          Post: true,
          Reservation: true,
          Review: true,
          Session: true,
          TasksAssigned: true,
          Tenant: true,
          Permission: true,
          Currency: true,
        },
      });
      return sanitizeUser(user);
    }),

  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { responseTime, ...userData } = input;
        const createData: Prisma.UserCreateInput = {
          ...userData,
          id: randomUUID(),
          role: "USER" as Role,
          type: "EMAIL" as AccountType,
          preferences: input.preferences
            ? (input.preferences as Prisma.InputJsonValue)
            : undefined,
          updatedAt: new Date(),
        };

        // Handle responseTime with proper type checking
        if (typeof responseTime === "string") {
          createData.responseTime = responseTime;
        }

        // Handle agency relation
        if (input.agencyId) {
          createData.Agency = { connect: { id: input.agencyId } };
        }

        const user = await ctx.db.user.create({
          data: createData,
          include: {
            Agency: true,
            Account: true,
            Analytics: true,
            CommunicationLog: true,
            Hashtag: true,
            MentionsByUser: true,
            MentionsToUser: true,
            MentionsGenericUser: true,
            Notification: true,
            Offer: true,
            Photo: true,
            Post: true,
            Reservation: true,
            Review: true,
            Session: true,
            TasksAssigned: true,
            Tenant: true,
            Permission: true,
            OwnedAgencies: true,
            OwnedProperties: true,
            ListedProperties: true,
            PurchasedProperties: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Agent: true,
            Subscription: true,
            Currency: true,
          },
        });
        return sanitizeUser(user);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create user: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, responseTime, agencyId, ...data } = input;

      // Create base update data with proper typing
      const updateData: Prisma.UserUpdateInput = {
        ...data,
        role: data.role ? { set: data.role as Role } : undefined,
        type: data.type ? { set: data.type as AccountType } : undefined,
        preferences: data.preferences
          ? (data.preferences as Prisma.InputJsonValue)
          : undefined,
        updatedAt: new Date(),
      };

      // Handle agencyId separately using connect/disconnect pattern
      if (agencyId !== undefined) {
        updateData.Agency = agencyId
          ? { connect: { id: agencyId } }
          : { disconnect: true };
      }

      // Handle responseTime separately to ensure correct typing
      if (responseTime === null) {
        updateData.responseTime = null;
      } else if (typeof responseTime === "string") {
        updateData.responseTime = responseTime;
      }

      const user = await ctx.db.user.update({
        where: { id },
        data: updateData,
        include: {
          Agency: true,
          Account: true,
          Analytics: true,
          CommunicationLog: true,
          Hashtag: true,
          MentionsByUser: true,
          MentionsToUser: true,
          MentionsGenericUser: true,
          Notification: true,
          Offer: true,
          Photo: true,
          Post: true,
          Reservation: true,
          Review: true,
          Session: true,
          TasksAssigned: true,
          Tenant: true,
          Permission: true,
          Currency: true,
        },
      });
      return sanitizeUser(user);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.delete({
          where: { id: input },
          include: {
            Agency: true,
            Account: true,
            Analytics: true,
            CommunicationLog: true,
            Hashtag: true,
            MentionsByUser: true,
            MentionsToUser: true,
            MentionsGenericUser: true,
            Notification: true,
            Offer: true,
            Photo: true,
            Post: true,
            Reservation: true,
            Review: true,
            Session: true,
            TasksAssigned: true,
            Tenant: true,
            Permission: true,
            OwnedAgencies: true,
            OwnedProperties: true,
            ListedProperties: true,
            PurchasedProperties: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Agent: true,
            Subscription: true,
            Currency: true,
          },
        });
        return sanitizeUser(user);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          (error as unknown as { code: string }).code === "P2025"
        ) {
          throw new Error("User not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;

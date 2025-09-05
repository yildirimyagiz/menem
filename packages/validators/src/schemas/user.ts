import { z } from "zod";

// Prisma-aligned enums for User Role and Account Type
export const RoleEnum = z.enum([
  "USER",
  "ADMIN",
  "SUPER_ADMIN",
  "AGENCY",
  "AGENCY_ADMIN",
  "AGENT_ADMIN",
  "AGENT",
  "SELLER",
  "BUYER",
  "GUEST",
  "TENANT",
  "MODERATOR",
  "FACILITY_MANAGER",
]);

export type Role = z.infer<typeof RoleEnum>;

export const UserStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export type UserStatus = z.infer<typeof UserStatusEnum>;

export const AccountTypeEnum = z.enum([
  "OAUTH",
  "EMAIL",
  "OIDC",
  "CREDENTIALS",
  "GOOGLE",
  "FACEBOOK",
]);

export type AccountType = z.infer<typeof AccountTypeEnum>;

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  displayName: z.string().nullable(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  profilePicture: z.string().nullable(),
  image: z.string().nullable(),
  language: z.array(z.any()).optional(),
  role: RoleEnum.default("USER"),
  type: AccountTypeEnum.default("OAUTH"),
  isActive: z.boolean().default(true),
  lastLogin: z.date().nullable(),
  emailVerified: z.date().nullable(),
  responseTime: z.string().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  locale: z.string().nullable(),
  timezone: z.string().nullable(),
  preferences: z.record(z.unknown()).nullable(),
  agencyId: z.string().nullable(),
  status: UserStatusEnum.default("ACTIVE"),
  lastSeen: z.date().nullable(),
  isOnline: z.boolean().nullable(),
  currencyId: z.string().nullable(),
  Currency: z.any().optional(),

  // Ticket relations
  ticketsCreated: z.array(z.any()).optional(),
  ticketsAssigned: z.array(z.any()).optional(),

  // Core relations
  Account: z.array(z.any()).optional(),
  Analytics: z.array(z.any()).optional(),
  CommunicationLog: z.array(z.any()).optional(),
  Hashtag: z.array(z.any()).optional(),
  MentionsByUser: z.array(z.any()).optional(),
  MentionsToUser: z.array(z.any()).optional(),
  MentionsGenericUser: z.array(z.any()).optional(),
  createdEvents: z.array(z.any()).optional(),
  attendingEvents: z.array(z.any()).optional(),
  Subscription: z.array(z.any()).optional(),
  Notification: z.array(z.any()).optional(),
  Offer: z.array(z.any()).optional(),
  Photo: z.array(z.any()).optional(),
  Post: z.array(z.any()).optional(),
  Reservation: z.array(z.any()).optional(),
  Review: z.array(z.any()).optional(),
  Session: z.array(z.any()).optional(),
  TasksAssigned: z.array(z.any()).optional(),
  TasksCreated: z.array(z.any()).optional(),
  Tenant: z.any().optional(),
  Agency: z.any().optional(),
  OwnedAgencies: z.array(z.any()).optional(),
  Permission: z.array(z.any()).optional(),
  OwnedProperties: z.array(z.any()).optional(),
  ListedProperties: z.array(z.any()).optional(),
  PurchasedProperties: z.array(z.any()).optional(),
  Facility: z.any().optional(),
  facilityId: z.string().nullable(),
  IncludedService: z.any().optional(),
  includedServiceId: z.string().nullable(),
  ExtraCharge: z.any().optional(),
  extraChargeId: z.string().nullable(),
  Agent: z.array(z.any()).optional(),
  Location: z.any().optional(),
  locationId: z.string().nullable(),
  Favorite: z.array(z.any()).optional(),
  Report: z.array(z.any()).optional(),

  // TaxRecord relations
  TaxRecordsAsClient: z.array(z.any()).optional(),
  TaxRecordsCreated: z.array(z.any()).optional(),
  TaxRecordsUpdated: z.array(z.any()).optional(),
});

// Create User Schema
export const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profilePicture: z.string().optional(),
  image: z.string().optional(),
  role: RoleEnum.default("USER"),
  type: AccountTypeEnum.default("OAUTH"),
  isActive: z.boolean().default(true),
  responseTime: z.string().optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  preferences: z.record(z.unknown()).optional(),
  agencyId: z.string().optional(),
  status: UserStatusEnum.default("ACTIVE"),
  currencyId: z.string().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
  locationId: z.string().optional(),
});

// Update User Schema
export const UpdateUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profilePicture: z.string().optional(),
  image: z.string().optional(),
  role: RoleEnum.optional(),
  type: AccountTypeEnum.optional(),
  status: UserStatusEnum.optional(),
  isActive: z.boolean().optional(),
  lastLogin: z.date().optional(),
  emailVerified: z.date().optional(),
  responseTime: z.string().optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  preferences: z.record(z.unknown()).optional(),
  deletedAt: z.date().optional(),
  agencyId: z.string().optional(),
  currencyId: z.string().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
  locationId: z.string().optional(),
  lastSeen: z.date().optional(),
  isOnline: z.boolean().optional(),
});

// User Filter Schema
export const UserFilterSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  role: RoleEnum.optional(),
  type: AccountTypeEnum.optional(),
  status: UserStatusEnum.optional(),
  isActive: z.boolean().optional(),
  agencyId: z.string().optional(),
  currencyId: z.string().optional(),
  facilityId: z.string().optional(),
  locationId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  lastLoginFrom: z.date().optional(),
  lastLoginTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "email", "username", "lastLogin"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

// Zod Type Inference for TypeScript
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserFilterInput = z.infer<typeof UserFilterSchema>;

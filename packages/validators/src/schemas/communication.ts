import { z } from "zod";

// CommunicationType enum to match Prisma model
export const CommunicationTypeEnum = z.enum([
  "PROBLEM",
  "REQUEST",
  "ADVICE",
  "INFORMATION",
  "FEEDBACK",
]);

export const CommunicationMetadataSchema = z
  .object({
    senderName: z.string().optional(),
    senderAvatar: z.string().url().optional(),
    isStaff: z.boolean().optional(),
    agencyId: z.string().optional(),
    attachments: z
      .array(
        z.object({
          id: z.string(),
          type: z.enum(["image", "file", "link"]),
          url: z.string().url(),
          name: z.string().optional(),
          size: z.number().optional(),
          mimeType: z.string().optional(),
        }),
      )
      .optional(),
    // Only extensible fields here, all core fields are in the main model
  })
  .optional();

export const CreateCommunicationSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  type: CommunicationTypeEnum,
  content: z.string().min(1, "Message content is required"),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  metadata: CommunicationMetadataSchema.optional(),
  agencyId: z.string().optional(),
  userId: z.string().optional(),
  threadId: z.string().optional(),
  replyToId: z.string().optional(),
  isRead: z.boolean().optional(),
  readAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  deletedAt: z.date().optional(),
  timestamp: z.date().optional(),
  channelId: z.string().optional(),
  ticketId: z.string().optional(),
});

export const UpdateCommunicationSchema = z.object({
  id: z.string(),
  isRead: z.boolean().optional(),
  readAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  deletedAt: z.date().optional(),
  timestamp: z.date().optional(),
  metadata: CommunicationMetadataSchema.optional(),
  threadId: z.string().optional(),
  replyToId: z.string().optional(),
  channelId: z.string().optional(),
  ticketId: z.string().optional(),
});

// Base schemas for related entities
const BaseAgencySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const BaseUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

const BaseChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const BaseTicketSchema = z.object({
  id: z.string(),
  title: z.string(),
});

// Forward declaration for recursive type
const BaseCommunicationSchema = z.object({
  id: z.string(),
  content: z.string(),
});

export const CommunicationSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  type: CommunicationTypeEnum,
  content: z.string(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  metadata: CommunicationMetadataSchema.optional(),
  isRead: z.boolean(),
  readAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  deletedAt: z.date().optional(),
  timestamp: z.date(),
  userId: z.string().optional(),
  agencyId: z.string().optional(),
  threadId: z.string().optional(),
  replyToId: z.string().optional(),
  channelId: z.string().optional(),
  ticketId: z.string().optional(),
  Agency: BaseAgencySchema.optional(),
  User: BaseUserSchema.optional(),
  replyTo: BaseCommunicationSchema.optional(),
  replies: z.array(BaseCommunicationSchema).optional(),
  Channel: BaseChannelSchema.optional(),
  Ticket: BaseTicketSchema.optional(),
});

export type Communication = z.infer<typeof CommunicationSchema>;
export type CreateCommunicationInput = z.infer<
  typeof CreateCommunicationSchema
>;
export type UpdateCommunicationInput = z.infer<
  typeof UpdateCommunicationSchema
>;
export type CommunicationMetadata = z.infer<typeof CommunicationMetadataSchema>;

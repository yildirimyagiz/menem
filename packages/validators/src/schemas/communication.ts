import { z } from "zod";

// CommunicationType enum to match Prisma model
export const CommunicationTypeEnum = z.enum([
  "PROBLEM",
  "REQUEST",
  "ADVICE",
  "INFORMATION",
  "FEEDBACK",
  "CHAT",
  "SYSTEM",
]);

/**
 * Communication Metadata Schema
 * Extensible metadata for communication (sender info, attachments, etc).
 */
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
    // Extensible fields for future-proofing
    extra: z.record(z.unknown()).optional(),
  })
  .optional();

/**
 * Create Communication Input
 * Used for creating a new communication/message.
 */
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
  isEdited: z.boolean().optional(),
  editedAt: z.date().optional(),
  deletedById: z.string().optional(),
  reactions: z.record(z.array(z.string())).optional(),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        url: z.string(),
        name: z.string().optional(),
        size: z.number().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional(),
  readBy: z
    .array(
      z.object({
        userId: z.string(),
        readAt: z.date(),
      }),
    )
    .optional(),
  receipts: z
    .array(
      z.object({
        userId: z.string(),
        deliveredAt: z.date().optional(),
        readAt: z.date().optional(),
      }),
    )
    .optional(),
});

/**
 * Update Communication Input
 * Used for updating a communication (e.g., marking as read).
 */
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
  isEdited: z.boolean().optional(),
  editedAt: z.date().optional(),
  deletedById: z.string().optional(),
  reactions: z.record(z.array(z.string())).optional(),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        url: z.string(),
        name: z.string().optional(),
        size: z.number().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional(),
  readBy: z
    .array(
      z.object({
        userId: z.string(),
        readAt: z.date(),
      }),
    )
    .optional(),
  receipts: z
    .array(
      z.object({
        userId: z.string(),
        deliveredAt: z.date().optional(),
        readAt: z.date().optional(),
      }),
    )
    .optional(),
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

/**
 * Communication Schema
 * Represents a message or communication, with support for threads, replies, and receipts.
 */
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
  // Delivery/read receipts
  receipts: z
    .array(
      z.object({
        userId: z.string(),
        deliveredAt: z.date().optional(),
        readAt: z.date().optional(),
      }),
    )
    .optional(),
  isEdited: z.boolean().optional(),
  editedAt: z.date().optional(),
  deletedById: z.string().optional(),
  reactions: z.record(z.array(z.string())).optional(),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        url: z.string(),
        name: z.string().optional(),
        size: z.number().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional(),
  readBy: z
    .array(
      z.object({
        userId: z.string(),
        readAt: z.date(),
      }),
    )
    .optional(),
});

// Zod Type Inference for TypeScript
export type Communication = z.infer<typeof CommunicationSchema>;
export type CreateCommunicationInput = z.infer<
  typeof CreateCommunicationSchema
>;
export type UpdateCommunicationInput = z.infer<
  typeof UpdateCommunicationSchema
>;
export type CommunicationMetadata = z.infer<typeof CommunicationMetadataSchema>;

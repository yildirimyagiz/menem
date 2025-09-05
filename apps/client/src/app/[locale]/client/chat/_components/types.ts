import type { User } from "~/utils/interfaces";

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
}

export interface ChatMessage {
  isRead: boolean;
  id: string;
  senderId: string;
  receiverId: string;
  type:
    | "PROBLEM"
    | "REQUEST"
    | "ADVICE"
    | "INFORMATION"
    | "FEEDBACK"
    | "CHAT"
    | "SYSTEM";
  content: string;
  timestamp: Date | string;
  user: User | null;
  metadata?: {
    senderName?: string;
    senderAvatar?: string;
    isStaff?: boolean;
    agencyId?: string;
    attachments?: {
      id: string;
      type: "image" | "file" | "link";
      url: string;
      name?: string;
      size?: number;
      mimeType?: string;
    }[];
    extra?: Record<string, unknown>;
  };
  entityId?: string;
  entityType?: string;
  agencyId?: string;
  userId?: string;
  threadId?: string;
  replyToId?: string;
  readAt?: Date | string;
  deliveredAt?: Date | string;
  deletedAt?: Date | string;
  channelId?: string;
  ticketId?: string;
}

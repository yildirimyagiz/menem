import type { CommunicationType } from "~/utils/interfaces";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "tenant" | "owner" | "property_manager" | "support";
  status: "online" | "offline" | "away";
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: CommunicationType;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  readAt?: Date;
  deliveredAt?: Date;
  deletedAt?: Date | null;
  timestamp: Date;
  userId?: string;
  agencyId?: string;
  threadId?: string;
  replyToId?: string;
  metadata?: Record<string, unknown>;
  sender?: User;
  agency?: {
    id: string;
    name: string;
    logo: string;
  } | null;
}

export interface Conversation {
  id: string; // threadId in our model
  participants: string[];
  title: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  type: "direct" | "support" | "group";
  status: "active" | "archived" | "deleted";
  metadata?: Record<string, unknown>;
}

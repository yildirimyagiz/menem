import type { User } from "~/utils/interfaces";

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  type: string;
  content: string;
  timestamp: Date | string;
  user: User | null;
  // ...other backend fields as needed
}

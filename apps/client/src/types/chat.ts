import type { User } from "~/utils/interfaces";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  type: string;
  content: string;
  timestamp: Date | string;
  user: User | null;
  isRead?: boolean;
  isEdited?: boolean;
  editHistory?: { content: string; timestamp: Date }[];
  reactions?: {
    id: string;
    emoji: string;
    userId: string;
    userName: string;
    timestamp: Date;
  }[];
  replyTo?: ChatMessage | null;
  // Additional fields from the API
  userId?: string;
  entityId?: string | null;
  entityType?: string | null;
  threadId?: string | null;
  channelId?: string | null;
  replyToId?: string | null;
  metadata?: any;
  agency?: {
    id: string;
    name: string;
    logo: string;
  } | null;
}

export interface Conversation {
  id: string;
  user: User;
  messages: ChatMessage[];
  lastMessage?: string;
  unreadCount: number;
  active: boolean;
}

export interface SendMessageParams {
  content: string;
  receiverId: string;
  threadId?: string;
  type?: string;
  entityId?: string;
  entityType?: string;
  channelId?: string;
  replyToId?: string;
  metadata?: any;
  // Guest user fields
  name?: string;
  email?: string;
}

export interface EditMessageParams {
  messageId: string;
  content: string;
}

export interface DeleteMessageParams {
  messageId: string;
}

export interface AddReactionParams {
  messageId: string;
  emoji: string;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  threadId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  displayName: string;
  agencyId: string;
  online: boolean;
  agency?: {
    id: string;
    name: string;
    logoUrl: string;
  } | null;
}

export interface ConversationStats {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  unreadCount: number;
  averageResponseTime: number | null;
}

export interface ChatApi {
  getMessages: {
    invalidate: any;
    useQuery: (params: { 
      threadId?: string; 
      otherUserId?: string;
      limit?: number;
      page?: number;
      search?: string;
      messageType?: "all" | "text" | "media" | "file";
      dateFrom?: Date;
      dateTo?: Date;
    }) => {
      data: { 
        data: ChatMessage[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      } | undefined;
      error: Error | null;
      isLoading: boolean;
      invalidate: () => Promise<void>;
    };
  };
  sendMessage: {
    useMutation: (options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      mutateAsync: (params: SendMessageParams) => Promise<ChatMessage>;
      status: "idle" | "loading" | "success" | "error";
      isLoading: boolean;
    };
  };
  editMessage: {
    useMutation: (options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      mutateAsync: (params: EditMessageParams) => Promise<ChatMessage>;
    };
  };
  deleteMessage: {
    useMutation: (options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      mutateAsync: (messageId: string) => Promise<ChatMessage>;
    };
  };
  addReaction: {
    useMutation: (options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      mutateAsync: (params: AddReactionParams) => Promise<ChatMessage>;
    };
  };
  getSupportAgents: {
    useQuery: (params?: {
      agencyId?: string;
      page?: number;
      limit?: number;
    }) => {
      data: {
        data: SupportAgent[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      } | undefined;
      error: Error | null;
      isLoading: boolean;
    };
  };
  getConversationStats: {
    useQuery: (params?: {
      threadId?: string;
      otherUserId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }) => {
      data: ConversationStats | undefined;
      error: Error | null;
      isLoading: boolean;
    };
  };
  markAllAsRead: {
    mutate: (params?: {
      senderId?: string;
      threadId?: string;
    }) => Promise<{ success: boolean }>;
  };
  updateTypingStatus: {
    useMutation: (options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      mutateAsync: (params: {
        threadId: string;
        isTyping: boolean;
      }) => Promise<{ success: boolean }>;
    };
  };
  onTyping: {
    useSubscription: (
      params: { threadId: string },
      options?: {
        enabled?: boolean;
        onData?: (data: TypingIndicator) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      data: TypingIndicator | undefined;
      error: Error | undefined;
    };
  };
  onMessage: {
    useSubscription: (
      params: { threadId: string },
      options?: {
        enabled?: boolean;
        onData?: (data: { message: ChatMessage }) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      data: { message: ChatMessage } | undefined;
      error: Error | undefined;
    };
  };
}

"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { CommunicationType } from "@reservatior/db";

import { env } from "~/env";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export interface ChatMessage {
  id: string;
  content: string;
  type: CommunicationType;
  senderId: string;
  receiverId: string;
  threadId?: string;
  isRead: boolean;
  timestamp: Date;
  metadata?: {
    senderName?: string;
    senderAvatar?: string;
    isStaff?: boolean;
  };
}

export interface ChatSupportAgent {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  title: string;
  agencyId: string;
}

interface ChatContextType {
  isChatOpen: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  supportAgents: ChatSupportAgent[];
  activeSupportAgent: ChatSupportAgent | null;
  socket: WebSocket | null;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (
    content: string,
    receiverId: string,
    threadId?: string,
    asAdmin?: boolean
  ) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isAdmin: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.isAdmin === true;

  const { toast } = useToast();
  const t = useTranslations("Chat");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [supportAgents, setSupportAgents] = useState<ChatSupportAgent[]>([]);
  const [activeSupportAgent, _setActiveSupportAgent] =
    useState<ChatSupportAgent | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!session?.user) return;

    // Use the env variable, or fallback to ws://localhost:2999
    const wsUrl = new URL(
      env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:2999",
    ).toString();
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Send presence message when connected
      ws.send(
        JSON.stringify({
          type: "presence",
          senderId: session.user.id,
          content: "online",
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Type guard for base shape
        if (
          typeof data !== "object" ||
          data === null ||
          typeof data.type !== "string"
        )
          return;
        // Type guard helpers
        const isChatMessage = (msg: unknown): msg is ChatMessage =>
          !!msg &&
          typeof msg === "object" &&
          typeof (msg as any).id === "string" &&
          typeof (msg as any).content === "string";
        switch (data.type) {
          case "message":
            if (isChatMessage(data.message)) {
              setMessages((prev) => [...prev, data.message as ChatMessage]);
              if (
                data.message.receiverId === session?.user?.id &&
                !data.message.isRead
              ) {
                setUnreadCount((prev) => prev + 1);
              }
            }
            break;
          case "typing":
            // Handle typing indicators
            break;
          case "presence": {
            const userId =
              typeof data.userId === "string" ? data.userId : undefined;
            const status =
              typeof data.status === "string" ? data.status : undefined;
            if (userId && status) {
              setSupportAgents((prev) =>
                prev.map((agent) =>
                  agent.id === userId
                    ? { ...agent, status: status as ChatSupportAgent["status"] }
                    : agent,
                ),
              );
            }
            break;
          }
          case "read": {
            const threadId =
              typeof data.threadId === "string" ? data.threadId : undefined;
            if (threadId && session?.user?.id) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.threadId === threadId && msg.senderId === session.user.id
                    ? { ...msg, isRead: true }
                    : msg,
                ),
              );
            }
            break;
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      // Only log WebSocket errors in development, don't show toast for connection issues
      if (process.env.NODE_ENV === "development") {
        console.log("WebSocket connection error (development mode):", error);
      }
    };

    ws.onclose = () => {
      // Only log WebSocket close in development
      if (process.env.NODE_ENV === "development") {
        console.log("WebSocket connection closed (development mode)");
      }
      setSocket(null);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [session?.user, t, toast]);

  // Fetch initial messages and support agents using hooks at the top level
  const messagesQuery = (api.chat?.getMessages as any)?.useQuery?.({
    limit: 50,
  }) ?? { data: undefined, isLoading: false, error: null };
  const agentsQuery = (api.chat?.getSupportAgents as any)?.useQuery?.() ?? {
    data: undefined,
    isLoading: false,
    error: null,
  };

  useEffect(() => {
    if (!session?.user) return;
    if (messagesQuery.data && agentsQuery.data) {
      const messages = messagesQuery.data;
      const agents = agentsQuery.data;
      const validMessages =
        messagesQuery.data?.items
          ?.filter((msg: null): msg is NonNullable<typeof msg> => msg !== null)
          .map(
            (msg: {
              threadId: any;
              metadata:
                | {
                    senderName?: string;
                    senderAvatar?: string;
                    isStaff?: boolean;
                  }
                | undefined;
            }) => ({
              ...msg,
              threadId: msg.threadId ?? undefined,
              metadata: msg.metadata as ChatMessage["metadata"],
            }),
          ) ?? [];

      setMessages(validMessages as ChatMessage[]);

      const rawAgents = agentsQuery.data;
      const validAgents = Array.isArray(rawAgents)
        ? rawAgents.map((agent) => ({
            id: agent.id,
            name: agent.displayName ?? agent.name,
            avatar: agent.avatar,
            status: "online" as const,
            title: agent.role,
            agencyId: agent.agencyId,
          }))
        : [];

      setUnreadCount(
        validMessages.filter(
          (msg: { isRead: any; receiverId: string }) =>
            !msg.isRead && msg.receiverId === session.user.id,
        ).length,
      );
    }
  }, [session?.user, messagesQuery.data, agentsQuery.data]);

  // Mutation hooks (must be top-level)
  const sendMessageMutation = (
    api.chat?.sendMessage as any
  )?.useMutation?.() ?? { mutateAsync: async () => {} };
  const markAllAsReadMutation = (
    api.chat?.markAllAsRead as any
  )?.useMutation?.() ?? { mutateAsync: async () => {} };

  // Mark all messages as read
  const markAllAsRead = async () => {
    if (!session?.user || unreadCount === 0) return;

    try {
      await markAllAsReadMutation.mutateAsync();
      setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    void markAllAsRead();
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen((prev: boolean) => !prev);
    if (!isChatOpen) {
      void markAllAsRead();
    }
  };

  const sendMessage = async (
    content: string,
    receiverId: string,
    threadId?: string,
  ) => {
    if (!session?.user || !content.trim()) return;

    try {
      // Send through WebSocket for real-time delivery
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "message",
            content,
            senderId: session.user.id,
            receiverId,
            threadId: threadId ?? receiverId,
          }),
        );
      }

      // Also send via tRPC for persistence
      await sendMessageMutation.mutateAsync({
        content,
        receiverId,
        senderId: session.user.id,
        type: "PROBLEM",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: t("error"),
        description: t("messageSendError"),
        variant: "destructive",
      });
    }
  };

  const value = {
    isChatOpen,
    unreadCount,
    messages,
    supportAgents,
    activeSupportAgent,
    socket,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    markAllAsRead,
    isAdmin,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

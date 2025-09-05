"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Filter, MessageSquare, Plus, Search, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { ScrollArea } from "@reservatior/ui/scroll-area";
import { Separator } from "@reservatior/ui/separator";

import { useAuth } from "~/hooks/use-auth";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  type: string;
  isRead: boolean;
  timestamp: Date | string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    senderName?: string;
    senderAvatar?: string;
    isStaff?: boolean;
  };
  channelId?: string;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage?: ChatMessage;
  unreadCount: number;
  isActive: boolean;
}

export default function ChatPage() {
  const t = useTranslations("Chat");
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "agents">(
    "all",
  );
  const messageEndRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();

  // Fetch channels
  const { data: channelsData, isLoading: channelsLoading } = (
    api.channel as any
  )?.list?.useQuery?.() ?? { data: [], isLoading: false };
  const channels = Array.isArray(channelsData?.data) ? channelsData.data : [];

  // Fetch messages for selected channel or conversation
  const { data: messagesData, isLoading: messagesLoading } = (
    api.chat as any
  )?.getMessages?.useQuery?.(
    selectedChannel
      ? { channelId: selectedChannel, limit: 100 }
      : { limit: 100 },
  ) ?? { data: undefined, isLoading: false };

  // Fetch support agents with proper error handling
  const { data: agentsData } = (api.chat as any)?.getSupportAgents?.useQuery?.({
    limit: 50,
  }) ?? { data: undefined };

  // Type guard for messages
  const isChatMessage = (msg: unknown): msg is ChatMessage => {
    if (!msg || typeof msg !== "object") return false;
    const message = msg as Record<string, unknown>;
    return (
      typeof message.id === "string" &&
      typeof message.content === "string" &&
      typeof message.senderId === "string" &&
      typeof message.receiverId === "string" &&
      typeof message.type === "string" &&
      typeof message.isRead === "boolean" &&
      (typeof message.timestamp === "string" ||
        message.timestamp instanceof Date)
    );
  };

  // Process messages safely
  const messages: ChatMessage[] = useMemo(() => {
    if (!messagesData?.data) return [];
    return (messagesData.data as unknown[])
      .filter((msg): msg is ChatMessage => isChatMessage(msg))
      .map((msg) => ({
        ...msg,
        timestamp:
          typeof msg.timestamp === "string"
            ? new Date(msg.timestamp)
            : msg.timestamp,
      }));
  }, [messagesData]);

  // Group messages into conversations
  const conversations: Conversation[] = useMemo(() => {
    if (!user?.id || !messages.length) return [];

    const conversationMap = new Map<string, Conversation>();

    messages.forEach((message) => {
      // Determine the other user in the conversation
      const otherUserId =
        message.senderId === user.id ? message.receiverId : message.senderId;

      if (!conversationMap.has(otherUserId)) {
        // Find user info from message or agents
        const userInfo = message.user ||
          (agentsData?.data as any[])?.find(
            (agent: any) => agent.id === otherUserId,
          ) || {
            id: otherUserId,
            name: "Unknown User",
          };

        conversationMap.set(otherUserId, {
          id: otherUserId,
          user: {
            id: userInfo.id,
            name: userInfo.name || "Unknown User",
            avatar: userInfo.avatar || "",
          },
          lastMessage: message,
          unreadCount: 0,
          isActive: false,
        });
      }

      const conversation = conversationMap.get(otherUserId)!;

      // Update last message if this one is newer
      if (
        !conversation.lastMessage ||
        new Date(message.timestamp) >
          new Date(conversation.lastMessage.timestamp)
      ) {
        conversation.lastMessage = message;
      }

      // Count unread messages
      if (!message.isRead && message.receiverId === user.id) {
        conversation.unreadCount++;
      }
    });

    return Array.from(conversationMap.values()).sort((a, b) => {
      // Sort by unread count first, then by last message timestamp
      if (a.unreadCount !== b.unreadCount) {
        return b.unreadCount - a.unreadCount;
      }
      if (a.lastMessage && b.lastMessage) {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      }
      return 0;
    });
  }, [messages, user?.id, agentsData]);

  // Filter conversations based on search and filter
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (conv) =>
          conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.lastMessage?.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply type filter
    switch (filterType) {
      case "unread":
        filtered = filtered.filter((conv) => conv.unreadCount > 0);
        break;
      case "agents":
        filtered = filtered.filter((conv) =>
          (agentsData?.data as any[])?.some(
            (agent: any) => agent.id === conv.user.id,
          ),
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [conversations, searchTerm, filterType, agentsData]);

  // Get messages for selected conversation
  const selectedConversationMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages
      .filter(
        (msg) =>
          (msg.senderId === selectedConversation &&
            msg.receiverId === user?.id) ||
          (msg.senderId === user?.id &&
            msg.receiverId === selectedConversation),
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }, [messages, selectedConversation, user?.id]);

  // Send message mutation with proper error handling
  const sendMessage = (api.chat as any)?.sendMessage?.useMutation?.({
    onSuccess: async () => {
      await (utils.chat as any)?.getMessages?.invalidate?.();
      setMessageText("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message",
      });
    },
  }) ?? { mutateAsync: async () => {}, isPending: false };

  // Mark messages as read mutation with proper error handling
  const markAsRead = (api.chat as any)?.markAllAsRead?.useMutation?.({
    onSuccess: async () => {
      await (utils.chat as any)?.getMessages?.invalidate?.();
    },
  }) ?? { mutate: async () => {} };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user?.id) return;

    await sendMessage.mutateAsync({
      senderId: user.id,
      receiverId: selectedConversation,
      content: messageText.trim(),
      type: "CHAT",
    });
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark messages as read when selecting conversation
    markAsRead.mutate({ senderId: conversationId });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversationMessages.length]);

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // When displaying messages, use only those for the selected channel
  const selectedChannelMessages = useMemo(() => {
    if (!selectedChannel) return [];
    return messages.filter((msg) => msg.channelId === selectedChannel);
  }, [messages, selectedChannel]);

  if (messagesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r bg-background">
        <div className="border-b p-4">
          <h2 className="mb-4 text-lg font-semibold">Messages</h2>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-1">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("unread")}
              >
                Unread
              </Button>
              <Button
                variant={filterType === "agents" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("agents")}
              >
                Agents
              </Button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-2">
            {filteredConversations.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`cursor-pointer rounded-lg p-3 transition-colors ${
                    selectedConversation === conversation.id
                      ? "border border-primary/20 bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.user.avatar} />
                      <AvatarFallback>
                        {getUserInitials(conversation.user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium">
                          {conversation.user.name}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>

                      {conversation.lastMessage && (
                        <p className="truncate text-sm text-muted-foreground">
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 border-r bg-background">
        <div className="border-b p-4">
          <h2 className="mb-4 text-lg font-semibold">Channels</h2>
          <div className="space-y-2">
            {channels.map((channel: any) => (
              <div
                key={channel.id}
                className={`cursor-pointer rounded-lg p-2 transition-colors ${selectedChannel === channel.id ? "border border-primary/20 bg-primary/10" : "hover:bg-muted/50"}`}
                onClick={() => setSelectedChannel(channel.id)}
              >
                <div className="font-medium">{channel.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b bg-background p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      filteredConversations.find(
                        (c) => c.id === selectedConversation,
                      )?.user.avatar
                    }
                  />
                  <AvatarFallback>
                    {getUserInitials(
                      filteredConversations.find(
                        (c) => c.id === selectedConversation,
                      )?.user.name || "",
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {
                      filteredConversations.find(
                        (c) => c.id === selectedConversation,
                      )?.user.name
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversationMessages.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  selectedConversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.senderId === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t bg-background p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sendMessage.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendMessage.isPending}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Select a conversation
              </h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@reservatior/ui/button";
import { ScrollArea } from "@reservatior/ui/scroll-area";

import { useAuth } from "~/hooks/use-auth";
import { api } from "~/trpc/react";
import type { ChatMessage } from "~/types/chat";
import { EnhancedChatInput } from "./_components/EnhancedChatInput";
import { EnhancedConversationList } from "./_components/EnhancedConversationList";
import { MessageGroup } from "./_components/EnhancedMessageBubble";
import { TypingIndicator } from "./_components/TypingIndicator";

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    online?: boolean;
  };
  lastMessage?: {
    content: string;
    timestamp: Date | string;
  };
  unreadCount: number;
  active: boolean;
}

export default function EnhancedChatPage() {
  const _t = useTranslations("Chat");
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [_isTyping, _setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [_searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<"all" | "unread" | "online">("all");
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();

  // Fetch support agents for conversations
  const { data: agentsData, isLoading: agentsLoading } = (api as any).chat.getSupportAgents.useQuery({
    limit: 50,
  });

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading } = (api as any).chat.getMessages.useQuery({
    threadId: selectedConversation || undefined,
    limit: 100,
  }, {
    enabled: !!selectedConversation,
  });

  // Fetch conversation statistics
  const { data: statsData } = (api as any).chat.getConversationStats.useQuery({
    threadId: selectedConversation || undefined,
  }, {
    enabled: !!selectedConversation,
  });

  // Real-time subscriptions
  const typingSubscription = (api as any).chat.onTyping.useSubscription(
    { threadId: selectedConversation || "" },
    {
      enabled: !!selectedConversation,
      onData: (data: any) => {
        if (data.isTyping) {
          setTypingUsers(prev => new Set(prev).add(data.userName));
        } else {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userName);
            return newSet;
          });
        }
      },
      onError: (error: any) => {
        console.error("Typing subscription error:", error);
      },
    }
  );

  // Convert agents to conversations
  const conversations: Conversation[] = useMemo(() => {
    console.log("agentsData:", agentsData);
    console.log("agentsData?.data:", agentsData?.data);
    console.log("agentsData?.data type:", typeof agentsData?.data);
    console.log("agentsData?.data is array:", Array.isArray(agentsData?.data));
    
    if (!agentsData?.data) {
      console.log("No agents data available");
      return [];
    }

    if (!Array.isArray(agentsData.data)) {
      console.error("agentsData.data is not an array:", agentsData.data);
      return [];
    }

    if (agentsData.data.length === 0) {
      console.log("No agents found in database");
      // Return some mock agents for testing if no real agents exist
      return [
        {
          id: "mock-agent-1",
          user: {
            id: "mock-agent-1",
            name: "Support Agent 1",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            online: true,
          },
          lastMessage: undefined,
          unreadCount: 0,
          active: selectedConversation === "mock-agent-1",
        },
        {
          id: "mock-agent-2",
          user: {
            id: "mock-agent-2",
            name: "Support Agent 2",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            online: false,
          },
          lastMessage: undefined,
          unreadCount: 0,
          active: selectedConversation === "mock-agent-2",
        },
      ];
    }

    return agentsData.data.map((agent) => ({
      id: agent.id,
      user: {
        id: agent.id,
        name: agent.displayName || agent.name,
        avatar: agent.avatar,
        online: agent.online || false,
      },
      lastMessage: undefined, // Will be populated from messages
      unreadCount: 0, // Will be calculated from stats
      active: selectedConversation === agent.id,
    }));
  }, [agentsData?.data, selectedConversation]);

  // Process messages from API
  const messages: ChatMessage[] = useMemo(() => {
    if (!messagesData?.data) return [];
    
    // Sort messages by timestamp (oldest first)
    return messagesData.data
      .filter((msg): msg is ChatMessage => msg !== null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messagesData?.data]);

  // Group messages by sender for better display
  const groupedMessages = useMemo(() => {
    const groups: ChatMessage[][] = [];
    let currentGroup: ChatMessage[] = [];
    let currentSender: string | null = null;

    messages.forEach((message) => {
      if (message.senderId !== currentSender) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [message];
        currentSender = message.senderId;
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setReplyTo(null);
    
    // Mark messages as read when selecting conversation
    if (user?.id) {
      (api as any).chat.markAllAsRead.mutate({
        senderId: conversationId,
        threadId: conversationId,
      });
    }
  };

  // Message mutations
  const sendMessageMutation = (api as any).chat.sendMessage.useMutation({
    onSuccess: () => {
      (api as any).chat.getMessages.invalidate();
      setReplyTo(null);
      toast.success("Message sent!");
    },
    onError: (error: any) => {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    },
  });

  const editMessageMutation = (api as any).chat.editMessage.useMutation({
    onSuccess: () => {
      (api as any).chat.getMessages.invalidate();
      toast.success("Message updated!");
    },
    onError: (error: any) => {
      console.error("Failed to edit message:", error);
      toast.error("Failed to update message. Please try again.");
    },
  });

  const deleteMessageMutation = (api as any).chat.deleteMessage.useMutation({
    onSuccess: () => {
      (api as any).chat.getMessages.invalidate();
      toast.success("Message deleted!");
    },
    onError: (error: any) => {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message. Please try again.");
    },
  });

  const addReactionMutation = (api as any).chat.addReaction.useMutation({
    onSuccess: () => {
      (api as any).chat.getMessages.invalidate();
    },
    onError: (error: any) => {
      console.error("Failed to add reaction:", error);
      toast.error("Failed to add reaction. Please try again.");
    },
  });

  const updateTypingMutation = (api as any).chat.updateTypingStatus.useMutation();

  // Handle message sending
  const handleSendMessage = async (content: string, type: "text" | "file" | "voice" = "text") => {
    if (!selectedConversation || !user) return;

    try {
      await sendMessageMutation.mutateAsync({
        content,
        receiverId: selectedConversation,
        threadId: selectedConversation,
        type: "PROBLEM", // Default type
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle message actions
  const handleReply = (message: ChatMessage) => {
    setReplyTo(message);
  };

  const handleEdit = async (message: ChatMessage) => {
    const newContent = prompt("Edit message:", message.content);
    if (newContent && newContent.trim() && newContent !== message.content) {
      try {
        await editMessageMutation.mutateAsync({
          messageId: message.id,
          content: newContent.trim(),
        });
      } catch (error) {
        console.error("Error editing message:", error);
      }
    }
  };

  const handleDelete = async (message: ChatMessage) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await deleteMessageMutation.mutateAsync(message.id);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleForward = (message: ChatMessage) => {
    // TODO: Implement message forwarding
    console.log("Forward message:", message);
    toast.info("Forward functionality coming soon!");
  };

  const handleReaction = async (message: ChatMessage, emoji: string) => {
    try {
      await addReactionMutation.mutateAsync({
        messageId: message.id,
        emoji,
      });
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  // Handle typing indicator
  const handleTyping = async (isTyping: boolean) => {
    if (!selectedConversation) return;
    
    try {
      await updateTypingMutation.mutateAsync({
        threadId: selectedConversation,
        isTyping,
      });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  // Loading state
  if (agentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List */}
      <div className="w-80 border-r bg-white">
        <EnhancedConversationList
          conversations={conversations}
          activeConversationId={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onSearch={setSearchQuery}
          onFilterChange={setCurrentFilter}
          currentFilter={currentFilter}
          isLoading={agentsLoading}
          onNewConversation={() => {
            // TODO: Implement new conversation
            console.log("New conversation");
            toast.info("New conversation functionality coming soon!");
          }}
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedConversationData?.user.avatar}
                    alt={selectedConversationData?.user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {selectedConversationData?.user.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversationData?.user.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversationData?.user.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  📞
                </Button>
                <Button variant="ghost" size="sm">
                  📹
                </Button>
                <Button variant="ghost" size="sm">
                  ⚙️
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                      <p className="text-sm text-muted-foreground">Loading messages...</p>
                    </div>
                  </div>
                ) : groupedMessages.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="mb-4 h-16 w-16 rounded-full bg-muted/50 mx-auto" />
                      <h3 className="text-lg font-semibold text-gray-900">No messages yet</h3>
                      <p className="text-sm text-muted-foreground">Start a conversation to see messages here</p>
                    </div>
                  </div>
                ) : (
                  groupedMessages.map((group, groupIndex) => (
                    <MessageGroup
                      key={`${group[0]?.senderId}-${groupIndex}`}
                      messages={group}
                      currentUserId={user?.id || ""}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onForward={handleForward}
                      onReaction={handleReaction}
                    />
                  ))
                )}
                
                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <TypingIndicator />
                  </div>
                )}
                
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <EnhancedChatInput
              onSend={handleSendMessage}
              onTyping={handleTyping}
              disabled={sendMessageMutation.isLoading}
              replyTo={replyTo ? {
                message: replyTo.content,
                sender: replyTo.user?.name || "Unknown",
                onCancel: () => setReplyTo(null),
              } : null}
              placeholder="Type a message..."
              maxLength={1000}
              showFormatting={true}
              showEmoji={true}
              showFileUpload={true}
              showVoiceMessage={true}
            />
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-muted/50 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                Select a conversation
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
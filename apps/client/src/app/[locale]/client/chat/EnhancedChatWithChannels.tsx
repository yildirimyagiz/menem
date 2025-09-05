"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Bell, Hash, MessageCircle, Phone, Search, Send, Settings, Tag, Users, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@reservatior/ui/badge";
import { Input } from "@reservatior/ui/input";
import { ScrollArea } from "@reservatior/ui/scroll-area";

import { useAuth } from "~/hooks/use-auth";
import { api } from "~/trpc/react";
import type { ChatMessage } from "~/types/chat";
import { NotificationPanel } from "./_components/NotificationPanel";

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
  type: "conversation" | "channel";
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: "PUBLIC" | "PRIVATE" | "GROUP";
  createdAt: Date;
  updatedAt: Date;
  memberCount?: number;
  unreadCount?: number;
}

// Enhanced Message Parsing Utilities
const parseMessageContent = (content: string) => {
  const hashtags = content.match(/#[\w]+/g) ?? [];
  const mentions = content.match(/@[\w]+/g) ?? [];
  
  return {
    hashtags: hashtags.map(tag => tag.slice(1)), // Remove # symbol
    mentions: mentions.map(mention => mention.slice(1)), // Remove @ symbol
    hasHashtags: hashtags.length > 0,
    hasMentions: mentions.length > 0,
  };
};

const highlightMessageContent = (content: string) => {
  return content
    .replace(/(#[\w]+)/g, '<span class="text-blue-600 font-semibold">$1</span>')
    .replace(/(@[\w]+)/g, '<span class="text-purple-600 font-semibold">$1</span>');
};

// Aceternity UI Components
const GlassmorphismCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl ${className}`}
  >
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-600/5" />
    <div className="relative p-4">{children}</div>
  </motion.div>
);

const AnimatedAvatar = ({ src, alt, online, size = "md" }: { src: string; alt: string; online?: boolean; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white/20`}
      />
      {online && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"
        />
      )}
    </motion.div>
  );
};

const FloatingMessage = ({ children, isOwn, delay = 0 }: { children: React.ReactNode; isOwn: boolean; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
  >
    {children}
  </motion.div>
);

const MessageBubble = ({ content, timestamp, isOwn }: { 
  content: string; 
  timestamp: Date | string; 
  isOwn: boolean;
}) => {
  const parsedContent = parseMessageContent(content);
  
  return (
    <div
      className={`max-w-xs px-4 py-3 rounded-2xl ${
        isOwn
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
          : "bg-white/20 backdrop-blur-sm border border-white/30 text-gray-900"
      }`}
    >
      <div 
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: highlightMessageContent(content) }}
      />
      <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
        {new Date(timestamp).toLocaleTimeString()}
      </p>
      
      {/* Hashtags and Mentions Display */}
      {(parsedContent.hashtags.length > 0 || parsedContent.mentions.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {parsedContent.hashtags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isOwn 
                  ? "bg-blue-400/20 text-blue-100" 
                  : "bg-blue-100/50 text-blue-700"
              }`}
            >
              <Tag className="h-3 w-3" />
              #{tag}
            </span>
          ))}
          {parsedContent.mentions.map((mention, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isOwn 
                  ? "bg-purple-400/20 text-purple-100" 
                  : "bg-purple-100/50 text-purple-700"
              }`}
            >
              <AtSign className="h-3 w-3" />
              @{mention}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AnimatedTab = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className={`flex-1 px-4 py-3 text-sm font-medium relative ${
      active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </motion.button>
);

export default function EnhancedChatWithChannels() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"conversations" | "channels">("conversations");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Fetch channels
  const { data: channelsData, isLoading: channelsLoading } = api.channel.list.useQuery({
    page: 1,
    pageSize: 50,
  });

  // Fetch unread notification count
  const { data: unreadCountData } = api.notification.unreadCount.useQuery({
    userId: user?.id,
  });

  // Create notification mutation
  const createNotification = api.notification.create.useMutation();

  // Mock conversations for now
  const conversations: Conversation[] = useMemo(() => [
    {
      id: "agent-1",
      user: {
        id: "agent-1",
        name: "Support Agent 1",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        online: true,
      },
      lastMessage: {
        content: "How can I help you today?",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      unreadCount: 0,
      active: selectedConversation === "agent-1",
      type: "conversation",
    },
    {
      id: "agent-2",
      user: {
        id: "agent-2",
        name: "Support Agent 2",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        online: false,
      },
      lastMessage: {
        content: "I'll get back to you soon.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      unreadCount: 1,
      active: selectedConversation === "agent-2",
      type: "conversation",
    },
  ], [selectedConversation]);

  // Process channels data
  const channels: Channel[] = useMemo(() => {
    if (!channelsData?.data?.data) {
      return [];
    }

    const channelsArray = Array.isArray(channelsData.data.data) 
      ? channelsData.data.data 
      : [];

    return channelsArray.map((channel: any) => ({
      id: channel.id ?? "",
      name: channel.name ?? "",
      description: channel.description ?? "",
      category: channel.category ?? "GENERAL",
      type: channel.type ?? "PUBLIC",
      createdAt: new Date(channel.createdAt ?? Date.now()),
      updatedAt: new Date(channel.updatedAt ?? Date.now()),
      memberCount: channel.memberCount ?? 0,
      unreadCount: channel.unreadCount ?? 0,
    }));
  }, [channelsData]);

  // Enhanced messages with hashtags and mentions
  const messages = useMemo(() => [
    {
      id: "1",
      content: "Hello! How can I help you today? #support #welcome",
      senderId: "agent-1",
      receiverId: user?.id ?? "",
      type: "text" as const,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      user: {
        id: "agent-1",
        name: "Support Agent 1",
        email: "agent1@example.com",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      isRead: true,
    },
    {
      id: "2",
      content: "I need help with my property listing. @admin can you assist? #property #help",
      senderId: user?.id ?? "user",
      receiverId: "agent-1",
      type: "text" as const,
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      user: {
        id: user?.id ?? "user",
        name: user?.name ?? "You",
        email: user?.email ?? "user@example.com",
        image: user?.image ?? "",
      },
      isRead: true,
    },
    {
      id: "3",
      content: "Sure! I can help you with that. What specific issue are you facing? #support #assistance",
      senderId: "agent-1",
      receiverId: user?.id ?? "",
      type: "text" as const,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      user: {
        id: "agent-1",
        name: "Support Agent 1",
        email: "agent1@example.com",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      isRead: false,
    },
  ] as ChatMessage[], [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const selectedChannelData = channels.find(c => c.id === selectedChannel);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setSelectedChannel(null);
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setSelectedConversation(null);
  };

  // Enhanced message sending with notification creation
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const parsedContent = parseMessageContent(message);
      
      // Create notifications for mentions
      if (parsedContent.hasMentions && user?.id) {
        for (const mention of parsedContent.mentions) {
          try {
            // In a real implementation, you'd need to resolve the mention to a user ID
            // For now, we'll create a notification with the mention text
            await createNotification.mutateAsync({
              type: "MENTION",
              content: `${user?.name ?? 'Someone'} mentioned @${mention} in a chat: "${message}"`,
              userId: user.id, // The current user creating the notification
              entityId: selectedConversation ?? selectedChannel ?? "",
              entityType: selectedConversation ? "CONVERSATION" : "CHANNEL",
            });
          } catch (error) {
            console.error("Failed to create mention notification:", error);
            toast.error("Failed to create mention notification");
          }
        }
      }

      // Create notifications for hashtags (if needed)
      if (parsedContent.hasHashtags) {
        // You could create notifications for hashtag tracking here
        console.log("Hashtags found:", parsedContent.hashtags);
        
        // Create a system notification for hashtag tracking
        try {
          await createNotification.mutateAsync({
            type: "SYSTEM_UPDATE",
            content: `Hashtags used: ${parsedContent.hashtags.join(', ')}`,
            userId: user?.id ?? "",
            entityId: selectedConversation ?? selectedChannel ?? "",
            entityType: selectedConversation ? "CONVERSATION" : "CHANNEL",
          });
        } catch (error) {
          console.error("Failed to create hashtag notification:", error);
        }
      }

      // Mock message sending
      console.log("Sending message:", message);
      toast.success("Message sent!");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      GENERAL: "bg-blue-100 text-blue-800",
      SUPPORT: "bg-green-100 text-green-800",
      ANNOUNCEMENT: "bg-orange-100 text-orange-800",
      SYSTEM: "bg-gray-100 text-gray-800",
      REPORT: "bg-indigo-100 text-indigo-800",
      RESERVATION: "bg-pink-100 text-pink-800",
      TASK: "bg-yellow-100 text-yellow-800",
      TICKET: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <div className="flex h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950">
        {/* Enhanced Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 border-r border-blue-200/30 bg-white/80 backdrop-blur-sm"
        >
          {/* Enhanced Header */}
          <GlassmorphismCard className="border-b border-blue-200/30 rounded-none">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-blue-900">Chat & Channels</h2>
                <p className="text-sm text-blue-600">Connect with agents and communities</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <Input
                placeholder="Search conversations and channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-white/50 border-blue-200/50 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </GlassmorphismCard>

          {/* Enhanced Tabs */}
          <div className="flex border-b border-blue-200/30 bg-white/50">
            <AnimatedTab
              active={activeTab === "conversations"}
              onClick={() => setActiveTab("conversations")}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Conversations
              </div>
            </AnimatedTab>
            <AnimatedTab
              active={activeTab === "channels"}
              onClick={() => setActiveTab("channels")}
            >
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Channels
              </div>
            </AnimatedTab>
          </div>

          {/* Enhanced Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              <AnimatePresence mode="wait">
                {activeTab === "conversations" ? (
                  // Enhanced Conversations List
                  <motion.div
                    key="conversations"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-2"
                  >
                    {conversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                          conversation.active 
                            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-300/50 shadow-lg" 
                            : "hover:bg-white/50 border border-transparent hover:border-blue-200/50"
                        }`}
                        onClick={() => handleConversationSelect(conversation.id)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <AnimatedAvatar
                            src={conversation.user.avatar ?? ""}
                            alt={conversation.user.name}
                            online={conversation.user.online}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-blue-900 truncate">
                                {conversation.user.name}
                              </h3>
                              {conversation.unreadCount > 0 && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                                >
                                  {conversation.unreadCount}
                                </motion.span>
                              )}
                            </div>
                            {conversation.lastMessage && (
                              <p className="text-sm text-blue-600 truncate">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  // Enhanced Channels List
                  <motion.div
                    key="channels"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-2"
                  >
                    {channelsLoading ? (
                      <div className="text-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-sm text-blue-600">Loading channels...</p>
                      </div>
                    ) : channels.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mx-auto mb-4">
                          <Hash className="h-6 w-6" />
                        </div>
                        <p className="text-sm text-blue-600">No channels available</p>
                      </div>
                    ) : (
                      channels.map((channel, index) => (
                        <motion.div
                          key={channel.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                            selectedChannel === channel.id 
                              ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-300/50 shadow-lg" 
                              : "hover:bg-white/50 border border-transparent hover:border-blue-200/50"
                          }`}
                          onClick={() => handleChannelSelect(channel.id)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                              {channel.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-blue-900 truncate">
                                  {channel.name}
                                </h3>
                                {channel.unreadCount && channel.unreadCount > 0 && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                                  >
                                    {channel.unreadCount}
                                  </motion.span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${getCategoryColor(channel.category)} text-xs`}>
                                  {channel.category}
                                </Badge>
                                <Badge variant={channel.type === "PUBLIC" ? "default" : "secondary"} className="text-xs">
                                  {channel.type}
                                </Badge>
                                {channel.memberCount && (
                                  <span className="text-xs text-blue-600 flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {channel.memberCount}
                                  </span>
                                )}
                              </div>
                              {channel.description && (
                                <p className="text-sm text-blue-600 truncate mt-1">
                                  {channel.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </motion.div>

        {/* Enhanced Chat Area */}
        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {selectedConversation || selectedChannel ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex flex-1 flex-col"
              >
                {/* Enhanced Chat Header */}
                <GlassmorphismCard className="border-b border-blue-200/30 rounded-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedConversation ? (
                        // Enhanced Conversation header
                        <>
                          <AnimatedAvatar
                            src={selectedConversationData?.user.avatar ?? ""}
                            alt={selectedConversationData?.user.name ?? "Agent"}
                            online={selectedConversationData?.user.online}
                          />
                          <div>
                            <h2 className="font-semibold text-blue-900">
                              {selectedConversationData?.user.name}
                            </h2>
                            <p className="text-sm text-blue-600">
                              {selectedConversationData?.user.online ? "🟢 Online" : "⚫ Offline"}
                            </p>
                          </div>
                        </>
                      ) : (
                        // Enhanced Channel header
                        <>
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                            {selectedChannelData?.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h2 className="font-semibold text-blue-900">
                              {selectedChannelData?.name}
                            </h2>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getCategoryColor(selectedChannelData?.category ?? "")} text-xs`}>
                                {selectedChannelData?.category}
                              </Badge>
                              <Badge variant={selectedChannelData?.type === "PUBLIC" ? "default" : "secondary"} className="text-xs">
                                {selectedChannelData?.type}
                              </Badge>
                              {selectedChannelData?.memberCount && (
                                <span className="text-sm text-blue-600 flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {selectedChannelData.memberCount} members
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                      >
                        <Phone className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                      >
                        <Video className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                      >
                        <Settings className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsNotificationPanelOpen(true)}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 relative"
                      >
                        <Bell className="h-4 w-4" />
                        {unreadCountData?.count && unreadCountData.count > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                          >
                            {unreadCountData.count}
                          </motion.span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </GlassmorphismCard>

                {/* Enhanced Messages Area */}
                <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-blue-50/50 to-white/50">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((msg, index) => {
                        const parsedContent = parseMessageContent(msg.content);
                        return (
                          <FloatingMessage
                            key={msg.id}
                            isOwn={msg.senderId === user?.id}
                            delay={index * 0.1}
                          >
                            {msg.senderId !== user?.id && (
                              <AnimatedAvatar
                                src={msg.user?.image ?? ""}
                                alt={msg.user?.name ?? ""}
                                size="sm"
                              />
                            )}
                            <MessageBubble
                              content={msg.content}
                              timestamp={msg.timestamp}
                              isOwn={msg.senderId === user?.id}
                            />
                            {msg.senderId === user?.id && (
                              <AnimatedAvatar
                                src={msg.user?.image ?? ""}
                                alt={msg.user?.name ?? ""}
                                size="sm"
                              />
                            )}
                          </FloatingMessage>
                        );
                      })}
                    </AnimatePresence>
                    <div ref={messageEndRef} />
                  </div>
                </ScrollArea>

                {/* Enhanced Chat Input with Hashtag/Mention Suggestions */}
                <GlassmorphismCard className="border-t border-blue-200/30 rounded-none">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={`Type a message to ${selectedConversation ? "agent" : "channel"}... Use @ to mention or # for hashtags`}
                        className="w-full px-4 py-3 border border-blue-200/50 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-blue-900 placeholder-blue-400"
                      />
                      {/* Quick Action Buttons */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setMessage(prev => prev + " @")}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100"
                          title="Mention someone"
                        >
                          <AtSign className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setMessage(prev => prev + " #")}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100"
                          title="Add hashtag"
                        >
                          <Tag className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        message.trim()
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/25"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </motion.button>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            ) : (
              /* Enhanced Empty State */
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-xl"
                  >
                    <MessageCircle className="h-10 w-10" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-semibold text-blue-900 mb-2"
                  >
                    Select a conversation or channel
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-blue-600"
                  >
                    Choose from the list to start messaging
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        userId={user?.id}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </>
  );
} 
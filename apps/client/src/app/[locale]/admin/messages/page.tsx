"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle,
  Download,
  Paperclip,
  Plus,
  RefreshCw,
  Smile,
  Trash2,
  XCircle,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";

import type {
  ChatMessage,
  ChatUser,
} from "../../client/chat/_components/types";
import type { ChannelCategory, ChannelType } from "~/utils/interfaces";
import { toast } from "~/hooks/use-toast";
import Avatar from "~/shared/Avatar";
import { api as _api } from "~/trpc/react";
import { ChatMessageList } from "../../client/chat/_components/ChatMessageList";
import { ChatSidebar } from "../../client/chat/_components/ChatSidebar";
import { EnhancedChatMessage } from "../../client/chat/_components/EnhancedChatMessage";
import ChannelCreateModal from "../channels/components/ChannelCreateModal";

const api: any = _api;

// --- Emoji Picker (simple, replace with a real one for production) ---
const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "😎",
  "👍",
  "🙏",
  "🎉",
  "❤️",
  "🚀",
  "😡",
  "😢",
  "🤔",
  "👏",
  "🔥",
  "💡",
];

export default function AdminMessagesPage() {
  const t = useTranslations();
  // --- State ---
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [channelTypeFilter, setChannelTypeFilter] = useState<
    ChannelType | "all"
  >("all");
  const [channelCategoryFilter, setChannelCategoryFilter] = useState<
    ChannelCategory | "all"
  >("all");

  // --- Fetch channels ---
  const {
    data: channelsData,
    isLoading: channelsLoading,
    error: channelsError,
    refetch: refetchChannels,
  } = api.channel.list.useQuery({
    page: 1,
    pageSize: 100,
    name: searchTerm || undefined,
    type: channelTypeFilter !== "all" ? channelTypeFilter : undefined,
    category:
      channelCategoryFilter !== "all" ? channelCategoryFilter : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // --- Memoize channels for sidebar ---
  const channels = useMemo(() => {
    return (
      (channelsData?.data?.data as any[])?.map((ch: any) => ({
        id: ch.id,
        user: {
          id: ch.id,
          name: ch.name,
          avatar: undefined,
        },
        lastMessage: ch.lastMessage?.content || "",
        lastMessageTime: ch.lastMessage?.timestamp
          ? new Date(ch.lastMessage.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        unreadCount: ch.unreadCount || 0,
        type: ch.type,
        category: ch.category,
        active: selectedChannelId === ch.id,
        onClick: () => setSelectedChannelId(ch.id),
      })) || []
    );
  }, [channelsData, selectedChannelId]);

  // --- Fetch messages for selected channel ---
  // --- Fetch messages for selected channel (defensive, type-safe) ---
  const messagesQuery = api.chat.getMessages.useQuery(
    { threadId: selectedChannelId ?? undefined },
    { enabled: !!selectedChannelId },
  );
  const messagesData = messagesQuery.data;
  const messagesLoading = messagesQuery.isLoading;
  const messagesError = messagesQuery.error;
  const refetchMessages = messagesQuery.refetch;

  // --- Mutations (defensive, type-safe) ---
  const sendMessage = api.chat.sendMessage.useMutation();
  const deleteMessage = api.chat.deleteMessage.useMutation();
  const markAsRead = api.chat.markAsRead.useMutation();
  const markAllAsRead = api.chat.markAllAsRead.useMutation();

  // --- Handle send message ---
  const handleSend = async () => {
    if ((!messageInput.trim() && !file) || !selectedChannelId) return;
    try {
      // For file upload, you would use a real upload API. Here, just send text.
      await sendMessage.mutateAsync({
        channelId: selectedChannelId,
        content: messageInput,
        replyToId: replyTo?.id,
        // attachments: file ? [file] : undefined, // TODO: implement file upload
      });
      setMessageInput("");
      setReplyTo(null);
      setFile(null);
      setShowEmoji(false);
      refetchMessages();
      toast({ title: t('adminMessages.messageSent', { defaultValue: 'Message sent' }) });
    } catch (e) {
      toast({
        title: t('adminMessages.error', { defaultValue: 'Error' }),
        description: t('adminMessages.failedSendMessage', { defaultValue: 'Failed to send message' }),
        variant: "destructive",
      });
    }
  };

  // --- Handle delete message (admin action) ---
  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage.mutateAsync({ id });
      refetchMessages();
      toast({ title: t('adminMessages.messageDeleted', { defaultValue: 'Message deleted' }) });
    } catch (e) {
      toast({
        title: t('adminMessages.error', { defaultValue: 'Error' }),
        description: t('adminMessages.failedDeleteMessage', { defaultValue: 'Failed to delete message' }),
        variant: "destructive",
      });
    }
  };

  // --- Handle mark as read (admin action) ---
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync({ id });
      refetchMessages();
    } catch (e) {
      toast({
        title: t('adminMessages.error', { defaultValue: 'Error' }),
        description: t('adminMessages.failedMarkAsRead', { defaultValue: 'Failed to mark as read' }),
        variant: "destructive",
      });
    }
  };

  // --- Handle mark all as read ---
  const handleMarkAllAsRead = async () => {
    if (!selectedChannelId) return;
    try {
      await markAllAsRead.mutateAsync({ channelId: selectedChannelId });
      refetchMessages();
      toast({ title: t('adminMessages.allMarkedRead', { defaultValue: 'All messages marked as read' }) });
    } catch (e) {
      toast({
        title: t('adminMessages.error', { defaultValue: 'Error' }),
        description: t('adminMessages.failedMarkAllAsRead', { defaultValue: 'Failed to mark all as read' }),
        variant: "destructive",
      });
    }
  };

  // --- Handle reply ---
  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
  };

  // --- Handle emoji select ---
  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmoji(false);
  };

  // --- Handle file upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- Memoize messages ---
  const messages: ChatMessage[] = useMemo(() => {
    return messagesData?.data || [];
  }, [messagesData]);

  // --- Extract users from messages for user list ---
  const usersInChannel = useMemo(() => {
    const userMap = new Map();
    messages.forEach((msg) => {
      if (msg.user && !userMap.has(msg.user.id)) {
        userMap.set(msg.user.id, msg.user);
      }
    });
    return Array.from(userMap.values());
  }, [messages]);

  // --- Total unread for badge ---
  const totalUnread = useMemo(
    () => channels.reduce((sum: any, c: any) => sum + (c.unreadCount || 0), 0),
    [channels],
  );

  // --- Channel type/category options ---
  const TYPE_OPTIONS = [
    { value: "all", label: t('adminMessages.allTypes', { defaultValue: 'All Types' }) },
    { value: "PUBLIC", label: t('adminMessages.public', { defaultValue: 'Public' }) },
    { value: "PRIVATE", label: t('adminMessages.private', { defaultValue: 'Private' }) },
    { value: "GROUP", label: t('adminMessages.group', { defaultValue: 'Group' }) },
  ];
  const CATEGORY_OPTIONS = [
    { value: "all", label: t('adminMessages.allCategories', { defaultValue: 'All Categories' }) },
    { value: "AGENT", label: t('adminMessages.agent', { defaultValue: 'Agent' }) },
    { value: "AGENCY", label: t('adminMessages.agency', { defaultValue: 'Agency' }) },
    { value: "TENANT", label: t('adminMessages.tenant', { defaultValue: 'Tenant' }) },
    { value: "PROPERTY", label: t('adminMessages.property', { defaultValue: 'Property' }) },
    { value: "PAYMENT", label: t('adminMessages.payment', { defaultValue: 'Payment' }) },
    { value: "SYSTEM", label: t('adminMessages.system', { defaultValue: 'System' }) },
    { value: "REPORT", label: t('adminMessages.report', { defaultValue: 'Report' }) },
    { value: "RESERVATION", label: t('adminMessages.reservation', { defaultValue: 'Reservation' }) },
    { value: "TASK", label: t('adminMessages.task', { defaultValue: 'Task' }) },
    { value: "TICKET", label: t('adminMessages.ticket', { defaultValue: 'Ticket' }) },
  ];

  // --- UI ---
  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      {/* Sidebar: Channels */}
      <Card className="w-full max-w-xs flex-shrink-0 md:w-80">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-lg">{t('adminMessages.channels', { defaultValue: 'Channels' })}</CardTitle>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder={t('adminMessages.searchChannels', { defaultValue: 'Search channels...' })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <div className="mb-2 flex gap-2">
            <select
              className="rounded border px-2 py-1 text-sm"
              value={channelTypeFilter}
              onChange={(e) =>
                setChannelTypeFilter(e.target.value as ChannelType | "all")
              }
              aria-label={t('adminMessages.filterByType', { defaultValue: 'Filter by type' })}
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              className="rounded border px-2 py-1 text-sm"
              value={channelCategoryFilter}
              onChange={(e) =>
                setChannelCategoryFilter(
                  e.target.value as ChannelCategory | "all",
                )
              }
              aria-label={t('adminMessages.filterByCategory', { defaultValue: 'Filter by category' })}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-h-[20rem] flex-1 overflow-y-auto">
            {channelsLoading ? (
              <div className="p-6 text-center text-muted-foreground">
                {t('adminMessages.loadingChannels', { defaultValue: 'Loading channels...' })}
              </div>
            ) : channelsError ? (
              <div className="p-6 text-center text-red-500">
                {t('adminMessages.errorLoadingChannels', { defaultValue: 'Error loading channels' })}
              </div>
            ) : channels.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {t('adminMessages.noChannelsFound', { defaultValue: 'No channels found.' })}
              </div>
            ) : (
              channels.map((ch) => (
                <button
                  key={ch.id}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${ch.active ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-muted/60"}`}
                  onClick={ch.onClick}
                  tabIndex={0}
                  aria-label={`Open channel ${ch.user.name}`}
                >
                  <Avatar userName={ch.user.name} sizeClass="h-8 w-8 text-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-gray-900 group-hover:text-primary group-focus:text-primary">
                      {ch.user.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{ch.lastMessage}</span>
                      {ch.lastMessageTime && (
                        <span className="ml-auto">{ch.lastMessageTime}</span>
                      )}
                    </div>
                  </div>
                  {ch.unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white shadow">
                      {ch.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="mx-2 hidden w-px bg-muted/40 md:block" />

      {/* Main Chat Area */}
      <Card className="flex min-h-[32rem] flex-1 flex-col">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            {channelsData?.data?.data?.find(
              (c: any) => c.id === selectedChannelId,
            )?.name || "Channel"}
            {(() => {
              const ch = channelsData?.data?.data?.find(
                (c: any) => c.id === selectedChannelId,
              );
              return ch ? (
                <>
                  <Badge variant="outline" className="text-xs">
                    {t(`adminMessages.type.${ch.type?.toLowerCase?.() || ch.type}`, { defaultValue: ch.type })}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {t(`adminMessages.category.${ch.category?.toLowerCase?.() || ch.category}`, { defaultValue: ch.category })}
                  </Badge>
                </>
              ) : null;
            })()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={!selectedChannelId || messages.length === 0}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> {t('adminMessages.markAllAsRead', { defaultValue: 'Mark all as read' })}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchChannels();
                refetchMessages();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> {t('adminMessages.refresh', { defaultValue: 'Refresh' })}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: t('adminMessages.exportComingSoon', { defaultValue: 'Export coming soon' }) })}
            >
              <Download className="mr-2 h-4 w-4" /> {t('adminMessages.export', { defaultValue: 'Export' })}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-6 md:flex-row">
          {/* User List Panel */}
          <div className="hidden w-56 min-w-[12rem] max-w-xs flex-col gap-2 border-r pr-4 md:flex">
            <div className="mb-2 text-sm font-semibold">{t('adminMessages.usersInChannel', { defaultValue: 'Users in Channel' })}</div>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {usersInChannel.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  {t('adminMessages.noUsersYet', { defaultValue: 'No users yet.' })}
                </div>
              ) : (
                usersInChannel.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 rounded p-2 hover:bg-muted/40"
                  >
                    <Avatar
                      imgUrl={user.image || undefined}
                      userName={user.name || "U"}
                      sizeClass="h-8 w-8 text-sm"
                    />
                    <div className="truncate text-sm font-medium">
                      {user.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Panel */}
          <div className="flex min-h-[24rem] flex-1 flex-col">
            <div className="flex-1 overflow-y-auto pb-4">
              {messagesLoading ? (
                <div className="p-6 text-center text-muted-foreground">
                  {t('adminMessages.loadingMessages', { defaultValue: 'Loading messages...' })}
                </div>
              ) : messagesError ? (
                <div className="p-6 text-center text-red-500">
                  {t('adminMessages.errorLoadingMessages', { defaultValue: 'Error loading messages' })}
                </div>
              ) : messages.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  {t('adminMessages.noMessages', { defaultValue: 'No messages in this channel.' })}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages.map((msg) => (
                    <EnhancedChatMessage
                      key={msg.id}
                      message={msg as any}
                      currentUserId={"admin"}
                      onReply={(m) => handleReply(m as any)}
                      onCopy={(content) =>
                        navigator.clipboard.writeText(content)
                      }
                      onEdit={undefined}
                      onDelete={handleDeleteMessage}
                      onReaction={undefined}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Sticky Message Input */}
            <form
              className="sticky bottom-0 left-0 right-0 z-10 mt-auto flex items-center gap-3 border-t bg-white/90 px-8 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              aria-label="Send message form"
            >
              {/* Emoji picker */}
              <Button
                type="button"
                className="rounded-full px-2 py-2"
                onClick={() => setShowEmoji((v) => !v)}
                aria-label={t('adminMessages.openEmojiPicker', { defaultValue: 'Open emoji picker' })}
              >
                <Smile />
              </Button>
              {showEmoji && (
                <div className="absolute bottom-20 left-10 z-50 flex max-w-xs flex-wrap gap-1 rounded-lg border bg-white p-2 shadow-md">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      className="mx-1 text-xl"
                      onClick={() => handleEmojiSelect(e)}
                      type="button"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
              {/* Reply preview */}
              {replyTo && (
                <div className="flex items-center gap-2 rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                  {t('adminMessages.replyingTo', { defaultValue: 'Replying to:' })}{" "}
                  <span className="font-semibold">
                    {replyTo.content.slice(0, 32)}...
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setReplyTo(null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {/* File upload */}
              <label className="cursor-pointer">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  placeholder={t('adminMessages.attachFile', { defaultValue: 'Attach a file' })}
                />
              </label>
              {file && (
                <div className="flex items-center gap-1 text-xs">
                  <span>{file.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setFile(null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <textarea
                rows={1}
                className="flex-1 resize-none rounded-full border border-muted/40 bg-white px-4 py-2 text-base shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/30"
                placeholder={t('adminMessages.typeMessage', { defaultValue: 'Type your message...' })}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                maxLength={2000}
                aria-label={t('adminMessages.messageInput', { defaultValue: 'Message input' })}
              />
              <span className="text-xs text-muted-foreground">
                {messageInput.length}/2000
              </span>
              <Button
                type="submit"
                className="flex items-center gap-2 rounded-full px-6 py-2 text-base font-semibold shadow"
                disabled={
                  (!messageInput.trim() && !file) || sendMessage.isLoading
                }
                aria-label={t('adminMessages.sendMessage', { defaultValue: 'Send message' })}
              >
                {sendMessage.isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : null}
                Send
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      {/* Channel Create Modal */}
      <ChannelCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetchChannels();
          toast({ title: t('adminMessages.channelCreated', { defaultValue: 'Channel created' }) });
        }}
      />
    </div>
  );
}

"use client";


import { useEffect, useMemo, useRef, useState } from "react";
import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@acme/ui/button";

import type { ChatMessage, ChatUser } from "./_components/types";
import type { ConversationListItem } from "./_components/ChatSidebar";
import DashboardLayout from "~/app/_components/layouts/DashboardLayout";
import { useAuth } from "~/hooks/use-auth";
import { api } from "~/trpc/react";
import { ChatInput } from "./_components/ChatInput";
import { ChatMessageList } from "./_components/ChatMessageList";
import { ChatSidebar } from "./_components/ChatSidebar";

export default function ChatPage() {
  const [showEmoji, setShowEmoji] = useState(false);
  
  const t = useTranslations();
  // Sidebar mobile state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const utils = api.useUtils();
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Keyboard shortcut to focus input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" ) {
        inputRef.current?.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Data fetching (tRPC style)
  const { data, error, isLoading } = api.chat.getMessages.useQuery({
    threadId: activeChat ? String(activeChat) : undefined,
    limit: 100,
  });

  // Type guard for ChatMessage based on backend type
  // Type guard for ChatMessage matching backend shape (including all required fields)
  function isChatMessage(m: unknown): m is ChatMessage {
    if (!m || typeof m !== "object") return false;
    const msg = m as Record<string, unknown>;
    return (
      typeof msg.id === "string" &&
      typeof msg.content === "string" &&
      typeof msg.senderId === "string" &&
      typeof msg.receiverId === "string" &&
      typeof msg.type === "string" &&
      typeof msg.isRead === "boolean" &&
      (typeof msg.timestamp === "string" || msg.timestamp instanceof Date) &&
      // Backend-required fields for ChatMessage
      (typeof msg.userId === "string" || msg.userId === null) &&
      ("deletedAt" in msg
        ? msg.deletedAt === null || typeof msg.deletedAt === "string"
        : true) &&
      ("agencyId" in msg
        ? msg.agencyId === null || typeof msg.agencyId === "string"
        : true) &&
      ("entityId" in msg
        ? msg.entityId === null || typeof msg.entityId === "string"
        : true) &&
      ("ticketId" in msg
        ? msg.ticketId === null || typeof msg.ticketId === "string"
        : true)
    );
  }

  // Memoized filtered messages
  const messagesSafe: ChatMessage[] = useMemo(() => {
    if (!data || Array.isArray(data)) return [];
    // Filter out nulls/undefined, then apply type guard matching backend shape
    const filtered = (data as { data: (ChatMessage | null)[] }).data.filter(
      (m: unknown): m is ChatMessage => !!m && isChatMessage(m),
    );
    // Now filtered is always ChatMessage[]
    if (!debouncedSearch.trim()) return filtered;
    // msg is always ChatMessage, never null
    return filtered.filter((msg: ChatMessage) =>
      msg.content.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [data, debouncedSearch]);

  // Memoized conversations
  const onlineAgents = [
  "agent-1", // Example agent IDs
  "agent-2",
  "agent-3",
];
const conversations = useMemo(() => {
    const acc: Record<string, { user: ChatUser; messages: ChatMessage[] }> = {};
    messagesSafe.forEach((msg) => {
      const otherUserId =
        msg.senderId === user?.id ? msg.receiverId : msg.senderId;
      const agentId = msg.user?.id ?? otherUserId;
      acc[otherUserId] ??= {
        user: {
          id: agentId,
          name: msg.user?.name ?? "",
          avatar: msg.user?.profilePicture ?? "",
          online: onlineAgents.includes(agentId),
        },
        messages: [],
      };
      acc[otherUserId].messages.push(msg);
    });
    return acc;
  }, [messagesSafe, user?.id]);

  // Memoized conversation list
  const conversationList: ConversationListItem[] = useMemo(
    () =>
      Object.entries(conversations).map(([id, conv]) => ({
        id,
        user: {
          id: conv.user.id,
          name: conv.user.name,
          avatar: conv.user.avatar,
          online: true, // TODO: real online status
        },
        lastMessage:
          conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1]?.content
            : undefined,
        unreadCount: conv.messages.filter((m) => m && m.receiverId === user?.id)
          .length,
        active: activeChat === id,
        onClick: () => setActiveChat(id),
      })),
    [conversations, user?.id, activeChat],
  );

  // Message sending mutation (tRPC style)
  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: () => {
      void utils.chat.getMessages.invalidate();
      setMessageText("");
      setReplyTo(null);
      setShowEmoji(false);
    },
  });

  // Reply/copy handlers
  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
    inputRef.current?.focus();
  };
  const handleCopy = (content: string) => {
    void navigator.clipboard.writeText(content);
  };
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, messagesSafe.length]);
  // Emoji picker stub (replace with real emoji picker if desired)
  const handleAddEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (!activeChat) return;
    const activeConv = conversationList.find(
      (c) => c.id === String(activeChat),
    );
    if (!activeConv) return;
    await sendMessage.mutateAsync({
      receiverId: String(activeConv.user.id),
      senderId: String(user?.id ?? ""),
      content: replyTo ? `@${replyTo.user?.name}: ${messageText}` : messageText,
      type: "INFORMATION",
    });
    setReplyTo(null);
    setShowEmoji(false);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <XCircle className="mb-4 h-10 w-10 text-red-400" />
          <h3 className="mb-2 text-xl font-semibold">
            {t("Error Loading Messages")}
          </h3>
          <p className="mb-4 text-muted-foreground">
            {t("Failed to load messages. Please try again.")}
          </p>
          <Button onClick={() => utils.chat.getMessages.invalidate()}>
            {t("Retry")}
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="flex h-[80vh] min-h-[500px] flex-col overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg md:flex-row">
        {/* Mobile sidebar toggle button */}
        <button
          className="fixed left-4 top-4 z-40 rounded-full bg-primary p-2 text-white shadow-lg focus:outline-none md:hidden"
          aria-label="Open conversations sidebar"
          type="button"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Sidebar: Conversation List */}
        <ChatSidebar
          conversations={conversationList}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Main Panel: Messages and Input */}
        <section className="flex flex-1 flex-col bg-white/80 px-6 py-4 md:px-8 md:py-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 border-b bg-gradient-to-r from-white/80 to-slate-50/60 px-8 py-4 md:justify-between">
            {activeChat ? (
              (() => {
                const activeConv = conversationList.find(
                  (c) => c.id === String(activeChat),
                );
                if (!activeConv) return null;
                const { user } = activeConv;
                return (
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border bg-gray-200 shadow">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {user.name[0] ?? "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Conversation
                      </span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <span className="text-muted-foreground">
                Select a conversation
              </span>
            )}
          </div>
          {/* Message List */}
          <ChatMessageList
            messages={
              activeChat ? (conversations[activeChat]?.messages ?? []) : []
            }
            currentUserId={user?.id ?? ""}
            onReply={handleReply}
            onCopy={handleCopy}
          />
          {/* Message Input */}
          <ChatInput
            value={messageText}
            onChange={setMessageText}
            onSend={handleSendMessage}
            disabled={sendMessage.status === "pending" || !activeChat}
            replyTo={replyTo?.user?.name ?? null}
            onCancelReply={() => setReplyTo(null)}
            showEmoji={showEmoji}
            onToggleEmoji={() => setShowEmoji((v: boolean) => !v)}
            onEmojiSelect={handleAddEmoji}
            loading={sendMessage.status === "pending"}
          />
          <div ref={messageEndRef} />
        </section>
      </div>
    </DashboardLayout>
  );
}

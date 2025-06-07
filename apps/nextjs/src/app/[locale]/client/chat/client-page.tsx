"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@acme/ui/button";

import type { CommunicationType } from "~/utils/interfaces";
import { useAuth } from "~/hooks/use-auth";
import { api } from "~/trpc/react";

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  type: CommunicationType;
  isRead: boolean;
  timestamp: Date;
  user?: ChatUser;
  agency?: unknown;
}

export default function ClientMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const utils = api.useUtils();
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  // Fetch only conversations for the logged-in user
  const { data, error: _error } = api.chat.getMessages.useQuery({
    threadId: activeChat ? String(activeChat) : undefined,
    limit: 50,
  });

  function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === "object" && val !== null;
  }

  function isChatMessage(m: unknown): m is ChatMessage {
    if (!isObject(m)) return false;
    if (
      !isObject(m.user) ||
      typeof m.user.id !== "string" ||
      typeof m.user.name !== "string" ||
      typeof m.user.avatar !== "string"
    ) {
      return false;
    }
    return (
      typeof m.id === "string" &&
      typeof m.content === "string" &&
      typeof m.senderId === "string" &&
      typeof m.receiverId === "string" &&
      typeof m.type === "string" &&
      typeof m.isRead === "boolean" &&
      (typeof m.timestamp === "string" || m.timestamp instanceof Date)
    );
  }

  function notNull<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }
  const items: unknown[] = Array.isArray((data as any)?.data?.data)
  ? ((data as any).data.data as unknown[])
  : [];
  const messagesSafe: ChatMessage[] = items
    .filter((msg): msg is ChatMessage => isChatMessage(msg))
    .map((msg: ChatMessage) => ({
      ...msg,
      user: msg.user ?? undefined,
    }));
  const conversations: Record<
    string,
    { user: ChatUser; messages: ChatMessage[] }
  > = messagesSafe.length
    ? messagesSafe.reduce(
        (acc, msg) => {
          const otherUserId =
            msg.senderId === user?.id ? msg.receiverId : msg.senderId;
          acc[otherUserId] ??= {
            user: msg.user ?? { id: otherUserId, name: "", avatar: "" },
            messages: [],
          };
          acc[otherUserId].messages.push(msg);
          return acc;
        },
        {} as Record<string, { user: ChatUser; messages: ChatMessage[] }>,
      )
    : {};

  const conversationList = Object.entries(conversations).map(([id, conv]) => ({
    id,
    user: conv.user,
    messages: conv.messages,
    unreadCount: conv.messages.filter(
      (m) => !m.isRead && m.receiverId === user?.id,
    ).length,
    lastMessage: conv.messages[conv.messages.length - 1],
  }));

  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: () => {
      void utils.chat.getMessages.invalidate();
      setMessageText("");
    },
    onError: (_error: unknown) => {
      // Optionally show error toast
    },
  });

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;
    const activeConv = conversationList.find(
      (c) => c.id === String(activeChat),
    );
    const activeUser = activeConv?.user;
    if (!activeUser) return;
    await sendMessage.mutateAsync({
      receiverId: String(activeUser.id),
      senderId: String(user?.id ?? ""),
      content: messageText,
      type: "PROBLEM",
    });
  };

  // You can replace the outer div with <ClientLayout> if you have one
  return (
    <div>
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
        <aside
          className={`fixed left-0 top-0 z-30 flex h-full max-w-xs flex-col rounded-r-2xl border-r bg-white shadow-lg transition-transform duration-300 ease-in-out md:static md:z-auto md:block md:h-auto md:translate-x-0 md:rounded-none md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Conversations sidebar"
        >
          <div className="flex items-center justify-between border-b bg-white px-6 py-4 text-xl font-bold tracking-tight md:justify-start">
            <span>Conversations</span>
            {/* Mobile close button */}
            <button
              className="ml-auto rounded-full bg-slate-200 p-1.5 text-gray-700 hover:bg-slate-300 focus:outline-none md:hidden"
              aria-label="Close conversations sidebar"
              type="button"
              onClick={() => setSidebarOpen(false)}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/30 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {conversationList.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No conversations yet.
              </div>
            ) : (
              conversationList.map((conv) => (
                <button
                  key={conv.id}
                  className={`group flex w-full items-center gap-4 rounded-lg text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${activeChat === conv.id ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-muted/60"}`}
                  onClick={() => setActiveChat(conv.id)}
                  tabIndex={0}
                >
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow group-focus:ring-2 group-focus:ring-primary/30">
                    {conv.user.avatar ? (
                      <Image
                        src={conv.user.avatar}
                        alt={conv.user.name}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {conv.user.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold text-gray-900 group-hover:text-primary group-focus:text-primary">
                      {conv.user.name}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {conv.lastMessage?.content ?? "No messages yet."}
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white shadow">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>
        {/* Main Panel: Messages and Input */}
        <section className="flex flex-1 flex-col bg-white/80 px-6 py-4 md:px-8 md:py-6">
          <div className="flex items-center justify-center gap-4 border-b bg-gradient-to-r from-white/80 to-slate-50/60 px-8 py-4 md:justify-between">
            {activeChat ? (
              (() => {
                const activeConv = conversationList.find(
                  (c) => c.id === activeChat,
                );
                if (!activeConv) return null;
                const { user } = activeConv;
                return (
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border bg-gray-200 shadow">
                      {user.avatar ? (
                        <Image
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
          <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6">
            {!activeChat ? (
              <div className="mt-10 text-center text-muted-foreground">
                Select a conversation to view messages.
              </div>
            ) : conversationList.find((c) => c.id === activeChat)?.messages
                .length === 0 ? (
              <div className="mt-10 text-center text-muted-foreground">
                No messages yet. Say hello!
              </div>
            ) : (
              conversationList
                .find((c) => c.id === activeChat)
                ?.messages.slice()
                .sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime(),
                )
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] whitespace-pre-line break-words rounded-[1.25rem] px-5 py-3 shadow-md transition-all duration-150 ${msg.senderId === user?.id ? "rounded-br-md border border-primary/30 bg-primary text-white" : "rounded-bl-md border border-muted/40 bg-white text-gray-900"}`}
                    >
                      <span className="block text-base leading-snug">
                        {msg.content}
                      </span>
                      <div className="mt-1 flex justify-end text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
          <form
            className="flex items-center gap-3 border-t bg-white/90 px-8 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage();
            }}
          >
            <input
              type="text"
              className="flex-1 rounded-full border border-muted/40 bg-white px-4 py-2 text-base shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/30"
              placeholder={
                activeChat
                  ? "Type your message..."
                  : "Select a conversation to start chatting"
              }
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={!activeChat}
              autoFocus={!!activeChat}
              maxLength={2000}
            />
            <Button
              type="submit"
              className="rounded-full px-6 py-2 text-base font-semibold shadow"
              disabled={
                !activeChat ||
                !messageText.trim() ||
                sendMessage.status === "pending"
              }
            >
              Send
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

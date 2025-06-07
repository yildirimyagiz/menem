import React from "react";
import Image from "next/image";

import { Button } from "@acme/ui/button";

import type { User } from "~/utils/interfaces";
import { useAuth } from "~/hooks/use-auth";

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
}

export interface ConversationListItem {
  id: string;
  user: ChatUser;
  lastMessage?: string;
  unreadCount: number;
  active: boolean;
  onClick: () => void;
}

export function ConversationListItem({
  user,
  lastMessage,
  unreadCount,
  active,
  onClick,
}: ConversationListItem) {
  return (
    <button
      className={`flex w-full items-center gap-4 rounded-lg px-3 py-2 text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${active ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-muted/60"}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={`Open conversation with ${user.name}`}
    >
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-gray-400">
            {user.name?.[0] || "U"}
          </span>
        )}
        {user.online && (
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-gray-900 group-hover:text-primary group-focus:text-primary">
          {user.name}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {lastMessage ?? "No messages yet."}
        </div>
      </div>
      {unreadCount > 0 && (
        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white shadow">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function ChatSidebar({
  conversations,
  sidebarOpen,
  setSidebarOpen,
}: ChatSidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-full max-w-xs flex-col rounded-r-2xl border-r bg-white shadow-lg transition-transform duration-300 ease-in-out md:static md:z-auto md:block md:h-auto md:translate-x-0 md:rounded-none md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      aria-label="Conversations sidebar"
    >
      <div className="flex items-center justify-between border-b bg-white px-6 py-4 text-xl font-bold tracking-tight md:justify-start">
        <span>Conversations</span>
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
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No conversations yet.
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationListItem key={conv.id} {...conv} />
          ))
        )}
      </div>
    </aside>
  );
}

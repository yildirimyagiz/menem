"use client";

import type { ReactNode } from "react";

import { ChatSidebar } from "../../[locale]/client/chat/_components/ChatSidebar";

interface ChatLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  conversations: any[]; // Replace with actual type if available
}

export default function ChatLayout({
  children,
  sidebarOpen,
  setSidebarOpen,
  conversations,
}: ChatLayoutProps) {
  return (
    <div className="flex h-[80vh] min-h-[500px] flex-col overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg md:flex-row">
      {/* Sidebar: Conversation List */}
      <ChatSidebar
        conversations={conversations}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main Panel: Messages and Input */}
      <section className="flex flex-1 flex-col bg-white/80 px-6 py-4 md:px-8 md:py-6">
        {children}
      </section>
    </div>
  );
}

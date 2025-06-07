import React from "react";
import { Copy, Reply } from "lucide-react";

import { Button } from "@acme/ui/button";

import type { User } from "~/utils/interfaces";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  type: string;
  content: string;
  timestamp: Date | string;
  user: User | null;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  onReply?: (msg: ChatMessage) => void;
  onCopy?: (content: string) => void;
}

export function ChatMessageList({
  messages,
  currentUserId,
  onReply,
  onCopy,
}: ChatMessageListProps) {
  // Group messages by date
  const grouped = messages.reduce<Record<string, ChatMessage[]>>((acc, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    acc[date] = acc[date] ?? [];
    acc[date].push(msg);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();

  return (
    <div
      className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6"
      role="list"
    >
      {dates.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">
          No messages yet.
        </div>
      ) : (
        dates.map((date) => (
          <div key={date}>
            <div className="mb-2 text-center text-xs font-medium text-muted-foreground">
              {date}
            </div>
            {grouped[date]?.map((msg, idx, arr) => (
              <div
                key={msg.id}
                className={`group flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"} mb-2 transition-all duration-300`}
                style={{ opacity: idx === arr.length - 1 ? 1 : 0.95 }}
                role="listitem"
              >
                <div
                  className={`relative max-w-[70%] whitespace-pre-line break-words rounded-[1.25rem] px-5 py-3 shadow-md transition-all duration-150 ${msg.senderId === currentUserId ? "rounded-br-md border border-primary/30 bg-primary text-white" : "rounded-bl-md border border-muted/40 bg-white text-gray-900"}`}
                  tabIndex={0}
                  aria-label={msg.content}
                >
                  {/* Reply preview */}
                  {msg.content.startsWith("@") && (
                    <div className="mb-1 text-xs italic text-primary/70">
                      {msg.content.split(":")[0]}
                    </div>
                  )}
                  {/* Main message */}
                  <span className="block text-base leading-snug">
                    {msg.content}
                  </span>
                  {/* Timestamp with tooltip */}
                  <div className="mt-1 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span title={new Date(msg.timestamp).toLocaleString()}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {/* Message actions (reply/copy) */}
                  <div className="absolute -right-4 top-1 hidden flex-col gap-1 group-hover:flex">
                    {onReply && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onReply(msg)}
                        title="Reply"
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    )}
                    {onCopy && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onCopy(msg.content)}
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      <div id="messageEnd" />
    </div>
  );
}

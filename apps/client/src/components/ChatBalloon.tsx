"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Smile, X } from "lucide-react";

import { cn } from "@reservatior/ui";
import { Button } from "@reservatior/ui/button";
import { Textarea } from "@reservatior/ui/textarea";

import { useChat } from "~/context/ChatContext";

// Optional: Emoji picker stub
const emojiList = ["😀", "😂", "😍", "😎", "👍", "🙏", "🎉", "❤️"];

export function ChatBalloon() {
  const {
    isChatOpen,
    unreadCount,
    messages,
    sendMessage,
    activeSupportAgent,
    openChat,
    closeChat,
    isAdmin,
  } = useChat();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [adminSender, setAdminSender] = useState<'self' | 'support' | 'system'>('support');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  // Handle sending a message
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    let receiverId = activeSupportAgent?.id ?? "support";
    let asAdmin = false;
    if (isAdmin) {
      asAdmin = adminSender !== 'self';
      if (adminSender === 'system') receiverId = 'system';
      else if (adminSender === 'support') receiverId = 'support';
      // else receiverId is as selected in UI
    }
    await sendMessage(message.trim(), receiverId, undefined, asAdmin);
    setMessage("");
    setShowEmoji(false);
  };

  // Handle emoji
  const handleAddEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmoji(false);
  };

  return (
    <div>
      {/* Floating chat button */}
      {!isChatOpen && (
        <Button
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg"
          size="icon"
          onClick={openChat}
          aria-label="Open online support chat"
        >
          <MessageCircle className="h-7 w-7" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      )}

      {/* Chat window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-lg border bg-white shadow-xl sm:w-96">
          {/* Agent Info Bar */}
          <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-primary">
              {activeSupportAgent?.avatar ? (
                <img
                  src={activeSupportAgent.avatar}
                  alt={activeSupportAgent.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                activeSupportAgent?.name?.[0] || "A"
              )}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold leading-tight">
                {activeSupportAgent?.name || "Support Agent"}
              </span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />{" "}
                Active
              </span>
            </div>
          </div>
          {/* Header */}
          <div className="flex items-center justify-between bg-primary p-3 text-primary-foreground">
            <div className="flex items-center gap-2 font-bold">
              Online Support
              {isAdmin && (
                <span className="ml-2 rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">Admin</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Messages */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.senderId === activeSupportAgent?.id
                    ? "justify-start"
                    : "justify-end",
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2",
                    msg.senderId === activeSupportAgent?.id
                      ? "bg-muted text-gray-900"
                      : "bg-primary text-white",
                  )}
                >
                  <div className="mb-1 text-xs opacity-70">
                    {msg.metadata?.senderName ??
                      (msg.senderId === activeSupportAgent?.id
                        ? "Support"
                        : "You")}
                  </div>
                  <div>{msg.content}</div>
                  <div className="mt-1 text-right text-[10px] opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Admin sender selector */}
          {isAdmin && (
            <div className="flex items-center gap-2 border-t bg-muted/10 px-3 py-2">
              <label className="text-xs font-semibold text-muted-foreground">Send as:</label>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={adminSender}
                onChange={e => setAdminSender(e.target.value as 'self' | 'support' | 'system')}
              >
                <option value="self">Myself</option>
                <option value="support">Support</option>
                <option value="system">System</option>
              </select>
            </div>
          )}

          {/* Input */}
          <form className="flex gap-2 border-t p-3" onSubmit={handleSend}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Add emoji"
              onClick={() => setShowEmoji((v) => !v)}
            >
              <Smile className="h-5 w-5" />
            </Button>
            {showEmoji && (
              <div className="absolute bottom-16 left-0 z-50 flex gap-1 rounded-lg border bg-white p-2 shadow-md">
                {emojiList.map((e) => (
                  <button
                    key={e}
                    className="text-xl"
                    type="button"
                    onClick={() => handleAddEmoji(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) void handleSend(e);
                // Optionally: send typing event here
              }}
            />
            <Button
              type="submit"
              disabled={!message.trim()}
              className="h-10 w-10 rounded-full"
              size="icon"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

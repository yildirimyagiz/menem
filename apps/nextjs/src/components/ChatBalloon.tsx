"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Smile, X } from "lucide-react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Textarea } from "@acme/ui/textarea";

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
  } = useChat();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
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
    await sendMessage(message.trim(), activeSupportAgent?.id ?? "support");
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
          {/* Header */}
          <div className="flex items-center justify-between bg-primary p-3 text-primary-foreground">
            <div className="font-bold">Online Support</div>
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

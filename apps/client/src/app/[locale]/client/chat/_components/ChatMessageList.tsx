"use client";

import React, { useMemo, useState, useEffect, isValidElement } from "react";
import { useTranslations } from 'next-intl';

import { Copy, Reply, Smile } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@reservatior/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";

import type { ChatMessage } from "~/types/chat";

// Client-side only component to render message content
const MessageContent = React.memo(({ content }: { content: string | React.ReactElement | null | undefined }) => {
  const t = useTranslations('Chat');
  if (content === null || content === undefined) {
    return null;
  }
  
  // If it's a React element, render it directly
  if (isValidElement(content)) {
    return content;
  }

  // Handle primitive types
  switch (typeof content) {
    case 'string':
      return <>{content}</>;
    case 'number':
    case 'boolean':
      return <>{String(content)}</>;
    case 'object':
       try {
         return <>{JSON.stringify(content)}</>;
       } catch {
         return <span className="text-muted-foreground">{t('messageList.unknownContent', { defaultValue: '[Unknown content]' })}</span>;
       }
    default:
      return <>{String(content)}</>;
  }
});

MessageContent.displayName = 'MessageContent';

// Client-side only component to render message content with proper error boundaries
const SafeMessageContent = React.memo(({ content }: { content: string | React.ReactElement | null | undefined }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    // During SSR, return a simple placeholder
    return <span className="text-muted-foreground">{t('messageList.loading', { defaultValue: '[Loading...]' })}</span>;
  }
  
  return <MessageContent content={content} />;
});

SafeMessageContent.displayName = 'SafeMessageContent';

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  onReply?: (msg: ChatMessage) => void;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

export function ChatMessageList({
  messages,
  currentUserId,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onReaction,
}: ChatMessageListProps) {
  const t = useTranslations('Chat');
  // Track client-side hydration state
  const [isMounted, setIsMounted] = useState(false);
  
  // Memoize message grouping by date (client-side only)
  const { grouped, dates } = useMemo(() => {
    if (!isMounted) {
      return { grouped: {}, dates: [] };
    }

    const groupedByDate = messages.reduce<Record<string, ChatMessage[]>>((acc, msg) => {
      const date = format(new Date(msg.timestamp), 'PPP'); // e.g., "April 29, 2020"
      acc[date] ??= [];
      acc[date].push(msg);
      return acc;
    }, {});
    
    return {
      grouped: groupedByDate,
      dates: Object.keys(groupedByDate).sort()
    };
  }, [messages, isMounted]);

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render messages during SSR to avoid hydration issues
  if (!isMounted) {
    return (
      <div 
        className="flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6"
      role="list"
    >
      {dates.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">
          {t('messageList.noMessages', { defaultValue: 'No messages yet.' })}
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
                  {/* Main message with safe content rendering */}
                  <span className="block text-base leading-snug">
                    <SafeMessageContent content={msg.content} />
                    {msg.isEdited && (
                      <span className="ml-2 text-xs opacity-70">(edited)</span>
                    )}
                  </span>
                  {/* Timestamp with tooltip */}
                  <div className="mt-1 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span title={new Date(msg.timestamp).toLocaleString()}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.isRead && msg.senderId === currentUserId && (
                      <span className="text-blue-500">✓✓</span>
                    )}
                  </div>
                  {/* Message actions (reply/copy/edit/delete/reaction) */}
                  <div className="absolute -right-4 top-1 hidden flex-col gap-1 group-hover:flex">
                    {onReply && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onReply(msg)}
                        title={t('messageList.reply', { defaultValue: 'Reply' })}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    )}
                    {onCopy && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onCopy(msg.content)}
                        title={t('messageList.copy', { defaultValue: 'Copy' })}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit &&
                      msg.senderId === currentUserId &&
                      !msg.isEdited && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(msg.id, msg.content)}
                          title={t('messageList.edit', { defaultValue: 'Edit' })}
                        >
                          <span className="h-4 w-4">✏️</span>
                        </Button>
                      )}
                    {onDelete && msg.senderId === currentUserId && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(msg.id)}
                        title={t('messageList.delete', { defaultValue: 'Delete' })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <span className="h-4 w-4">🗑️</span>
                      </Button>
                    )}
                    {onReaction && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title={t('messageList.addReaction', { defaultValue: 'Add reaction' })}
                          >
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="end" side="top">
                          <div className="flex gap-1">
                            {REACTIONS.map((emoji) => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-lg hover:bg-muted/50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReaction(msg.id, emoji);
                                }}
                                title={t('messageList.reactWith', { emoji, defaultValue: `React with ${emoji}` })}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
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

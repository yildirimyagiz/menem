import React, { useEffect, useRef, useState } from "react";
import { Copy, Edit, MoreHorizontal, Reply, Smile, Trash2 } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Input } from "@reservatior/ui/input";

import type { User } from "~/utils/interfaces";
import Avatar from "~/shared/Avatar";
import { api } from "~/trpc/react";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  type: string;
  content: string;
  timestamp: Date | string;
  user: User | null;
  isRead?: boolean;
  isEdited?: boolean;
  editHistory?: { content: string; timestamp: Date }[];
  reactions?: {
    id: string;
    emoji: string;
    userId: string;
    userName: string;
    timestamp: Date;
  }[];
  replyTo?: ChatMessage | null;
}

interface EnhancedChatMessageProps {
  message: ChatMessage;
  currentUserId: string;
  onReply?: (msg: ChatMessage) => void;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export function EnhancedChatMessage({
  message,
  currentUserId,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onReaction,
}: EnhancedChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwnMessage = message.senderId === currentUserId;
  const canEdit = isOwnMessage && !message.isEdited;
  const canDelete = isOwnMessage;

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji);
    setShowReactions(false);
  };

  const getReactionCount = (emoji: string) => {
    return message.reactions?.filter((r) => r.emoji === emoji).length || 0;
  };

  const hasUserReacted = (emoji: string) => {
    return (
      message.reactions?.some(
        (r) => r.emoji === emoji && r.userId === currentUserId,
      ) || false
    );
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className={`group relative flex items-end gap-2 ${isOwnMessage ? "justify-end" : "justify-start"} mb-6 transition-all duration-300`}
    >
      {/* Avatar */}
      {!isOwnMessage && (
        <Avatar
          imgUrl={message.user?.image || undefined}
          userName={message.user?.name || "Unknown"}
          sizeClass="h-10 w-10 text-base"
        />
      )}
      <div className="relative flex max-w-[75%] flex-col">
        {/* Sender name for group chats */}
        {!isOwnMessage && message.user?.name && (
          <div className="mb-1 ml-1 text-xs font-semibold text-primary/80">
            {message.user.name}
          </div>
        )}
        {/* Reply preview */}
        {message.replyTo && (
          <div className="mb-1 ml-1 rounded border-l-4 border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary/80">
            Replying to:{" "}
            <span className="font-semibold">
              {message.replyTo.user?.name || "Unknown"}
            </span>
            <div className="truncate text-xs text-primary/60">
              {message.replyTo.content.slice(0, 48)}
              {message.replyTo.content.length > 48 ? "..." : ""}
            </div>
          </div>
        )}
        {/* Message bubble */}
        <div
          className={`relative whitespace-pre-line break-words rounded-2xl px-5 py-3 shadow-md transition-all duration-150 ${
            isOwnMessage
              ? "rounded-br-md border border-primary/30 bg-gradient-to-br from-primary/90 to-primary text-white"
              : "rounded-bl-md border border-muted/40 bg-white text-gray-900"
          }`}
        >
          {isEditing ? (
            <div className="space-y-2">
              <Input
                ref={editInputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <span className="block text-base leading-snug">
                {message.content}
              </span>
              {message.isEdited && (
                <span className="ml-2 text-xs opacity-70">(edited)</span>
              )}
            </>
          )}
          {/* Timestamp and read receipt */}
          <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span title={new Date(message.timestamp).toLocaleString()}>
              {formatTimestamp(message.timestamp)}
            </span>
            {message.isRead && isOwnMessage && (
              <span className="text-blue-200">✓✓</span>
            )}
            {/* Aceternity UI Menu for actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onReply && (
                  <DropdownMenuItem onClick={() => onReply(message)}>
                    Reply
                  </DropdownMenuItem>
                )}
                {onCopy && (
                  <DropdownMenuItem onClick={() => onCopy(message.content)}>
                    Copy
                  </DropdownMenuItem>
                )}
                {canEdit && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={() => onDelete?.(message.id)}>
                    Delete
                  </DropdownMenuItem>
                )}
                {onReaction && (
                  <DropdownMenuItem
                    onClick={() => setShowReactions(!showReactions)}
                  >
                    React
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Emoji reactions popover */}
            {showReactions && (
              <div className="absolute right-0 top-10 z-20 flex gap-1 rounded-lg border bg-white p-2 shadow-lg">
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-gray-100 ${hasUserReacted(emoji) ? "bg-blue-100" : ""}`}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="ml-2 mt-2 flex flex-wrap gap-1">
            {Object.entries(
              message.reactions.reduce(
                (acc, reaction) => {
                  acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            ).map(([emoji, count]) => (
              <Badge
                key={emoji}
                variant={hasUserReacted(emoji) ? "default" : "secondary"}
                className="cursor-pointer text-xs"
                onClick={() => onReaction?.(message.id, emoji)}
              >
                {emoji} {count}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {/* Avatar for own messages (optional, for symmetry) */}
      {isOwnMessage && (
        <Avatar
          imgUrl={message.user?.image || undefined}
          userName={message.user?.name || "Unknown"}
          sizeClass="h-10 w-10 text-base"
        />
      )}
    </div>
  );
}

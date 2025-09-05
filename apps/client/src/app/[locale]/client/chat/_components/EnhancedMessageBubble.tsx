"use client";

import { format } from "date-fns";
import {
    Check,
    CheckCheck,
    Clock,
    Edit,
    Forward,
    MoreVertical,
    Reply,
    Smile,
    Trash2
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";

import type { ChatMessage } from "~/types/chat";

interface EnhancedMessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showStatus?: boolean;
  showActionsMenu?: boolean;
  onReply?: (message: ChatMessage) => void;
  onEdit?: (message: ChatMessage) => void;
  onDelete?: (message: ChatMessage) => void;
  onForward?: (message: ChatMessage) => void;
  onReaction?: (message: ChatMessage, emoji: string) => void;
  _isEditing?: boolean;
  _onCancelEdit?: () => void;
}

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function EnhancedMessageBubble({
  message,
  isOwnMessage,
  showAvatar = true,
  showTimestamp = true,
  showStatus = true,
  showActionsMenu = true,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onReaction,
  _isEditing = false,
  _onCancelEdit,
}: EnhancedMessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const getMessageStatus = () => {
    if (!message.isRead) return "sent";
    return "read";
  };

  const getStatusIcon = () => {
    const status = getMessageStatus();
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return format(date, "HH:mm");
  };

  const getMessageContent = () => {
    if (message.replyTo) {
      return (
        <div className="space-y-2">
          {/* Reply preview */}
          <div className="rounded-lg bg-muted/50 p-2 text-xs">
            <div className="font-medium text-muted-foreground">
              Replying to {message.replyTo.user?.name ?? "Unknown"}
            </div>
            <div className="truncate text-muted-foreground">
              {message.replyTo.content}
            </div>
          </div>
          {/* Current message */}
          <div>{message.content}</div>
        </div>
      );
    }
    return message.content;
  };

  return (
    <div
      className={`group flex gap-2 ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.user?.image ?? undefined} alt={message.user?.name ?? "User"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            {message.user?.name?.[0] ?? "U"}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div className={`flex max-w-[70%] flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
        {/* Message bubble */}
        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {getMessageContent()}
          </div>

          {/* Message actions */}
          {showActionsMenu && showActions && (
            <div className="absolute -top-2 right-2 flex items-center gap-1 rounded-lg bg-background/95 p-1 shadow-lg backdrop-blur-sm">
              <Popover open={showReactions} onOpenChange={setShowReactions}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowReactions(!showReactions);
                    }}
                  >
                    <Smile className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-1" align="end">
                  <div className="flex gap-1">
                    {REACTIONS.map((emoji) => (
                      <Button
                        key={emoji}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => {
                          onReaction?.(message, emoji);
                          setShowReactions(false);
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onReply?.(message)}>
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </DropdownMenuItem>
                  {isOwnMessage && (
                    <DropdownMenuItem onClick={() => onEdit?.(message)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onForward?.(message)}>
                    <Forward className="mr-2 h-4 w-4" />
                    Forward
                  </DropdownMenuItem>
                  {isOwnMessage && (
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(message)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Message metadata */}
        <div className={`flex items-center gap-2 px-2 py-1 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
          {/* Timestamp */}
          {showTimestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message.timestamp)}
            </span>
          )}

          {/* Status indicators */}
          {showStatus && isOwnMessage && (
            <div className="flex items-center gap-1">
              {getStatusIcon()}
            </div>
          )}

          {/* Edited indicator */}
          {message.isEdited && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 px-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            {message.reactions.map((reaction, index) => (
              <Badge
                key={`${reaction.emoji}-${index}`}
                variant="secondary"
                className="text-xs"
              >
                {reaction.emoji} {reaction.userName}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Avatar for own messages */}
      {showAvatar && isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.user?.image ?? undefined} alt={message.user?.name ?? "You"} />
          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs">
            {message.user?.name?.[0] ?? "Y"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// Message group component for grouping consecutive messages from the same sender
interface MessageGroupProps {
  messages: ChatMessage[];
  currentUserId: string;
  onReply?: (message: ChatMessage) => void;
  onEdit?: (message: ChatMessage) => void;
  onDelete?: (message: ChatMessage) => void;
  onForward?: (message: ChatMessage) => void;
  onReaction?: (message: ChatMessage, emoji: string) => void;
}

export function MessageGroup({
  messages,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onReaction,
}: MessageGroupProps) {
  if (messages.length === 0) return null;

  const firstMessage = messages[0];
  const isOwnMessage = firstMessage?.senderId === currentUserId;

  return (
    <div className="space-y-1">
      {messages.map((message, index) => (
        <EnhancedMessageBubble
          key={message.id}
          message={message}
          isOwnMessage={isOwnMessage}
          showAvatar={index === messages.length - 1} // Only show avatar for last message in group
          showTimestamp={index === messages.length - 1} // Only show timestamp for last message in group
          showStatus={index === messages.length - 1} // Only show status for last message in group
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onForward={onForward}
          onReaction={onReaction}
        />
      ))}
    </div>
  );
} 
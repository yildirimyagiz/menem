"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { format, isToday, isYesterday } from "date-fns";
import { Search, Filter, MoreVertical, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { ScrollArea } from "@reservatior/ui/scroll-area";
import { Separator } from "@reservatior/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

import type { ChatUser, ConversationListItem } from "./ChatSidebar";

interface EnhancedConversationListProps {
  conversations: ConversationListItem[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation?: () => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: "all" | "unread" | "online") => void;
  currentFilter?: "all" | "unread" | "online";
  isLoading?: boolean;
}

interface EnhancedConversationItemProps {
  conversation: ConversationListItem;
  isActive: boolean;
  onSelect: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
}

function EnhancedConversationItem({
  conversation,
  isActive,
  onSelect,
  onArchive,
  onDelete,
  onMarkAsRead,
}: EnhancedConversationItemProps) {
  const t = useTranslations('Chat');
  const [showActions, setShowActions] = useState(false);

  const formatLastMessageTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return t('conversationList.yesterday', { defaultValue: 'Yesterday' });
    } else {
      return format(date, "MMM d");
    }
  };

  const getLastMessagePreview = (message?: string) => {
    if (!message) return t('conversationList.noMessagesYet', { defaultValue: 'No messages yet' });
    return message.length > 50 ? `${message.substring(0, 50)}...` : message;
  };

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-muted/60 ${
        isActive ? "bg-primary/10 ring-2 ring-primary/30" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar with online status */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {conversation.user.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        {conversation.user.online && (
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>

      {/* Conversation details */}
      <div className="min-w-0 flex-1" onClick={onSelect}>
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-primary">
            {conversation.user.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {formatLastMessageTime(conversation.lastMessage?.timestamp || new Date())}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {getLastMessagePreview(conversation.lastMessage?.content)}
        </p>
      </div>

      {/* Unread badge */}
      {conversation.unreadCount > 0 && (
        <Badge variant="destructive" className="ml-2 h-6 w-6 rounded-full p-0 text-xs">
          {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
        </Badge>
      )}

      {/* Actions menu */}
      {showActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {conversation.unreadCount > 0 && (
              <DropdownMenuItem onClick={onMarkAsRead}>
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onArchive}>
              Archive conversation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Delete conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function EnhancedConversationList({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onSearch,
  onFilterChange,
  currentFilter = "all",
  isLoading = false,
}: EnhancedConversationListProps) {
  const t = useTranslations('Chat');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((conv) =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (currentFilter) {
      case "unread":
        filtered = filtered.filter((conv) => conv.unreadCount > 0);
        break;
      case "online":
        filtered = filtered.filter((conv) => conv.user.online);
        break;
      default:
        break;
    }

    return filtered;
  }, [conversations, searchQuery, currentFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">{t('conversationList.title', { defaultValue: 'Conversations' })}</h2>
        <div className="flex items-center gap-2">
          {onNewConversation && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onNewConversation}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search and filters */}
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('conversationList.searchPlaceholder', { defaultValue: 'Search conversations...' })}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        
        {onFilterChange && (
          <div className="mt-3 flex gap-1">
            {[
              { key: "all", label: t('conversationList.all', { defaultValue: 'All' }) },
              { key: "unread", label: t('conversationList.unread', { defaultValue: 'Unread' }) },
              { key: "online", label: t('conversationList.online', { defaultValue: 'Online' }) },
            ].map((filter) => (
              <Button
                key={filter.key}
                size="sm"
                variant={currentFilter === filter.key ? "default" : "outline"}
                onClick={() => onFilterChange(filter.key as any)}
                className="text-xs"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-2 h-12 w-12 rounded-full bg-muted/50" />
              <h3 className="text-sm font-medium text-gray-900">
                {searchQuery ? t('conversationList.noFound', { defaultValue: 'No conversations found' }) : t('conversationList.noConversations', { defaultValue: 'No conversations yet' })}
              </h3>
              <p className="text-xs text-muted-foreground">
                {searchQuery ? t('conversationList.tryAdjust', { defaultValue: 'Try adjusting your search terms' }) : t('conversationList.startNew', { defaultValue: 'Start a new conversation to get started' })}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <EnhancedConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversationId === conversation.id}
                  onSelect={() => onConversationSelect(conversation.id)}
                  onArchive={() => {
                    // TODO: Implement archive functionality
                    console.log("Archive conversation:", conversation.id);
                  }}
                  onDelete={() => {
                    // TODO: Implement delete functionality
                    console.log("Delete conversation:", conversation.id);
                  }}
                  onMarkAsRead={() => {
                    // TODO: Implement mark as read functionality
                    console.log("Mark as read:", conversation.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 
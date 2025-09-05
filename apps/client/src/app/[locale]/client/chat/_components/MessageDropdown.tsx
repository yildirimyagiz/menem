"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Bell, MessageSquare, X } from "lucide-react";

import type { Notification } from "@reservatior/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Separator } from "@reservatior/ui/separator";

import type { ChatMessage, ChatUser } from "./types";
import type { User } from "~/utils/interfaces";
import { useToast } from "~/hooks/use-toast";
import Spinner from "~/shared/Spinner";
import { api } from "~/trpc/react";

// Simple error component
const ErrorComponent: React.FC<{ error: string }> = ({ error }) => (
  <div className="rounded-lg border p-4 text-center">
    <p className="text-sm text-red-600">{error}</p>
  </div>
);

// Simple empty state component
const EmptyState: React.FC = () => (
  <div className="rounded-lg border p-4 text-center">
    <p className="text-sm text-muted-foreground">
      No new messages or notifications
    </p>
  </div>
);

interface MessageDropdownProps {
  messages: ChatMessage[];
  notifications: Notification[];
  onOpenChat: (userId: string) => void;
  onOpenNotification: (notificationId: string) => void;
  user: User | null;
  markAsRead: (id: string, type: "message" | "notification") => Promise<void>;
}

export function MessageDropdown({
  onOpenChat,
  onOpenNotification,
  user,
}: MessageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  // Fetch messages with safe access
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isMessageError,
    error: messageError,
    refetch: refetchMessages,
  } = (api.chat as any)?.getMessages?.useQuery?.(
    { userId: user?.id },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      enabled: !!user?.id,
    },
  ) ?? {
    data: [],
    isLoading: false,
    isError: false,
    error: undefined,
    refetch: () => {},
  };

  // Fetch notifications with safe access
  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    isError: isNotificationError,
    error: notificationError,
    refetch: refetchNotifications,
  } = (api.notification as any)?.all?.useQuery?.(
    { userId: user?.id },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      enabled: !!user?.id,
    },
  ) ?? {
    data: [],
    isLoading: false,
    isError: false,
    error: undefined,
    refetch: () => {},
  };

  // Memoized helper function
  const getUserInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Memoized filtered messages and notifications
  const recentMessages = useMemo(() => {
    if (!messages || !Array.isArray(messages)) return [];
    return messages.filter((msg: any) => !msg.isRead).slice(0, 5);
  }, [messages]);

  const recentNotifications = useMemo(() => {
    if (!notifications || !Array.isArray(notifications)) return [];
    return notifications.filter((n: any) => !n.isRead).slice(0, 5);
  }, [notifications]);

  // Memoized total unread count
  const totalUnread = useMemo(() => {
    return (
      (Array.isArray(messages)
        ? messages.filter((msg: any) => !msg.isRead).length
        : 0) +
      (Array.isArray(notifications)
        ? notifications.filter((n: any) => !n.isRead).length
        : 0)
    );
  }, [messages, notifications]);

  // Memoized markAsRead function with safe access
  const markAsRead = useCallback(
    async (id: string, type: "message" | "notification") => {
      try {
        if (type === "message") {
          await (api.chat as any)?.markAllAsRead?.mutate?.({ threadId: id });
          if ((utils.chat as any)?.getMessages?.invalidate) {
            await (utils.chat as any).getMessages.invalidate();
          }
        } else {
          await (api.notification as any)?.markAsRead?.mutate?.({ id, type });
          if ((utils.notification as any)?.all?.invalidate) {
            await (utils.notification as any).all.invalidate();
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to mark as read",
          variant: "destructive",
        });
      }
    },
    [utils, toast],
  );

  // Loading state
  if (isLoadingMessages || isLoadingNotifications) {
    return <Spinner />;
  }

  // Error state
  if (isMessageError || isNotificationError) {
    return (
      <ErrorComponent
        error={
          messageError?.message ||
          notificationError?.message ||
          "Failed to load messages/notifications"
        }
      />
    );
  }

  // Empty state
  if (!recentMessages.length && !recentNotifications.length) {
    return <EmptyState />;
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {totalUnread > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]"
          >
            {totalUnread}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-md border bg-white shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Messages</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {recentMessages.length > 0 && (
              <>
                <div className="mt-2 space-y-2">
                  {recentMessages.map((msg: any) => (
                    <div
                      key={msg.id}
                      onClick={async () => {
                        if (msg.id && typeof msg.id === "string") {
                          await markAsRead(msg.id, "message");
                        }
                        if (msg.senderId) {
                          onOpenChat(msg.senderId);
                        }
                        setIsOpen(false);
                      }}
                      className="flex cursor-pointer items-start gap-3 rounded-md p-3 hover:bg-muted/50"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={msg.user?.avatar || "/default-avatar.png"}
                        />
                        <AvatarFallback>
                          {getUserInitials(msg.user?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {msg.user?.name || "Unknown"}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
              </>
            )}

            {recentNotifications.length > 0 && (
              <>
                <h4 className="text-sm font-medium">Notifications</h4>
                <div className="mt-2 space-y-2">
                  {recentNotifications.map((n: any) => (
                    <div
                      key={n.id}
                      onClick={async () => {
                        if (n.id && typeof n.id === "string") {
                          await markAsRead(n.id, "notification");
                        }
                        if (n.id && typeof n.id === "string") {
                          onOpenNotification(n.id);
                        }
                        setIsOpen(false);
                      }}
                      className="flex cursor-pointer items-start gap-3 rounded-md p-3 hover:bg-muted/50"
                    >
                      <AlertCircle className="text-warning h-8 w-8" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{n.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(n.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {n.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  const firstMessage = recentMessages[0];
                  if (firstMessage?.senderId) {
                    onOpenChat(firstMessage.senderId);
                  }
                }}
              >
                View All Messages
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  const firstNotification = recentNotifications[0];
                  if (
                    firstNotification?.id &&
                    typeof firstNotification.id === "string"
                  ) {
                    onOpenNotification(firstNotification.id);
                  }
                }}
              >
                View All Notifications
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

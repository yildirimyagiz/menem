"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AtSign, Bell, CheckCircle, Tag, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";

import { api } from "~/trpc/react";

interface NotificationPanelProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

import { highlightEntities } from "./utils/highlightEntities";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onEntityClick?: (type: "mention" | "hashtag", value: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onEntityClick }: NotificationItemProps) => {
  const t = useTranslations("notifications");
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MENTION":
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case "TASK_ASSIGNED":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "BOOKING_CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "MENTION":
        return "border-purple-200 bg-purple-50";
      case "TASK_ASSIGNED":
        return "border-orange-200 bg-orange-50";
      case "BOOKING_CONFIRMED":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${
        !notification.isRead ? "ring-2 ring-blue-200" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {highlightEntities(
                notification.content,
                (hashtag) => onEntityClick?.("hashtag", hashtag),
                (mention) => onEntityClick?.("mention", mention)
              )}
            </p>
            {!notification.isRead && (
              <Badge variant="secondary" className="text-xs">
                {t("new", { defaultValue: "New" })}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('createdAt', { date: new Date(notification.createdAt), defaultValue: new Date(notification.createdAt).toLocaleString() })}
          </p>
          {!notification.isRead && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMarkAsRead(notification.id)}
              className="mt-2 text-xs"
            >
              {t("markAsRead", { defaultValue: "Mark as read" })}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Notification type
interface Notification {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationPanel = ({ userId, isOpen, onClose }: NotificationPanelProps) => {
  // Ensure onClose is serializable or wrap in useCallback if needed

  const t = useTranslations("notifications");
  const [activeTab, setActiveTab] = useState<"all" | "mentions" | "hashtags">("all");

  // Fetch notifications
  const { data: allNotifications, isLoading, isError } = api.notification.all.useQuery({
    userId,
    page: 1,
    pageSize: 20,
  });

  const { data: mentionsData } = api.notification.mentions.useQuery({
    userId,
    page: 1,
    pageSize: 10,
  });

  const { data: hashtagsData, isLoading: loadingHashtags } = (api.notification.hashtags && typeof api.notification.hashtags.useQuery === 'function')
  ? api.notification.hashtags.useQuery({
      userId,
      page: 1,
      pageSize: 10,
    })
  : { data: [], isLoading: false };

  // Mutations
  const markAsRead = api.notification.update.useMutation();
  const markAllAsRead = api.notification.markAllAsRead.useMutation();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead.mutateAsync({
        id: notificationId,
        isRead: true,
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync({ userId });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const notifications: Notification[] = Array.isArray(allNotifications?.data)
  ? allNotifications.data.filter((n): n is Notification => n && typeof n === 'object' && 'id' in n && 'type' in n && 'content' in n && 'isRead' in n && 'createdAt' in n)
  : [];
const mentions: Notification[] = Array.isArray(mentionsData?.data)
  ? mentionsData.data.filter((n): n is Notification => n && typeof n === 'object' && 'id' in n && 'type' in n && 'content' in n && 'isRead' in n && 'createdAt' in n)
  : [];
const hashtags: Notification[] = Array.isArray(hashtagsData?.data)
  ? hashtagsData.data.filter((n): n is Notification => n && typeof n === 'object' && 'id' in n && 'type' in n && 'content' in n && 'isRead' in n && 'createdAt' in n)
  : [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Search/filter state
  const [search, setSearch] = useState("");
  const filteredNotifications = notifications.filter((n) =>
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  // Click handler for hashtags/mentions
  const handleEntityClick = (type: "mention" | "hashtag", value: string) => {
    if (type === "mention") {
      // Navigate to user profile or open mention context
      window.open(`/profile/${value}`, "_blank");
    } else {
      // Navigate to hashtag search or analytics
      window.open(`/search?hashtag=${encodeURIComponent(value)}`, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t("title", { defaultValue: "Notifications" })}</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-blue-600">{t("unreadCount", { defaultValue: `${unreadCount} unread` })}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    {t("markAllAsRead", { defaultValue: "Mark all as read" })}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "all"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-selected={activeTab === "all"}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("mentions")}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "mentions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-selected={activeTab === "mentions"}
              >
                Mentions
                {mentions.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {mentions.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab("hashtags")}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "hashtags"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-selected={activeTab === "hashtags"}
              >
                Hashtags
                {hashtags.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {hashtags.length}
                  </Badge>
                )}
              </button>
            </div>

            {/* Search/filter */}
            <div className="px-4 py-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder", { defaultValue: "Search notifications..." })}
                className="w-full border rounded-md px-2 py-1 text-sm"
                aria-label={t("searchAriaLabel", { defaultValue: "Search notifications" })}
              />
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {isLoading && <div className="text-center text-gray-400">{t("loading", { defaultValue: "Loading..." })}</div>}
              {isError && <div className="text-center text-red-500">{t("loadFailed", { defaultValue: "Failed to load notifications." })}</div>}
              <AnimatePresence mode="wait">
                {activeTab === "all" && (
                  <motion.div
                    key="all"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t("noNotifications", { defaultValue: "No notifications yet" })}</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onEntityClick={handleEntityClick}
                        />
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "mentions" && (
                  <motion.div
                    key="mentions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {mentions.length === 0 ? (
                      <div className="text-center py-8">
                        <AtSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t("noMentions", { defaultValue: "No mentions yet" })}</p>
                      </div>
                    ) : (
                      mentions.map((mention) => (
                        <NotificationItem
                          key={mention.id}
                          notification={mention}
                          onMarkAsRead={handleMarkAsRead}
                          onEntityClick={handleEntityClick}
                        />
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "hashtags" && (
                  <motion.div
                    key="hashtags"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {loadingHashtags ? (
                      <div className="text-center text-gray-400">{t("loadingHashtags", { defaultValue: "Loading hashtags..." })}</div>
                    ) : hashtags.length === 0 ? (
                      <div className="text-center py-8">
                        <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t("noHashtagNotifications", { defaultValue: "No hashtag notifications yet" })}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {t("trackHashtags", { defaultValue: "Track hashtags to get notified here." })}
                        </p>
                      </div>
                    ) : (
                      hashtags.map((hashtag) => (
                        <NotificationItem
                          key={hashtag.id}
                          notification={hashtag}
                          onMarkAsRead={handleMarkAsRead}
                          onEntityClick={handleEntityClick}
                        />
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 
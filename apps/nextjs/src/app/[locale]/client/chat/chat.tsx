"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";

import type {
  Channel as BackendChannel,
  CommunicationType,
} from "~/utils/interfaces";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface Conversation {
  id: string;
  title: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
}

// Chat API response type and type guard

export default function ChatPage() {
  const t = useTranslations("Chat");
  const [_activeConversation, _setActiveConversation] =
    useState<Conversation | null>(null);
  // Add state for new message form

  // Add state for message content
  const [_messageContent, _setMessageContent] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );

  // Get current user
  const sessionResult = api.auth.getSession.useQuery();
  const sessionError = sessionResult.error;
  interface SessionUser {
    id: string;
    name: string;
    email?: string;
  }
  const _currentUser: SessionUser | null =
    sessionError ||
    !sessionResult.data ||
    !("user" in sessionResult.data) ||
    !sessionResult.data.user
      ? null
      : {
          id: sessionResult.data.user.id,
          name:
            typeof sessionResult.data.user.name === "string"
              ? sessionResult.data.user.name
              : "",
          email: sessionResult.data.user.email ?? undefined,
        };

  // Fetch channels
  const { data: channelsData } = api.channel.list.useQuery({
    page: 1,
    pageSize: 50,
  });
  // Always ensure channels is an array of channel objects
  type Channel = BackendChannel & {
    type?: CommunicationType | string;
    category?: string;
  };
  const channels: Channel[] = useMemo(() => {
    // channelsData?.data?.data should be the array of channels
    const raw = Array.isArray(channelsData?.data?.data)
      ? channelsData.data.data
      : [];
    // Remove nulls before assigning as Channel[] and ensure correct typing
    return (raw as unknown[]).filter(
      (c): c is Channel =>
        c !== null &&
        typeof c === "object" &&
        typeof (c as Channel).id === "string",
    );
  }, [channelsData]);

  // Set default channel on load
  useEffect(() => {
    if (!selectedChannelId && channels.length > 0) {
      const firstChannelId = channels[0]?.id;
      if (firstChannelId) {
        setSelectedChannelId(firstChannelId);
      }
    }
  }, [channels, selectedChannelId]);

  // Fetch conversations filtered by channel
  // Define a type for messages that includes channelId
  interface ChannelMessage {
    id: string;
    channelId: string;
    content: string;
    user?: { id: string; name: string };
    timestamp?: string | number | Date;
    [key: string]: unknown;
  }
  const { data: conversations } = api.chat.getMessages.useQuery({ limit: 50 });
  // Filter conversations by selectedChannelId on the client side if needed
  // Normalize conversations to always be an array of ChannelMessage
  let conversationArray: ChannelMessage[] = [];
  if (
    conversations &&
    typeof conversations === "object" &&
    "data" in conversations &&
    Array.isArray((conversations as { data?: { data?: unknown[] } }).data?.data)
  ) {
    conversationArray = (
      conversations as unknown as { data: { data: ChannelMessage[] } }
    ).data.data.filter(Boolean);
  } else if (Array.isArray(conversations)) {
    conversationArray = (conversations as ChannelMessage[]).filter(Boolean);
  }

  const filteredConversations = selectedChannelId
    ? conversationArray.filter(
        (msg) => !!msg && msg.channelId === selectedChannelId,
      )
    : conversationArray.filter((msg) => !!msg);

  const utils = api.useUtils();

  // --- Channel Management State ---
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] = useState("");

  // --- Channel Creation Mutation ---
  const createChannel = api.channel.create.useMutation({
    onSuccess: async (created) => {
      await utils.channel.list.invalidate(); // Refresh channels after creation
      setShowChannelModal(false);
      setNewChannelName("");
      setNewChannelType("");
      if (created?.id) setSelectedChannelId(created.id); // Auto-select new channel
    },
  });

  // --- Add default channels if none exist ---
  useEffect(() => {
    if (channels.length === 0) {
      // Only for demo/dev: create two default channels if none exist
      createChannel.mutate({
        name: "For Rent",
        description: "For Rent",
        type: "GROUP",
        category: "AGENCY",
      });
      createChannel.mutate({
        name: "Apartment",
        description: "Apartment",
        type: "GROUP",
        category: "AGENCY",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels.length]);

  // Send message mutation
  const _sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      await utils.chat.getMessages.invalidate();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const errMsg = error.message;
        toast.error(
          errMsg === "UNAUTHORIZED"
            ? t("errorUnauthorized")
            : t("errorSendMessage"),
        );
      } else {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: t("errorMessage"),
        });
      }
    },
  });

  // Mark messages as read mutation (use chat API)
  const _markAsRead = api.chat.markAllAsRead.useMutation({
    onSuccess: async () => {
      await utils.chat.getMessages.invalidate();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const errMsg = error.message;
        toast.error(
          errMsg === "UNAUTHORIZED"
            ? t("errorUnauthorized")
            : t("errorMarkAsRead"),
        );
      } else {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: t("errorMessage"),
        });
      }
    },
  });

  return (
    <div className="container mx-auto py-6">
      {/* Channel Tabs and Actions */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="mr-4 text-3xl font-bold">{t("messages")}</h1>
            <div className="flex gap-1 overflow-x-auto">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  className={`rounded-t px-4 py-2 font-medium transition-colors duration-150 focus:outline-none ${
                    selectedChannelId === channel.id
                      ? "bg-primary text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedChannelId(channel.id)}
                  aria-current={
                    selectedChannelId === channel.id ? "page" : undefined
                  }
                >
                  {channel.name}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setShowChannelModal(true)}
              >
                + {t("newChannel", { defaultValue: "New Channel" })}
              </Button>
            </div>
          </div>
          <div className="text-base text-muted-foreground">
            {selectedChannelId && (
              <span className="font-medium text-primary">
                {(() => {
                  const channel = channels.find(
                    (channel) => channel.id === selectedChannelId,
                  );
                  return channel ? channel.name : null;
                })()}
              </span>
            )}{" "}
            {_activeConversation
              ? t("chattingWith", { name: _activeConversation.title })
              : t("connectWithUsers")}
          </div>
        </div>
      </div>

      {/* New Channel Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowChannelModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="mb-4 text-xl font-bold">{t("createChannel")}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newChannelName.trim()) return;
                createChannel.mutate({
                  name: newChannelName,
                  description: newChannelType || "general",
                  type: "GROUP",
                  category: "AGENCY",
                });
              }}
            >
              <div className="mb-4">
                <label className="mb-1 block font-medium">
                  {t("channelName")}
                </label>
                <Input
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder={t("channelNamePlaceholder", {
                    defaultValue: "Enter channel name",
                  })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block font-medium">
                  {t("channelType")}
                </label>
                <Input
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value)}
                  placeholder={t("channelTypePlaceholder", {
                    defaultValue: "e.g. forRent, apartment",
                  })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  disabled={createChannel.status === "pending"}
                >
                  {createChannel.status === "pending"
                    ? t("creating", { defaultValue: "Creating..." })
                    : t("create")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conversation List filtered by selected channel */}
      <div className="mt-6">
        {filteredConversations.length > 0 ? (
          <div className="space-y-4">
            {filteredConversations.map((msg) => (
              <Card key={msg.id} className="shadow-sm">
                <CardContent className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-primary">
                    {msg.user &&
                    typeof msg.user === "object" &&
                    typeof msg.user.name === "string" &&
                    msg.user.name.length > 0
                      ? msg.user.name[0]
                      : "?"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {msg.user?.name ?? t("unknownUser")}
                    </div>
                    <div className="mt-1 text-gray-700">{msg.content}</div>
                  </div>
                  <div className="whitespace-nowrap text-xs text-gray-400">
                    {msg.timestamp && new Date(msg.timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            {t("noMessagesInChannel", {
              defaultValue: "No messages in this channel yet.",
            })}
          </div>
        )}
      </div>
    </div>
  );
}

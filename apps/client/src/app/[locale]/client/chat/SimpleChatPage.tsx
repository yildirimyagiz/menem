"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@reservatior/ui/button";
import { ScrollArea } from "@reservatior/ui/scroll-area";

import { useAuth } from "~/hooks/use-auth";
import type { ChatMessage } from "~/types/chat";

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    online?: boolean;
  };
  lastMessage?: {
    content: string;
    timestamp: Date | string;
  };
  unreadCount: number;
  active: boolean;
}

export default function SimpleChatPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations for now
  const conversations: Conversation[] = useMemo(() => [
    {
      id: "agent-1",
      user: {
        id: "agent-1",
        name: "Support Agent 1",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        online: true,
      },
      lastMessage: {
        content: "How can I help you today?",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      unreadCount: 0,
      active: selectedConversation === "agent-1",
    },
    {
      id: "agent-2",
      user: {
        id: "agent-2",
        name: "Support Agent 2",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        online: false,
      },
      lastMessage: {
        content: "I'll get back to you soon.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      unreadCount: 1,
      active: selectedConversation === "agent-2",
    },
  ], [selectedConversation]);

  // Mock messages
  const messages: ChatMessage[] = useMemo(() => {
    if (!selectedConversation) return [];
    
    return [
      {
        id: "1",
        senderId: selectedConversation,
        receiverId: user?.id || "",
        type: "text",
        content: "Hello! How can I help you today?",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        user: {
          id: selectedConversation,
          name: conversations.find(c => c.id === selectedConversation)?.user.name || "Agent",
          email: "agent@example.com",
          image: conversations.find(c => c.id === selectedConversation)?.user.avatar,
        },
        isRead: true,
      },
      {
        id: "2",
        senderId: user?.id || "",
        receiverId: selectedConversation,
        type: "text",
        content: "I need help with my reservation.",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        user: user || null,
        isRead: true,
      },
      {
        id: "3",
        senderId: selectedConversation,
        receiverId: user?.id || "",
        type: "text",
        content: "I'd be happy to help! What's your reservation number?",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: {
          id: selectedConversation,
          name: conversations.find(c => c.id === selectedConversation)?.user.name || "Agent",
          email: "agent@example.com",
          image: conversations.find(c => c.id === selectedConversation)?.user.avatar,
        },
        isRead: false,
      },
    ];
  }, [selectedConversation, user, conversations]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;

    try {
      // For now, just add to local state
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: user?.id || "",
        receiverId: selectedConversation,
        type: "text",
        content: message.trim(),
        timestamp: new Date(),
        user: user || null,
        isRead: false,
      };

      // In a real implementation, you'd send this to the API
      console.log("Sending message:", newMessage);
      
      toast.success("Message sent!");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                conversation.active ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
              }`}
              onClick={() => handleConversationSelect(conversation.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {conversation.user.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.user.name}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedConversationData?.user.avatar}
                    alt={selectedConversationData?.user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {selectedConversationData?.user.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversationData?.user.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversationData?.user.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.senderId === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.senderId !== user?.id && (
                      <img
                        src={msg.user?.image}
                        alt={msg.user?.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === user?.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.senderId === user?.id && (
                      <img
                        src={msg.user?.image}
                        alt={msg.user?.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-muted/50 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                Select a conversation
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
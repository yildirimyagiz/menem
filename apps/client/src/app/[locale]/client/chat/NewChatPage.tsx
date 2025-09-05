"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  MessageSquare,
  Mic,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { ScrollArea } from "@reservatior/ui/scroll-area";

import { useAuth } from "~/hooks/use-auth";
import { cn } from "~/lib/utils";
import { ConversationItem } from "./_components/ConversationItem";
import { MessageBubble, TypingIndicator } from "./_components/MessageBubble";
import styles from "./chat.module.css";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

export default function NewChatPage() {
  const router = useRouter();
  const t = useTranslations("Chat");
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with real data from your API
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "John Doe",
      avatar: "/avatars/01.png",
      lastMessage: "Hey, how are you doing?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "/avatars/02.png",
      lastMessage: "The meeting is scheduled for tomorrow",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      unreadCount: 0,
      isOnline: false,
    },
  ]);

  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);

  // Set first conversation as active by default
  useEffect(() => {
    if (conversations?.length > 0 && !activeConversation) {
      setActiveConversation(conversations?.[0]?.id ?? null);
    }
  }, [conversations, activeConversation]);

  // Mock function to load messages for a conversation
  const loadMessages = useCallback(
    (conversationId: string) => {
      // In a real app, you would fetch messages from your API
      const mockMessages: Message[] = [
        {
          id: "1",
          content: "Hey there! How are you?",
          senderId: "1",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          status: "read",
        },
        {
          id: "2",
          content: "I'm doing great, thanks for asking! How about you?",
          senderId: user?.id || "current-user",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          status: "read",
        },
        {
          id: "3",
          content:
            "Pretty good! Just working on some new features for our app.",
          senderId: "1",
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          status: "read",
        },
        {
          id: "4",
          content: "That sounds interesting! What kind of features?",
          senderId: user?.id || "current-user",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          status: "read",
        },
      ];

      setMessages(mockMessages);
    },
    [user?.id],
  );

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);

      // Mark messages as read
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation ? { ...conv, unreadCount: 0 } : conv,
        ),
      );

      // Close mobile menu on conversation select
      setIsMobileMenuOpen(false);
      setIsMobileChatOpen(true);
    }
  }, [activeConversation, loadMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: user?.id || "current-user",
      timestamp: new Date(),
      status: "sending",
    };

    // Optimistically add the message
    setMessages((prev) => [...prev, newMessage]);

    // Clear input
    setMessage("");

    // Simulate sending message
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" as const } : msg,
        ),
      );

      // Simulate message delivered
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: "delivered" as const }
              : msg,
          ),
        );

        // Simulate message read
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newMessage.id
                ? { ...msg, status: "read" as const }
                : msg,
            ),
          );
        }, 1000);
      }, 500);
    }, 500);

    // Update last message in conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              lastMessage: message,
              lastMessageTime: new Date(),
              unreadCount: 0,
            }
          : conv,
      ),
    );
  }, [message, activeConversation, user?.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const activeConversationData = conversations.find(
    (c) => c.id === activeConversation,
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{t("title")}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-20 w-80 border-r bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            isMobileChatOpen ? "hidden md:block" : "",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={
                    t("searchPlaceholder") || "Search conversations..."
                  }
                  className="w-full pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="divide-y">
                {conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    id={conversation.id}
                    name={conversation.name}
                    avatar={conversation.avatar}
                    lastMessage={conversation.lastMessage}
                    time={conversation.lastMessageTime}
                    unreadCount={conversation.unreadCount}
                    isActive={conversation.id === activeConversation}
                    isOnline={conversation.isOnline}
                    onClick={() => setActiveConversation(conversation.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Chat Area */}
        <div
          className={cn(
            "flex flex-1 flex-col bg-white",
            isMobileChatOpen ? "flex" : "hidden md:flex",
          )}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsMobileChatOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={activeConversationData?.avatar}
                          alt={activeConversationData?.name}
                        />
                        <AvatarFallback>
                          {activeConversationData?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {activeConversationData?.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                      )}
                    </div>

                    <div>
                      <h2 className="font-medium">
                        {activeConversationData?.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {activeConversationData?.isOnline
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    const isOwn = msg.senderId === (user?.id || "current-user");
                    const isFirstInGroup =
                      index === 0 ||
                      messages?.[index - 1]?.senderId !== msg.senderId;
                    const isLastInGroup =
                      index === messages?.length - 1 ||
                      messages?.[index + 1]?.senderId !== msg.senderId;

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isOwn ? "justify-end" : "justify-start",
                        )}
                      >
                        <MessageBubble
                          content={msg.content}
                          timestamp={msg.timestamp}
                          isOwn={isOwn}
                          status={msg.status}
                          isFirstInGroup={isFirstInGroup}
                          isLastInGroup={isLastInGroup}
                          className={cn(
                            isOwn ? "ml-12" : "mr-12",
                            isFirstInGroup ? "mt-2" : "mt-1",
                            isLastInGroup ? "mb-2" : "mb-1",
                          )}
                        />
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex justify-start">
                      <TypingIndicator />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      placeholder={t("typeMessage") || "Type a message..."}
                      className="w-full rounded-full pr-12"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setMessage((prev) => prev + "😊")}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    className="rounded-full"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    {message.trim() ? (
                      <Send className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 p-4 text-gray-400">
                <MessageSquare className="h-full w-full" />
              </div>
              <h3 className="mb-2 text-xl font-medium">
                {t("noConversationSelected") || "No conversation selected"}
              </h3>
              <p className="max-w-md text-gray-500">
                {t("selectConversationToStart") ||
                  "Select a conversation to start chatting"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

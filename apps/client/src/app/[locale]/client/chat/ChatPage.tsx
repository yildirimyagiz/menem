"use client";

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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "~/trpc/react";
import { useAuth } from "~/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { ScrollArea } from "@reservatior/ui/scroll-area";

import { cn } from "~/lib/utils";
import { ConversationItem } from "./_components/ConversationItem";
// Components
import { MessageBubble } from "./_components/MessageBubble";
import { TypingIndicator } from "./_components/TypingIndicator";
// Styles

// Types
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: MessageStatus;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  profilePicture?: string; // Add profilePicture to the User interface
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

interface ChatPageProps {
  params: { locale?: string };
}

export default function ChatPage({ params }: ChatPageProps) {
  // const router = useRouter();
  const t = useTranslations("Chat");
  const { user } = useAuth() as { user: User | null };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState<null | 'hashtag' | 'mention'>(null);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hashtag and mention state for autocomplete
  const [hashtagQuery, setHashtagQuery] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  interface Suggestion {
    id?: string;
    name: string;
    avatar?: string;
  }
  const [hashtagSuggestions, setHashtagSuggestions] = useState<Suggestion[]>([]);
  const [mentionSuggestions, setMentionSuggestions] = useState<Suggestion[]>([]);

  // Fetch hashtags for autocomplete
  // Defensive: Only call useQuery if api.hashtag.all and api.mention.all exist
  const hashtagQueryEnabled = Boolean(api?.hashtag?.all?.useQuery);
  const mentionQueryEnabled = Boolean(api?.mention?.all?.useQuery);

  const { data: hashtagsData } = hashtagQueryEnabled
    ? api.hashtag.all.useQuery(
        hashtagQuery ? { name: hashtagQuery, pageSize: 10 } : { pageSize: 10 },
        { enabled: !!hashtagQuery }
      )
    : { data: [] };
  const { data: mentionsData } = mentionQueryEnabled
    ? api.mention.all.useQuery(
        mentionQuery ? { name: mentionQuery, pageSize: 10 } : { pageSize: 10 },
        { enabled: !!mentionQuery }
      )
    : { data: [] };

  // Type guard for Suggestion[]
  function isSuggestionArray(val: unknown): val is Suggestion[] {
    return Array.isArray(val) && (val.length === 0 || typeof val[0]?.name === "string");
  }

  useEffect(() => {
    setHashtagSuggestions(isSuggestionArray(hashtagsData?.data) ? hashtagsData.data : []);
  }, [hashtagsData]);
  useEffect(() => {
    setMentionSuggestions(isSuggestionArray(mentionsData?.data) ? mentionsData.data : []);
  }, [mentionsData]);

  // --- Autocomplete Handlers ---
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val);
    // Detect trigger for hashtag or mention
    const cursor = e.target.selectionStart;
    const left = val.slice(0, cursor);
    const hashtagMatch = /(^|\s)#(\w*)$/.exec(left);
    const mentionMatch = /(^|\s)@(\w*)$/.exec(left);
    if (hashtagMatch) {
      setHashtagQuery(hashtagMatch[2] ?? "");
      setShowAutocomplete('hashtag');
      setAutocompleteIndex(0);
    } else if (mentionMatch) {
      setMentionQuery(mentionMatch[2] ?? "");
      setShowAutocomplete('mention');
      setAutocompleteIndex(0);
    } else {
      setShowAutocomplete(null);
      setHashtagQuery("");
      setMentionQuery("");
    }
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = (item: Suggestion) => {
    let newMsg = message;
    const cursor = inputRef.current?.selectionStart ?? message.length;
    if (showAutocomplete === 'hashtag') {
      newMsg = newMsg.replace(/(^|\s)#(\w*)$/, `$1#${item.name} `);
      setMessage(newMsg);
    } else if (showAutocomplete === 'mention') {
      newMsg = newMsg.replace(/(^|\s)@(\w*)$/, `$1@${item.name} `);
      setMessage(newMsg);
    }
    setShowAutocomplete(null);
    setHashtagQuery("");
    setMentionQuery("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle keyboard navigation for autocomplete
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showAutocomplete) return;
    const suggestions: Suggestion[] = showAutocomplete === 'hashtag' ? hashtagSuggestions : mentionSuggestions;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAutocompleteIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAutocompleteIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleAutocompleteSelect(suggestions[autocompleteIndex]);
    } else if (e.key === 'Escape') {
      setShowAutocomplete(null);
    }
  };

  // Mock data - replace with real data from your API
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);

  // Load initial data
  useEffect(() => {
    // TODO: Replace with API call to fetch conversations
    const mockConversations: Conversation[] = [
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
    ];

    setConversations(mockConversations);
    const firstConversation = mockConversations[0];
    if (firstConversation?.id) {
      setActiveConversation(firstConversation.id);
    }
  }, []);

  // Get current user ID with fallback
  const currentUserId = user?.id ?? "current-user";

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    // TODO: Replace with API call to fetch messages
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
        senderId: user?.id ?? "current-user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: "read",
      },
    ];

    setMessages(mockMessages);
  }, [activeConversation, user?.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUserId,
      timestamp: new Date(),
      status: "sending",
    };

    // Optimistically add the message
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  }, [message, activeConversation, currentUserId]);

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
  ) ?? {
    id: "",
    name: "Unknown",
    avatar: "",
    lastMessage: "",
    lastMessageTime: new Date(),
    unreadCount: 0,
    isOnline: false,
  };

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
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link href={`/${params?.locale ?? 'en'}/admin/profile`} passHref legacyBehavior>
              <a title="Go to Profile">
                <Avatar className="h-8 w-8 hover:ring-2 hover:ring-blue-400 transition">
                  <AvatarImage
                    src={(user?.profilePicture ?? user?.avatar ?? "/default-avatar.png")}
                    alt={user?.name ?? "User"}
                  />
                  <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
              </a>
            </Link>
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
                  placeholder="Search conversations..."
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
                    onClick={() => {
                      setActiveConversation(conversation.id);
                      setIsMobileMenuOpen(false);
                      setIsMobileChatOpen(true);
                    }}
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
                    onClick={() => {
                      setIsMobileChatOpen(false);
                      setIsMobileMenuOpen(true);
                    }}
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
                    const isOwn = msg.senderId === currentUserId;
                    const isFirstInGroup =
                      index === 0 ||
                      (messages[index - 1]?.senderId ?? "") !== msg.senderId;
                    const isLastInGroup =
                      index === messages.length - 1 ||
                      (messages[index + 1]?.senderId ?? "") !== msg.senderId;

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
                      <TypingIndicator
                        userName={activeConversationData?.name ?? "Someone"}
                        isVisible={isTyping}
                      />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <div className="relative flex-1">
                    <textarea
                      ref={inputRef}
                      placeholder={t('input.placeholder', { defaultValue: 'Type a message...' })}
                      className="w-full rounded-lg border border-gray-200 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={1}
                      value={message}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                    />

                    {showAutocomplete && (
                      <div className="absolute bg-white border border-gray-200 p-2 w-full mt-1 z-50">
                        {showAutocomplete === 'hashtag' ? (
                          hashtagSuggestions
                            .filter((item) => item.name && item.name.includes(hashtagQuery))
                            .map((item, index) => (
                              <div
                                key={item.id || item.name}
                                className={`p-2 cursor-pointer ${
                                  autocompleteIndex === index
                                    ? 'bg-blue-100'
                                    : ''
                                }`}
                                onMouseDown={() => handleAutocompleteSelect(item)}
                              >
                                #{item.name}
                              </div>
                            ))
                        ) : (
                          mentionSuggestions
                            .filter((item) => item.name && item.name.includes(mentionQuery))
                            .map((item, index) => (
                              <div
                                key={item.id || item.name}
                                className={`p-2 cursor-pointer ${
                                  autocompleteIndex === index
                                    ? 'bg-blue-100'
                                    : ''
                                }`}
                                onMouseDown={() => handleAutocompleteSelect(item)}
                              >
                                @{item.name}
                              </div>
                            ))
                        )}
                      </div>
                    )}
                    <Button
                      size="icon"
                      className="absolute bottom-1 right-1 h-8 w-8"
                      onClick={() => setMessage((prev) => prev + "😊")}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-full"
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
                No conversation selected
              </h3>
              <p className="max-w-md text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

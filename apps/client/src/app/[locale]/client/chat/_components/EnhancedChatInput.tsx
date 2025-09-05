"use client";

import {
    Bold,
    Code,
    File,
    Image as ImageIcon,
    Italic,
    Mic,
    Music,
    Paperclip,
    Send,
    Smile,
    Video,
    X
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@reservatior/ui/popover";
import { Textarea } from "@reservatior/ui/textarea";

interface EnhancedChatInputProps {
  onSend: (content: string, type?: "text" | "file" | "voice") => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  replyTo?: {
    message: string;
    sender: string;
    onCancel: () => void;
  } | null;
  placeholder?: string;
  maxLength?: number;
  showFormatting?: boolean;
  showEmoji?: boolean;
  showFileUpload?: boolean;
  showVoiceMessage?: boolean;
}

const EMOJI_CATEGORIES = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔"],
  "Hands": ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "👊", "🤝", "🙏"],
  "Animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"],
  "Food": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒"],
  "Activities": ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸"],
};

const FILE_TYPES = [
  { type: "image", label: "Image", icon: ImageIcon, extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
  { type: "video", label: "Video", icon: Video, extensions: [".mp4", ".avi", ".mov", ".wmv"] },
  { type: "audio", label: "Audio", icon: Music, extensions: [".mp3", ".wav", ".ogg", ".m4a"] },
  { type: "document", label: "Document", icon: File, extensions: [".pdf", ".doc", ".docx", ".txt", ".rtf"] },
];

export function EnhancedChatInput({
  onSend,
  onTyping,
  disabled = false,
  replyTo,
  placeholder = "Type a message...",
  maxLength = 1000,
  showFormatting = true,
  showEmoji = true,
  showFileUpload = true,
  showVoiceMessage = true,
}: EnhancedChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [formatting, setFormatting] = useState<{
    bold: boolean;
    italic: boolean;
    code: boolean;
  }>({ bold: false, italic: false, code: false });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Typing indicator
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping?.(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isTyping, onTyping]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }
  };

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    const formattedMessage = applyFormatting(message);
    onSend(formattedMessage);
    setMessage("");
    setIsTyping(false);
    onTyping?.(false);
    
    // Reset formatting
    setFormatting({ bold: false, italic: false, code: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const applyFormatting = (text: string) => {
    let formatted = text;
    if (formatting.bold) formatted = `**${formatted}**`;
    if (formatting.italic) formatted = `*${formatted}*`;
    if (formatting.code) formatted = `\`${formatted}\``;
    return formatted;
  };

  const addEmoji = (emoji: string) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const newMessage = message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
    setMessage(newMessage);
    textareaRef.current?.focus();
    
    // Set cursor position after emoji
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = cursorPos + emoji.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll just send the file name as a message
      // In a real implementation, you'd upload the file and send the URL
      onSend(`📎 ${file.name}`, "file");
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        // In a real implementation, you'd upload the audio file and send the URL
        onSend("🎤 Voice message", "voice");
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting voice recording:", error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleFormatting = (type: "bold" | "italic" | "code") => {
    setFormatting(prev => ({ ...prev, [type]: !prev[type] }));
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Reply preview */}
      {replyTo && (
        <div className="mb-3 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-muted-foreground">
                Replying to {replyTo.sender}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {replyTo.message}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={replyTo.onCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Formatting toolbar */}
        {showFormatting && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFormatting("bold")}
              className={`h-8 w-8 p-0 ${formatting.bold ? "bg-muted" : ""}`}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFormatting("italic")}
              className={`h-8 w-8 p-0 ${formatting.italic ? "bg-muted" : ""}`}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFormatting("code")}
              className={`h-8 w-8 p-0 ${formatting.code ? "bg-muted" : ""}`}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main input */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent p-0 text-base focus:ring-0"
            rows={1}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Emoji picker */}
          {showEmoji && (
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                  disabled={disabled}
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="end">
                <div className="space-y-2">
                  {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                    <div key={category}>
                      <div className="mb-2 text-xs font-medium text-muted-foreground">
                        {category}
                      </div>
                      <div className="grid grid-cols-10 gap-1">
                        {emojis.map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-lg hover:bg-muted"
                            onClick={() => {
                              addEmoji(emoji);
                              setShowEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* File upload */}
          {showFileUpload && (
            <DropdownMenu open={showFileMenu} onOpenChange={setShowFileMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                  disabled={disabled}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {FILE_TYPES.map((fileType) => (
                  <DropdownMenuItem
                    key={fileType.type}
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowFileMenu(false);
                    }}
                  >
                    <fileType.icon className="mr-2 h-4 w-4" />
                    {fileType.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Voice message */}
          {showVoiceMessage && (
            <Button
              variant="ghost"
              size="sm"
              className={`h-10 w-10 p-0 ${isRecording ? "bg-red-100 text-red-600" : ""}`}
              disabled={disabled}
              onMouseDown={startVoiceRecording}
              onMouseUp={stopVoiceRecording}
              onMouseLeave={stopVoiceRecording}
              onTouchStart={startVoiceRecording}
              onTouchEnd={stopVoiceRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}

          {/* Send button */}
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="h-10 w-10 p-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Character count */}
      {maxLength && (
        <div className="mt-2 text-xs text-muted-foreground text-right">
          {message.length}/{maxLength}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.rtf"
      />
    </div>
  );
}

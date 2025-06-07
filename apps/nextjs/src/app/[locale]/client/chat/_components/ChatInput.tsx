import React, { useRef, useState } from "react";
import { XCircle } from "lucide-react";

import { Button } from "@acme/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  replyTo?: string | null;
  onCancelReply?: () => void;
  showEmoji?: boolean;
  onToggleEmoji?: () => void;
  onEmojiSelect?: (emoji: string) => void;
  loading?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  replyTo,
  onCancelReply,
  showEmoji,
  onToggleEmoji,
  onEmojiSelect,
  loading,
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputRows, setInputRows] = useState(1);

  return (
    <form
      className="flex items-center gap-3 border-t bg-white/90 px-8 py-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      aria-label="Send message form"
    >
      {/* Emoji picker button (stub) */}
      <Button
        type="button"
        className="rounded-full px-2 py-2"
        onClick={onToggleEmoji}
        disabled={disabled}
        aria-label="Open emoji picker"
      >
        <span role="img" aria-label="emoji">
          😊
        </span>
      </Button>
      {showEmoji && (
        <div className="absolute bottom-20 left-10 z-50 rounded-lg border bg-white p-2 shadow-md">
          {/* Replace with real emoji picker if desired */}
          {["😀", "😂", "😍", "😎", "👍", "🙏", "🎉", "❤️"].map((e) => (
            <button
              key={e}
              className="mx-1 text-xl"
              onClick={() => onEmojiSelect && onEmojiSelect(e)}
              type="button"
            >
              {e}
            </button>
          ))}
        </div>
      )}
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 rounded bg-primary/10 px-2 py-1 text-xs text-primary">
          Replying to: <span className="font-semibold">{replyTo}</span>
          <Button size="icon" variant="ghost" onClick={onCancelReply}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
      <textarea
        ref={inputRef}
        rows={inputRows}
        className="flex-1 resize-none rounded-full border border-muted/40 bg-white px-4 py-2 text-base shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/30"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          const lines = e.target.value.split("\n").length;
          setInputRows(Math.max(1, Math.min(6, lines)));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={disabled}
        maxLength={2000}
        aria-label="Message input"
      />
      <Button
        type="submit"
        className="flex items-center gap-2 rounded-full px-6 py-2 text-base font-semibold shadow"
        disabled={(disabled ?? !value.trim()) || loading}
        aria-label="Send message"
      >
        {loading ? <span className="animate-spin">⏳</span> : null}
        Send
      </Button>
    </form>
  );
}

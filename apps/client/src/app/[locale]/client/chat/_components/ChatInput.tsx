import React, { useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import { Send } from "lucide-react";

import { Button } from "@reservatior/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  loading,
}: ChatInputProps) {
  const t = useTranslations('Chat');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputRows, setInputRows] = useState(1);

  return (
    <form
      className="flex items-center gap-2 border-t bg-white px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      aria-label={t('chatInput.sendAria', { defaultValue: 'Send message form' })}
    >
      <textarea
        ref={inputRef}
        rows={inputRows}
        className="flex-1 resize-none rounded-full border border-gray-200 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/30"
        placeholder={t('chatInput.placeholder', { defaultValue: 'Message...' })}
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
        aria-label={t('chatInput.inputAria', { defaultValue: 'Message input' })}
        style={{ border: "1px solid #E5E7EB", background: "#fff" }}
      />
      <Button
        type="submit"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1220] text-white"
        disabled={(disabled ?? !value.trim()) || loading}
        aria-label={t('chatInput.sendButton', { defaultValue: 'Send message' })}
        size="icon"
      >
        {loading ? (
          <span className="animate-spin">{t('chatInput.sending', { defaultValue: 'Sending...' })}</span>
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}

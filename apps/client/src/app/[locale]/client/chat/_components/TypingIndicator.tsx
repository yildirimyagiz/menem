import React from "react";

interface TypingIndicatorProps {
  userName: string;
  isVisible: boolean;
}

import { useTranslations } from 'next-intl';

export function TypingIndicator({ userName, isVisible }: TypingIndicatorProps) {
  const t = useTranslations('Chat');
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
      </div>
      <span>{t('typingIndicator.isTyping', { userName, defaultValue: `${userName} is typing...` })}</span>
    </div>
  );
}

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { cn } from "@reservatior/utils";

export interface ConversationItemProps {
  id: string;
  avatar: string;
  name: string;
  lastMessage: string;
  time: Date;
  unreadCount?: number;
  isActive?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
}

import { useTranslations } from "next-intl";

export function ConversationItem({
  id, // eslint-disable-line @typescript-eslint/no-unused-vars
  avatar,
  name,
  lastMessage,
  time,
  unreadCount = 0,
  isActive = false,
  isOnline = false,
  onClick,
}: ConversationItemProps) {
  const t = useTranslations("Chat");
  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center px-4 py-3 transition-colors hover:bg-gray-50",
        isActive && "bg-blue-50"
      )}
      onClick={onClick}
    >
      <div className="relative mr-3">
        <div className="h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-medium text-gray-900">{name}</h3>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(time), { addSuffix: true })}
          </span>
        </div>
        <p className="truncate text-sm text-gray-500">{lastMessage}</p>
      </div>
      {unreadCount > 0 && (
        <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
          {unreadCount > 9 ? t('conversation.unreadOverflow', { defaultValue: '9+' }) : unreadCount}
        </span>
      )}
    </div>
  );
}

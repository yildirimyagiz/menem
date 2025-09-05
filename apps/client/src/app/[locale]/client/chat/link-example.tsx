import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function ChatNavigationLink() {
  return (
    <Link
      href="/client/chat"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      <MessageSquare className="h-5 w-5" />
      <span>Chat</span>
    </Link>
  );
}

// Or with locale support:
export function ChatNavigationLinkWithLocale({ locale }: { locale: string }) {
  return (
    <Link
      href={`/${locale}/client/chat`}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      <MessageSquare className="h-5 w-5" />
      <span>Chat</span>
    </Link>
  );
}

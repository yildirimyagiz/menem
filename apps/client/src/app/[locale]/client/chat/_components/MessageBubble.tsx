import { cn } from "../../../../../../src/lib/utils";
import { highlightEntities } from "./utils/highlightEntities";

export interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
}

export function MessageBubble({ content, isOwn = false }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        isOwn ? "justify-end" : "justify-start",
        "mb-4",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-6 py-4",
          "rounded-3xl",
          isOwn
            ? "rounded-br-md bg-[#0B1220] text-base font-semibold text-white"
            : "rounded-bl-md border border-gray-200 bg-white text-gray-900",
        )}
        style={{
          borderTopRightRadius: isOwn ? 12 : 24,
          borderTopLeftRadius: isOwn ? 24 : 12,
          borderBottomRightRadius: isOwn ? 8 : 24,
          borderBottomLeftRadius: isOwn ? 24 : 8,
        }}
      >
        <span className={cn(isOwn ? "text-base font-semibold" : "text-base")}>
          {highlightEntities(content)}
        </span>
      </div>
    </div>
  );
}

// Typing indicator component
export function TypingIndicator({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center space-x-1 py-1",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex space-x-1 rounded-full px-3 py-2",
          isOwn ? "bg-primary" : "bg-gray-200",
        )}
      >
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-white/80"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-white/80"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-white/80"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

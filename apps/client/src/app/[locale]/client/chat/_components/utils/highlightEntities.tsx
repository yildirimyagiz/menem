import React from "react";

/**
 * Parses a message string and highlights hashtags (#hashtag) and mentions (@username).
 * Hashtags become clickable spans with a blue color; mentions become clickable spans with a purple color.
 *
 * @param content The message content to parse
 * @param onHashtagClick Optional handler for hashtag click
 * @param onMentionClick Optional handler for mention click
 */
export function highlightEntities(
  content: string,
  onHashtagClick?: (hashtag: string) => void,
  onMentionClick?: (mention: string) => void
): React.ReactNode[] {
  // Regex for hashtags and mentions
  const regex = /([#@][\w\p{L}\d_]{1,32})/gu;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(regex)) {
    const matchText = match[0];
    const index = match.index ?? 0;
    // Push preceding text
    if (lastIndex < index) {
      elements.push(content.slice(lastIndex, index));
    }
    if (matchText.startsWith("#")) {
      elements.push(
        <span
          key={`hashtag-${index}`}
          className="text-blue-600 hover:underline cursor-pointer font-semibold"
          onClick={onHashtagClick ? () => onHashtagClick(matchText.slice(1)) : undefined}
        >
          {matchText}
        </span>
      );
    } else if (matchText.startsWith("@")) {
      elements.push(
        <span
          key={`mention-${index}`}
          className="text-purple-600 hover:underline cursor-pointer font-semibold"
          onClick={onMentionClick ? () => onMentionClick(matchText.slice(1)) : undefined}
        >
          {matchText}
        </span>
      );
    }
    lastIndex = index + matchText.length;
  }
  // Push trailing text
  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }
  return elements;
}

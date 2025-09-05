import React from "react";
import Link from "next/link";

import { PostDataType } from "~/data/types";
import Avatar from "~/shared/Avatar";

export interface PostCardMetaProps {
  className?: string;
  meta: Pick<PostDataType, "date" | "author">;
  hiddenAvatar?: boolean;
  size?: "large" | "normal";
}

const PostCardMeta: React.FC<PostCardMetaProps> = ({
  className = "leading-none",
  meta: { date, author },
  hiddenAvatar = false,
  size = "normal",
}) => {
  return (
    <div
      className={`nc-PostCardMeta inline-flex flex-wrap items-center text-neutral-800 dark:text-neutral-200 ${
        size === "normal" ? "text-sm" : "text-base"
      } ${className}`}
      data-nc-id="PostCardMeta"
    >
      <Link
        href={author.href}
        className="relative flex flex-shrink-0 items-center space-x-2"
      >
        {!hiddenAvatar && (
          <Avatar
            radius="rounded-full"
            sizeClass={
              size === "normal" ? "h-6 w-6 text-sm" : "h-10 w-10 text-base"
            }
            imgUrl={author.avatar}
            userName={author.displayName}
          />
        )}
        <span className="block font-medium text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white">
          {author.displayName}
        </span>
      </Link>
      <span className="mx-[6px] font-medium text-neutral-500 dark:text-neutral-400">
        ·
      </span>
      <span className="line-clamp-1 font-normal text-neutral-500 dark:text-neutral-400">
        {date}
      </span>
    </div>
  );
};

export default PostCardMeta;

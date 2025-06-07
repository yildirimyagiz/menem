import type { FC } from "react";
import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

import Avatar from "~/shared/Avatar";

export interface ReviewData {
  id: string;
  stars: number;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface CommentPropertyProps {
  className?: string;
  data: ReviewData;
  hasPropertyTitle?: boolean;
}

const CommentProperty: FC<CommentPropertyProps> = ({
  className = "",
  data,
  hasPropertyTitle,
}) => {
  if (!data) {
    return <div>No data available</div>; // Handle the case where data is undefined
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div
      className={`nc-CommentProperty flex space-x-4 ${className}`}
      data-nc-id="CommentProperty"
    >
      <div className="pt-0.5">
        <Avatar
          sizeClass="h-14 w-14 text-lg"
          radius="rounded-full"
          userName={data.user?.name ?? "Anonymous"}
          imgUrl={data.user?.image ?? undefined}
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between space-x-3">
          <div className="flex flex-col">
            <div className="text-sm font-semibold">
              <span>{data.user?.name ?? "Anonymous"}</span>
              {hasPropertyTitle && (
                <>
                  <span className="font-normal text-neutral-500 dark:text-neutral-400">
                    {` review in `}
                  </span>
                  <a href="/" className="text-blue-500 hover:underline">
                    The Lounge & Bar
                  </a>
                </>
              )}
            </div>
            <span className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              {formatDate(data.createdAt)}
            </span>
          </div>
          <div className="flex text-yellow-500">
            {[...Array(data.stars)].map((_, index) => (
              <StarIcon key={index} className="h-4 w-4" />
            ))}
          </div>
        </div>
        <span className="mt-3 block text-neutral-600 dark:text-neutral-300">
          {data.comment}
        </span>
      </div>
    </div>
  );
};

export default CommentProperty;

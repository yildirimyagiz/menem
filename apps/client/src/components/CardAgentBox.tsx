import type { FC } from "react";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";

import Avatar from "../shared/Avatar";
import Badge from "../shared/Badge";

// import { TAgent } from '@/data/agents' // Uncomment and fix path if you have TAgent type

interface CardAgentBoxProps {
  className?: string;
  agent: any; // Change to TAgent if available
  index?: number;
}

const CardAgentBox: FC<CardAgentBoxProps> = ({
  className = "",
  agent,
  index,
}) => {
  const { displayName, handle = "/", avatarUrl, starRating, jobName } = agent;
  return (
    <Link
      href={`/agents/${handle}`}
      className={`nc-box-has-hover relative flex flex-col items-center justify-center px-3 py-5 text-center sm:px-6 sm:py-7 ${className}`}
    >
      {index && (
        <Badge
          className="absolute left-3 top-3"
          color={index === 1 ? "red" : index === 2 ? "blue" : "green"}
        >
          #{index}
        </Badge>
      )}
      <Avatar
        containerClassName="size-20"
        imgUrl={avatarUrl}
        userName={displayName}
      />
      <div className="mt-3">
        <h2 className={`text-base font-medium`}>
          <span className="line-clamp-1">{displayName}</span>
        </h2>
        <span
          className={`mt-1 block text-sm text-neutral-500 dark:text-neutral-400`}
        >
          {jobName}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-center rounded-full bg-neutral-100 px-4 py-2 dark:bg-neutral-800">
        <span className="pt-px text-xs font-medium">{starRating ?? 4.9}</span>
        <StarIcon className="mb-px ms-2 size-4 text-amber-500" />
      </div>
    </Link>
  );
};

export default CardAgentBox;

import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { TaxonomyType } from "~/data/types";

export interface CardCategory1Props {
  className?: string;
  taxonomy: TaxonomyType;
  size?: "large" | "normal";
}

const CardCategory1: FC<CardCategory1Props> = ({
  className = "",
  size = "normal",
  taxonomy,
}) => {
  const { count, name, href = "/", thumbnail } = taxonomy;

  return (
    <Link
      href={href}
      className={`nc-CardCategory1 flex items-center ${className}`}
      aria-label={`View ${name} category with ${count} articles`}
    >
      <div
        className={`relative flex-shrink-0 ${
          size === "large" ? "h-20 w-20" : "h-12 w-12"
        } mr-4 overflow-hidden rounded-lg`}
        role="img"
        aria-label={`Thumbnail for ${name} category`}
      >
        <Image
          alt={`Thumbnail for ${name} category`}
          fill
          src={thumbnail || ""}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>

      <div>
        <h2
          className={`${
            size === "large" ? "text-lg" : "text-base"
          } font-semibold text-neutral-900 dark:text-neutral-100`}
        >
          {name}
        </h2>
        <span
          className={`${
            size === "large" ? "text-sm" : "text-xs"
          } mt-1 block text-neutral-500 dark:text-neutral-400`}
        >
          {count} Articles
        </span>
      </div>
    </Link>
  );
};

export default React.memo(CardCategory1);

import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import type { TaxonomyType } from "~/data/types";
import convertNumbThousand from "~/utils/convertNumbThousand";

export interface CardCategory3Props {
  className?: string;
  taxonomy: TaxonomyType;
}

const CardCategory3: FC<CardCategory3Props> = ({
  className = "",
  taxonomy,
}) => {
  const { count, name, href = "/", thumbnail } = taxonomy;

  return (
    <Link
      href={href}
      className={`nc-CardCategory3 flex flex-col ${className}`}
      aria-label={`View ${name} category with ${convertNumbThousand(count ?? 0)} properties`}
    >
      <div
        className="aspect-w-5 aspect-h-5 sm:aspect-h-6 group relative h-0 w-full flex-shrink-0 overflow-hidden rounded-2xl"
        role="img"
        aria-label={`Thumbnail for ${name} category`}
      >
        <Image
          src={thumbnail ?? ""}
          className="h-full w-full rounded-2xl object-cover"
          alt={`Thumbnail for ${name} category`}
          fill
          sizes="(max-width: 400px) 100vw, 300px"
        />
        <span
          className="absolute inset-0 bg-black bg-opacity-10 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      <div className="mt-4 truncate">
        <h2 className="truncate text-base font-medium text-neutral-900 dark:text-neutral-100 sm:text-lg">
          {name}
        </h2>
        <span className="mt-1.5 block text-sm text-neutral-600 dark:text-neutral-400">
          {convertNumbThousand(count ?? 0)} properties
        </span>
      </div>
    </Link>
  );
};

export default React.memo(CardCategory3);

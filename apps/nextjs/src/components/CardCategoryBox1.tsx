import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import type { TaxonomyType } from "~/data/types";
import Badge from "~/shared/Badge";
import convertNumbThousand from "~/utils/convertNumbThousand";

export interface CardCategoryBox1Props {
  className?: string;
  taxonomy: TaxonomyType;
}

const CardCategoryBox1: FC<CardCategoryBox1Props> = ({
  className = "",
  taxonomy,
}) => {
  const { count, name, thumbnail, href = "/" } = taxonomy;

  return (
    <Link
      href={href}
      className={`nc-CardCategoryBox1 group relative flex items-center overflow-hidden rounded-xl p-3 sm:p-6 ${className}`}
      aria-label={`View category ${name} with ${convertNumbThousand(count)} items`}
      data-nc-id="CardCategoryBox1"
    >
      <Badge
        className="absolute right-2 top-2"
        color="gray"
        name={convertNumbThousand(count)}
      />

      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
        <Image
          src={thumbnail ?? ""}
          fill
          alt={`Thumbnail for ${name} category`}
          sizes="(max-width: 400px) 100vw, 400px"
          className="object-cover"
        />
      </div>
      <div className="ml-4 flex-grow overflow-hidden">
        <h2 className="text-base font-medium">
          <span className="line-clamp-1">{name}</span>
        </h2>
        <span
          className={`mt-2 block text-sm text-neutral-500 dark:text-neutral-400`}
        >
          19 minutes drive
        </span>
      </div>
    </Link>
  );
};

export default React.memo(CardCategoryBox1);

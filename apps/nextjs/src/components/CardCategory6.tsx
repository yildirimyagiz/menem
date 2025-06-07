import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import type { TaxonomyType } from "~/data/types";
import convertNumbThousand from "~/utils/convertNumbThousand";

export interface CardCategory6Props {
  className?: string;
  taxonomy: TaxonomyType;
}

const CardCategory6: FC<CardCategory6Props> = ({
  className = "flex-1",
  taxonomy,
}) => {
  const { count, name, href = "/", thumbnail } = taxonomy;

  return (
    <Link
      href={href}
      className={`nc-CardCategory6 group relative flex w-full overflow-hidden rounded-2xl ${className}`}
      aria-label={`View ${name} category with ${convertNumbThousand(count ?? 0)} properties`}
      data-nc-id="CardCategory6"
    >
      <div className="aspect-w-16 aspect-h-10 sm:aspect-h-12 xl:aspect-h-9 h-0 w-full"></div>
      <Image
        fill
        alt={`Thumbnail for ${name} category`}
        src={thumbnail ?? ""}
        className="rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, 400px"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
        <span
          className="absolute inset-0 bg-gradient-to-t from-black/60"
          aria-hidden="true"
        ></span>
        <h2 className={`relative text-lg font-semibold lg:text-xl`}>{name}</h2>
        <span className={`relative mt-1.5 block text-sm text-neutral-100`}>
          {convertNumbThousand(count ?? 0)} properties
        </span>
      </div>
    </Link>
  );
};

export default React.memo(CardCategory6);

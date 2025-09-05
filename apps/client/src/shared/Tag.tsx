import type { FC } from "react";
import React from "react";
import Link from "next/link";

import type { TaxonomyType } from "~/components/SectionSliderNewCategories";
import type { Route } from "~/routers/types";

export interface TagProps {
  className?: string;
  tag: TaxonomyType;
  hideCount?: boolean;
}

const Tag: FC<TagProps> = ({ className = "", tag, hideCount = false }) => {
  return (
    <Link
      className={`nc-Tag text-neutral-6000 dark:hover:border-neutral-6000 inline-block rounded-lg border border-neutral-100 bg-white px-3 py-2 text-sm hover:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 md:px-4 md:py-2.5 ${className}`}
      href={tag.href}
    >
      {`${tag.name}`}
      {!hideCount && (
        <span className="text-xs font-normal"> ({tag.count})</span>
      )}
    </Link>
  );
};

export default Tag;

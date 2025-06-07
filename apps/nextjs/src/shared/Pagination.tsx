import type { FC } from "react";
import React from "react";
import Link from "next/link";

import type { CustomLink } from "~/data/types";
import type { Route } from "~/routers/types";
import twFocusClass from "~/utils/twFocusClass";

const DEMO_PAGINATION: CustomLink[] = [
  {
    label: "1",
    href: "#",
    path: "",
  },
  {
    label: "2",
    href: "#",
    path: "",
  },
  {
    label: "3",
    href: "#",
    path: "",
  },
  {
    label: "4",
    href: "#",
    path: "",
  },
];

export interface PaginationProps {
  className?: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  className = "",
  page,
  totalPages,
  onPageChange,
}) => {
  const renderItem = (pag: CustomLink, index: number) => {
    const isActive = index === page - 1; // Check if the current item is active
    const itemClass = isActive
      ? "bg-primary-6000 text-white"
      : "bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700";

    return isActive ? (
      <span
        key={pag.label}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${itemClass} ${twFocusClass()}`}
        aria-current="page"
      >
        {pag.label}
      </span>
    ) : (
      <Link
        key={pag.label}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${itemClass} ${twFocusClass()}`}
        href={pag.href as Route}
        aria-label={`Page ${pag.label}`}
        onClick={(e) => {
          e.preventDefault();
          const pageNum = parseInt(pag.label);
          if (pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum);
          }
        }}
      >
        {pag.label}
      </Link>
    );
  };

  return (
    <nav
      className={`nc-Pagination inline-flex space-x-1 text-base font-medium ${className}`}
      aria-label="Pagination"
    >
      {DEMO_PAGINATION.map(renderItem)}
    </nav>
  );
};

export default Pagination;

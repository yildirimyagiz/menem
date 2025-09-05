"use client";

import type { FC } from "react";
import React from "react";
import Link from "next/link";

import type { PathName } from "~/types/type";

interface Props {
  href?: PathName;
}

const ButtonSubmit: FC<Props> = ({ href = "/listing-hotel-map" }) => {
  return (
    <Link
      href={href}
      className="bg-primary-600 hover:bg-primary-700 flex h-14 w-full items-center justify-center rounded-full text-neutral-50 focus:outline-none md:h-16 md:w-16"
    >
      <span className="mr-3 md:hidden">Search</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </Link>
  );
};

export default ButtonSubmit;

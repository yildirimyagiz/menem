"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import type { PathName } from "~/routers/types";
import MenuBar from "~/shared/MenuBar";
import isInViewport from "~/utils/isInViewport";

let WIN_PREV_POSITION = 0;
if (typeof window !== "undefined") {
  WIN_PREV_POSITION = window.pageYOffset;
}

interface NavItem {
  name: string;
  link?: PathName;
  icon: React.ComponentType<any>;
}

const NAV: NavItem[] = [
  {
    name: "Explore",
    link: "/",
    icon: MagnifyingGlassIcon,
  },
  {
    name: "Wishlists",
    link: "/favorites",
    icon: HeartIcon,
  },
  {
    name: "Log in",
    link: "/account",
    icon: UserCircleIcon,
  },
  {
    name: "Menu",
    icon: MenuBar,
  },
];

const FooterNav: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame(showHideFooterNav);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showHideFooterNav = () => {
    const currentScrollPos = window.pageYOffset;
    if (!containerRef.current) return;

    if (currentScrollPos > WIN_PREV_POSITION) {
      if (
        isInViewport(containerRef.current) &&
        currentScrollPos - WIN_PREV_POSITION < 80
      ) {
        return;
      }
      containerRef.current.classList.add("FooterNav--hide");
    } else {
      if (
        !isInViewport(containerRef.current) &&
        WIN_PREV_POSITION - currentScrollPos < 80
      ) {
        return;
      }
      containerRef.current.classList.remove("FooterNav--hide");
    }

    WIN_PREV_POSITION = currentScrollPos;
  };

  const renderItem = (item: NavItem, index: number) => {
    const isActive = pathname === item.link;

    const commonClasses = `flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
      isActive ? "text-neutral-900 dark:text-neutral-100" : ""
    }`;

    return item.link ? (
      <Link key={index} href={item.link} className={commonClasses}>
        <item.icon className={`h-6 w-6 ${isActive ? "text-red-600" : ""}`} />
        <span
          className={`mt-1 text-[11px] leading-none ${isActive ? "text-red-600" : ""}`}
        >
          {item.name}
        </span>
      </Link>
    ) : (
      <div key={index} className={commonClasses}>
        <item.icon className="h-6 w-6" />
        <span className="mt-1 text-[11px] leading-none">{item.name}</span>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="FooterNav fixed inset-x-0 bottom-0 z-30 block border-t border-neutral-300 bg-white p-2 transition-transform duration-300 ease-in-out dark:border-neutral-700 dark:bg-neutral-800 md:hidden"
    >
      <div className="mx-auto flex w-full max-w-lg justify-around text-center text-sm">
        {NAV.map(renderItem)}
      </div>
    </div>
  );
};

export default FooterNav;

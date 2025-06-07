/**
"use client";

import React from "react";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import type { NavItemType } from "./NavigationItem";
import ButtonClose from "~/shared/ButtonClose";
import ButtonPrimary from "~/shared/ButtonPrimary";
import Logo from "~/shared/Logo";
import SocialsList from "~/shared/SocialsList";
import SwitchDarkMode from "~/shared/SwitchDarkMode";

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({
  data = NAVIGATION_DEMO,
  onClickClose,
}) => {
  const renderMenuChild = (item: NavItemType) => (
    <ul className="nav-mobile-sub-menu pb-1 pl-6 text-base">
      {item.children?.map((i, index) => (
        <Disclosure key={`${i.href}-${index}`} as="li">
          {({ open }) => (
            <>
              <Link
                href={i.href || "#"}
                className="mt-0.5 flex rounded-lg px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <span
                  className={`py-2.5 pr-3 ${!i.children ? "block w-full" : ""}`}
                >
                  {i.name}
                </span>
                {i.children && (
                  <Disclosure.Button
                    as="span"
                    className="flex flex-1 items-center justify-end py-2.5"
                  >
                    <ChevronDownIcon
                      className={`ml-2 h-4 w-4 text-neutral-500 ${open ? "rotate-180 transform" : ""}`}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                )}
              </Link>
              {i.children && (
                <Disclosure.Panel>{renderMenuChild(i)}</Disclosure.Panel>
              )}
            </>
          )}
        </Disclosure>
      ))}
    </ul>
  );

  const renderItem = (item: NavItemType) => (
    <Disclosure
      key={item.id}
      as="li"
      className="text-neutral-900 dark:text-white"
    >
      {({ open }) => (
        <>
          <Link
            href={item.href || "#"}
            className="flex w-full rounded-lg px-4 text-sm font-medium uppercase tracking-wide hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <span
              className={`py-2.5 pr-3 ${!item.children ? "block w-full" : ""}`}
            >
              {item.name}
            </span>
            {item.children && (
              <Disclosure.Button
                as="span"
                className="flex flex-1 items-center justify-end py-2.5"
              >
                <ChevronDownIcon
                  className={`ml-2 h-4 w-4 text-neutral-500 ${open ? "rotate-180 transform" : ""}`}
                  aria-hidden="true"
                />
              </Disclosure.Button>
            )}
          </Link>
          {item.children && (
            <Disclosure.Panel>{renderMenuChild(item)}</Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );

  return (
    <div className="h-screen w-full transform divide-y-2 divide-neutral-100 overflow-y-auto bg-white py-2 shadow-lg ring-1 transition dark:divide-neutral-800 dark:bg-neutral-900 dark:ring-neutral-700">
      <div className="px-5 py-6">
        <Logo />
        <div className="mt-5 flex flex-col text-sm text-neutral-700 dark:text-neutral-300">
          <span>
            Discover the most outstanding articles on all topics of life. Write
            your stories and share them
          </span>

          <div className="mt-4 flex items-center justify-between">
            <SocialsList itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800 dark:text-neutral-300" />
            <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
        <ButtonClose
          className="absolute right-2 top-2 p-1"
          onClick={onClickClose}
        />
      </div>
      <ul className="flex flex-col space-y-1 px-2 py-6">
        {data.map(renderItem)}
      </ul>
      <div className="flex items-center justify-between px-5 py-6">
        <a
          className="inline-block"
          href="https://themeforest.net/item/chisfis-online-booking-nextjs-template/43399526"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ButtonPrimary type={"button"} className={""} loading={false}>
            Get Template
          </ButtonPrimary>
        </a>

        <LangDropdown
          className="flex"
          panelClassName="z-10 w-screen max-w-[280px] px-4 mb-3 right-3 bottom-full sm:px-0"
        />
      </div>
    </div>
  );
};

export default NavMobile;
*/

/** 
// "use client";    

import type { FC } from "react";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import type { Route } from "~/routers/types";
import { PathName } from "~/routers/types";

// Define UserRole enum
export enum UserRole {
  Admin = "Admin",
  Moderator = "Moderator",
  User = "User",
  Guest = "Guest",
  Agent = "Agent",
  Agency = "Agency",
  Tenant = "Tenant",
  Buyer = "Buyer",
}

export interface MegamenuItem {
  id: string;
  image: string;
  title: string;
  items: NavItemType[];
}

export interface NavItemType {
  id: string;
  href: Route<string>; // Change this to Route<string>
  name: string;
  isNew?: boolean;
  targetBlank?: boolean;
  children?: NavItemType[];
  megaMenu?: MegamenuItem[];
  type?: "dropdown" | "megaMenu" | "none";
}

export interface NavigationItemProps {
  menuItem: NavItemType;
}

const NavigationItem: FC<NavigationItemProps> = ({ menuItem }) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const locationPathName = usePathname();

  useEffect(() => {
    setHoveredMenu(null);
  }, [locationPathName]);

  const handleMouseEnter = (id: string) => setHoveredMenu(id);
  const handleMouseLeave = () => setHoveredMenu(null);

  const isHovering = (id: string) => hoveredMenu === id;

  const menuClass = {
    megaMenu: `menu-megamenu ${menuItem.megaMenu?.length && menuItem.megaMenu.length > 3 ? "menu-megamenu--large" : "menu-megamenu--small"}`,
    dropdown: "menu-item flex items-center menu-dropdown relative",
    main: "inline-flex items-center text-sm xl:text-base font-normal text-neutral-700 dark:text-neutral-300 py-2 px-4 xl:px-5 rounded-full hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
  };

  const renderMainItem = (item: NavItemType) => {
    return (
      <Link
        href={
          typeof item.href === "string" ? { pathname: item.href } : item.href
        }
        rel="noopener noreferrer"
        className={menuClass.main}
      >
        {item.name}
        {item.type && (
          <ChevronDownIcon
            className="-mr-1 ml-1 h-4 w-4 text-neutral-400"
            aria-hidden="true"
          />
        )}
      </Link>
    );
  };

  const renderMegaMenu = (menu: NavItemType) => (
    <Popover
      as="li"
      className={`menu-item flex items-center ${menuClass.megaMenu}`}
      onMouseEnter={() => handleMouseEnter(menu.id)}
      onMouseLeave={handleMouseLeave}
    >
      <div>{renderMainItem(menu)}</div>
      <Transition
        as={Fragment}
        show={isHovering(menu.id)}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          static
          className={`sub-menu absolute top-full z-10 w-screen max-w-sm transform px-4 will-change-transform sm:px-0 lg:max-w-max ${menuItem.megaMenu?.length && menuItem.megaMenu.length > 3 ? "left-0" : "left-1/2 -translate-x-1/2"}`}
        >
          <div className="overflow-hidden rounded-lg text-sm shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
            <div
              className={`relative grid gap-1 bg-white px-3 py-6 dark:bg-neutral-900 grid-cols-${menuItem.megaMenu?.length ?? 1}`}
            >
              {menuItem.megaMenu?.map((item) => (
                <div key={item.id}>
                  <div className="px-2">
                    <div className="relative flex h-24 w-36 overflow-hidden rounded-lg">
                      <Image alt="" src={item.image} fill sizes="200px" />
                    </div>
                  </div>
                  <p className="my-2 px-2 py-1 font-medium text-neutral-900 dark:text-neutral-200">
                    {item.title}
                  </p>
                  <ul className="grid space-y-1">
                    {item.items.map(renderDropdownMenuNavlink)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );

  const renderDropdownMenu = (menuDropdown: NavItemType) => (
    <Popover
      as="li"
      className={`menu-item flex items-center ${menuClass.dropdown} ${menuDropdown.isNew ? "menuIsNew_lv1" : ""}`}
      onMouseEnter={() => handleMouseEnter(menuDropdown.id)}
      onMouseLeave={handleMouseLeave}
    >
      <div>{renderMainItem(menuDropdown)}</div>
      <Transition
        as={Fragment}
        show={isHovering(menuDropdown.id)}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          static
          className="sub-menu absolute left-0 top-full z-10 w-56 transform will-change-transform"
        >
          <ul className="relative grid space-y-1 rounded-lg bg-white py-4 text-sm shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-900 dark:ring-white dark:ring-opacity-10">
            {menuDropdown.children?.map((item) => (
              <li
                key={item.id}
                className={`px-2 ${item.isNew ? "menuIsNew" : ""}`}
              >
                {item.type
                  ? renderDropdownMenuNavlinkHasChild(item)
                  : renderDropdownMenuNavlink(item)}
              </li>
            ))}
          </ul>
        </Popover.Panel>
      </Transition>
    </Popover>
  );

  const renderDropdownMenuNavlinkHasChild = (item: NavItemType) => (
    <Popover
      as="li"
      key={item.id}
      className="menu-item menu-dropdown relative flex items-center px-2"
      onMouseEnter={() => handleMouseEnter(item.id)}
      onMouseLeave={handleMouseLeave}
    >
      <div>{renderDropdownMenuNavlink(item)}</div>
      <Transition
        as={Fragment}
        show={isHovering(item.id)}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          static
          className="sub-menu absolute left-full top-0 z-10 w-56 pl-2"
        >
          <ul className="relative grid space-y-1 rounded-lg bg-white py-4 text-sm shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-900 dark:ring-white dark:ring-opacity-10">
            {item.children?.map((i) =>
              i.type
                ? renderDropdownMenuNavlinkHasChild(i)
                : renderDropdownMenuNavlink(i),
            )}
          </ul>
        </Popover.Panel>
      </Transition>
    </Popover>
  );

  const renderDropdownMenuNavlink = (item: NavItemType) => (
    <Link
      href={typeof item.href === "string" ? { pathname: item.href } : item.href}
      target={item.targetBlank ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="text-neutral-6000 flex items-center rounded-md px-4 py-2 font-normal hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
    >
      {item.name}
      {item.type && (
        <ChevronDownIcon
          className="ml-2 h-4 w-4 text-neutral-500"
          aria-hidden="true"
        />
      )}
    </Link>
  );

  switch (menuItem.type) {
    case "megaMenu":
      return renderMegaMenu(menuItem);
    case "dropdown":
      return renderDropdownMenu(menuItem);
    default:
      return (
        <li className="menu-item flex items-center">
          {renderMainItem(menuItem)}
        </li>
      );
  }
};

export default NavigationItem;

*/

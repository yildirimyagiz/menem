"use client";

import React from "react";

import type { CustomLink } from "~/data/types";
import Logo from "~/shared/Logo";
import SocialsList1 from "~/shared/SocialsList1";
import FooterNav from "./FooterNav";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "1",
    title: "For Sale & Rent",
    menus: [
      {
        href: "#",
        label: "Real Estate - For Sale",
        path: "",
      },
      {
        href: "#",
        label: "Real Estate - For Rent",
        path: "",
      },
      {
        href: "#",
        label: "Cars - For Sale",
        path: "",
      },
      {
        href: "#",
        label: "Cars - For Rent",
        path: "",
      },
      {
        href: "#",
        label: "Hotels - For Sale",
        path: "",
      },
      {
        href: "#",
        label: "Hotels - For Rent",
        path: "",
      },
      {
        href: "#",
        label: "Experiences - For Sale",
        path: "",
      },
      {
        href: "#",
        label: "Experiences - For Rent",
        path: "",
      },
      {
        href: "#",
        label: "Tickets - For Sale",
        path: "",
      },
      {
        href: "#",
        label: "Reservations - For Sale",
        path: "",
      },
      {
        href: "#",
        label: "Reservations - For Rent",
        path: "",
      },
    ],
  },
  {
    id: "2",
    title: "Account & Payments",
    menus: [
      {
        href: "#",
        label: "Profile Settings",
        path: "",
      },
      {
        href: "#",
        label: "Account Security",
        path: "",
      },
      {
        href: "#",
        label: "Payment Methods",
        path: "",
      },
      {
        href: "#",
        label: "Subscription Plans",
        path: "",
      },
      {
        href: "#",
        label: "Manage Payments",
        path: "",
      },
      {
        href: "#",
        label: "Payment Settings",
        path: "",
      },
      {
        href: "#",
        label: "Generate Invoices",
        path: "",
      },
      {
        href: "#",
        label: "View Payment History",
        path: "",
      },
    ],
  },
  {
    id: "3",
    title: "Support & Reports",
    menus: [
      {
        href: "#",
        label: "Create Report",
        path: "",
      },
      {
        href: "#",
        label: "View Reports",
        path: "",
      },
      {
        href: "#",
        label: "Download Reports",
        path: "",
      },
      {
        href: "#",
        label: "FAQs",
        path: "",
      },
      {
        href: "#",
        label: "Contact Support",
        path: "",
      },
      {
        href: "#",
        label: "Help Articles",
        path: "",
      },
      {
        href: "#",
        label: "Submit a Ticket",
        path: "",
      },
    ],
  },
  {
    id: "4",
    title: "Community & Information",
    menus: [
      {
        href: "#",
        label: "Discussion Forums",
        path: "",
      },
      {
        href: "#",
        label: "Code of Conduct",
        path: "",
      },
      {
        href: "#",
        label: "Community Resources",
        path: "",
      },
      {
        href: "#",
        label: "Contributing",
        path: "",
      },
      {
        href: "#",
        label: "Concurrent Mode",
        path: "",
      },
      {
        href: "#",
        label: "How It Works",
        path: "",
      },
      {
        href: "#",
        label: "Help & Support",
        path: "",
      },
    ],
  },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                className="text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                href={typeof item.href === "string" ? item.href : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <FooterNav />

      <div className="nc-Footer relative border-t border-neutral-200 py-24 dark:border-neutral-700 lg:py-28">
        <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
          <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
            <div className="col-span-2 md:col-span-1">
              <Logo />
            </div>
            <div className="col-span-2 flex items-center md:col-span-3">
              <SocialsList1 className="flex items-center space-x-3 lg:flex-col lg:items-start lg:space-x-0 lg:space-y-2.5" />
            </div>
          </div>
          {widgetMenus.map(renderWidgetMenuItem)}
        </div>
      </div>
    </>
  );
};

export default Footer;

"use client";

import type { PopoverPanelProps } from "@headlessui/react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from "@headlessui/react";
import {
  BanknotesIcon,
  GlobeAltIcon,
  SlashIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { FC } from "react";


interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}
interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
}

const Currencies = ({ currencies }: { currencies: Currency[] }) => {
  if (!currencies || currencies.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-neutral-400">
        No currencies available.
      </div>
    );
  }
  return (
    <div className="grid max-h-64 grid-cols-1 justify-items-center gap-2 overflow-y-auto">
      {currencies.map((item, index) => (
        <button
          key={item.id}
          className={clsx(
            "focus:outline-hidden flex flex-col items-center justify-center rounded-lg p-2.5 text-center transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700",
          )}
        >
          <span className="mb-1 text-2xl">{item.symbol}</span>
          <span className="text-sm font-medium">
            {item.code} - {item.name}
          </span>
        </button>
      ))}
    </div>
  );
};

const Languages = ({ languages }: { languages: Language[] }) => {
  return (
    <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
      {languages.map((item) => (
        <button
          key={item.id}
          className={clsx(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-700",
          )}
        >
          <span className="text-lg">{getFlagEmoji(item.code)}</span>
          <span className="truncate text-sm font-medium">
            {item.code} - {item.name} ({item.nativeName})
          </span>
        </button>
      ))}
    </div>
  );
};

// Helper to get emoji flag from language code
function getFlagEmoji(code: string) {
  const map: Record<string, string> = {
    en: "🇺🇸",
    tr: "🇹🇷",
    zh: "🇨🇳",
    es: "🇪🇸",
    ar: "🇸🇦",
    hi: "🇮🇳",
    fr: "🇫🇷",
    fa: "🇮🇷",
    de: "🇩🇪",
    ja: "🇯🇵",
    it: "🇮🇹",
    ru: "🇷🇺",
    th: "🇹🇭",
  };
  return map[code] ?? "🏳️";
}

interface Props {
  panelAnchor?: PopoverPanelProps["anchor"];
  panelClassName?: PopoverPanelProps["className"];
  className?: string;
  currencies: Currency[];
  languages: Language[];
}

const CurrLangDropdown: FC<Props> = ({
  panelAnchor = {
    to: "bottom end",
    gap: 16,
  },
  className,
  languages,
  currencies,
  panelClassName = "w-sm",
}) => {
  return (
    <Popover className={clsx("group", className)}>
      <PopoverButton className="focus:outline-hidden focus-visible:outline-hidden -m-2.5 flex items-center p-2.5 text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
        <GlobeAltIcon className="size-5" />
        <SlashIcon className="size-5 opacity-60" />
        <BanknotesIcon className="size-5" />
        <ChevronDownIcon
          className="group-data-open:rotate-180 ms-1 size-4"
          aria-hidden="true"
        />
      </PopoverButton>

      <PopoverPanel
        anchor={panelAnchor}
        transition
        className={clsx(
          "data-closed:translate-y-1 data-closed:opacity-0 z-40 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out dark:bg-neutral-800",
          panelClassName,
        )}
      >
        <TabGroup>
          <TabList className="flex space-x-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-700">
            {["Language", "Currency"].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  clsx(
                    "focus:outline-hidden w-full rounded-full py-2 text-sm font-medium leading-5 text-neutral-700 focus:ring-0",
                    selected
                      ? "bg-white shadow-sm"
                      : "text-neutral-700 hover:bg-white/70 dark:text-neutral-300 dark:hover:bg-neutral-900/40",
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-5">
            <TabPanel className="focus:outline-hidden rounded-xl p-3 focus:ring-0">
              <Languages languages={languages} />
            </TabPanel>
            <TabPanel className="focus:outline-hidden rounded-xl p-3 focus:ring-0">
              <Currencies currencies={currencies} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </PopoverPanel>
    </Popover>
  );
};
export default CurrLangDropdown;

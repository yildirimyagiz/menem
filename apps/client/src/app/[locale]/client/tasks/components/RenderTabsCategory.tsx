"use client";

import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";

import { TaskCategoryEnum } from "@reservatior/validators";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import Checkbox from "~/shared/Checkbox";

// Human-friendly category labels and descriptions
const categoryMeta: Record<string, { label: string; description: string }> = {
  CLEANING: { label: "Cleaning", description: "Cleaning related tasks" },
  REPAIR: { label: "Repair", description: "Repair and maintenance tasks" },
  DECORATION: {
    label: "Decoration",
    description: "Decoration and improvement tasks",
  },
  SERVICE: { label: "Service", description: "Service-related tasks" },
  MOVING: { label: "Moving", description: "Moving and logistics tasks" },
};

const categoryOptions = TaskCategoryEnum.options.map((name) => ({
  name,
}));

const RenderTabsCategory: React.FC = () => {
  const t = useTranslations("tasks");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const filteredCategoryOptions = categoryOptions.filter((item) =>
    t("category." + item.name)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              open
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="inline-flex items-center">
              <i className="las la-layer-group mr-2 text-lg"></i>
              {t("category.title")}
            </span>
            <i
              className={`las la-angle-down ml-2 transition-transform ${open ? "rotate-180" : ""}`}
            ></i>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition-all ease-out duration-300"
            enterFrom="opacity-0 translate-y-2 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition-all ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-2 scale-95"
          >
            <Popover.Panel className="absolute left-0 z-20 mt-3 w-screen max-w-sm px-2 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-3xl border-0 bg-white/60 shadow-2xl ring-1 ring-blue-100 backdrop-blur-lg">
                {/* Section header */}
                <div className="px-6 pb-2 pt-6">
                  <h3 className="text-lg font-extrabold tracking-tight text-blue-700">
                    {t("category.title")}
                  </h3>
                  {categoryOptions.length > 8 && (
                    <input
                      type="text"
                      placeholder={t("common.search")}
                      className="mt-2 w-full rounded-lg border px-3 py-2 text-sm shadow-inner focus:ring-2 focus:ring-blue-400"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label={t("common.search")}
                    />
                  )}
                </div>
                {/* Pill tab bar */}
                <div className="scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent flex max-h-52 flex-wrap gap-2 overflow-y-auto px-6 pb-4">
                  {filteredCategoryOptions.length === 0 ? (
                    <span className="text-sm text-gray-400">
                      {t("common.noResults")}
                    </span>
                  ) : (
                    filteredCategoryOptions.map((item) => (
                      <button
                        key={item.name}
                        className={`min-w-0 max-w-full truncate rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          selected === item.name
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        } `}
                        onClick={() => {
                          setSelected(item.name);
                          close();
                        }}
                        style={{ minWidth: 90 }}
                        title={t("category." + item.name)}
                      >
                        {t("category." + item.name)}
                      </button>
                    ))
                  )}
                </div>
                {/* Divider below tab bar */}
                <div className="border-t border-blue-100" />
                {/* Clear button only if a filter is active */}
                {selected && (
                  <div className="flex items-center justify-end bg-gradient-to-r from-blue-50/80 to-purple-50/80 px-6 py-4">
                    <button
                      onClick={() => {
                        setSelected(null);
                        close();
                      }}
                      className="px-0 text-sm font-medium text-blue-600 hover:underline"
                    >
                      {t("common.clear")}
                    </button>
                  </div>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default RenderTabsCategory;

"use client";

// React imports
import type { FC, SetStateAction } from "react";
import { Fragment, useState } from "react";
import { useParams } from "next/navigation";
// Third-party library imports
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { TaskFilterInput } from "@reservatior/validators";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";

import type { Task } from "~/utils/interfaces";
import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import Checkbox from "~/shared/Checkbox";
import { api } from "~/trpc/react";
import FilterTranslationProvider from "./components/FilterTranslationProvider";
import RenderTabsCategory from "./components/RenderTabsCategory";
import RenderTabsDateRange from "./components/RenderTabsDateRange";
import RenderTabsLabel from "./components/RenderTabsLabel";
import RenderTabsStatus from "./components/RenderTabsStatus";
import RenderTabsType from "./components/RenderTabsType";
import TabMobileFilter from "./components/TabMobileFilter";

type TaskApiResponse =
  | {
      data: {
        data: (Task | null)[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
      meta: Record<string, unknown> | undefined;
    }
  | undefined;

const filterOptions = [
  "Task Type",
  "Priority",
  "Status",
  "Due Date",
  "Assigned To",
  "Property",
  "Facility",
  "Cost",
  "Estimated Time",
  "Recurring",
  "Attachments",
  "Notes",
  "Task Status",
  "Featured",
  "Location Info",
];

interface TabFiltersProps {
  onChange: (filters: Partial<TaskFilterInput>) => void;
  currentFilters: TaskFilterInput;
  onFilterChange: (newFilters: Partial<TaskFilterInput>) => void;
  setDataSource?: (source: "database" | "google") => void;
}

const defaultTaskFilterParams: TaskFilterInput = {
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  pageSize: 12,
};

const statusOptions = [
  { name: "TODO", description: "Task is waiting to be started" },
  { name: "IN_PROGRESS", description: "Task is currently being worked on" },
  { name: "COMPLETED", description: "Task has been finished" },
  { name: "CANCELLED", description: "Task has been cancelled" },
] as const;

const TabFilters: FC<TabFiltersProps> = ({
  onChange: _onFilterChange,
  currentFilters: _currentFilters,
  setDataSource: _setDataSource,
}) => {
  const params = useParams();
  const _locale = (params?.locale as string) || "en";
  const t = useTranslations();

  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);

  const [taskTypes, setTaskTypes] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);

  // Add new state for filter parameters
  const [filterParams, setFilterParams] = useState<TaskFilterInput>({
    ...defaultTaskFilterParams,
  });

  // Add API query with debouncing
  const { isLoading } = api.tasks.getAll.useQuery(filterParams);

  const closeModalMoreFilter = () => setisOpenMoreFilter(false);
  const openModalMoreFilter = () => setisOpenMoreFilter(true);
  const renderXClear = () => {
    return (
      <span className="bg-primary-500 ml-3 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-white">
        <XMarkIcon className="h-3 w-3" />
      </span>
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      ...defaultTaskFilterParams,
    };
    setFilterParams(clearedFilters);
    setDateRange([new Date(), new Date()]);
    setTaskTypes([]);
    setPriorities([]);
    setAssignees([]);
    _onFilterChange(clearedFilters);
  };

  // Modify existing handlers to reduce redundancy
  const handleFilterChange = (key: keyof TaskFilterInput, value: unknown) => {
    const newFilters = {
      ...filterParams,
      [key]: value,
    };
    setFilterParams(newFilters);
    _onFilterChange(newFilters);
  };

  const _renderMoreFilterItem = (
    data: {
      name: string;
      description?: string;
      defaultChecked?: boolean;
    }[],
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex max-h-60 flex-col space-y-5 overflow-y-auto">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              checked={!!item.defaultChecked}
            />
          ))}
        </div>
        <div className="flex max-h-60 flex-col space-y-5 overflow-y-auto">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              checked={!!item.defaultChecked}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTabsStatusOptions = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <PopoverButton
              className={`flex items-center justify-center rounded-full border px-4 py-2 text-sm transition-all hover:shadow-lg focus:outline-none ${
                open
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700"
              }`}
            >
              <span className="inline-flex items-center">
                <i className="las la-info-circle mr-2 text-lg"></i>
                {t("tasks.status.title")}
              </span>
              <i
                className={`las la-angle-down ml-2 transition-transform ${open ? "rotate-180" : ""}`}
              ></i>
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="relative flex max-h-60 flex-col space-y-5 overflow-y-auto px-5 py-6">
                    {statusOptions.map((item) => (
                      <div key={item.name}>
                        <Checkbox
                          name={item.name}
                          label={t(`tasks.status.${item.name}`)}
                          subLabel={t(`tasks.status.${item.name}_DESC`)}
                          onChange={() =>
                            handleFilterChange("status", item.name)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                    <ButtonThird onClick={close} sizeClass="px-4 py-2 sm:px-5">
                      {t("common.clear")}
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={close}
                      type="button"
                      className="px-4 py-2 sm:px-5"
                      loading={false}
                    >
                      {t("common.apply")}
                    </ButtonPrimary>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  return (
    <Card className="w-full rounded-2xl border border-blue-100 bg-white/70 p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-4">
        <FilterTranslationProvider>
          <RenderTabsType />
        </FilterTranslationProvider>
        <FilterTranslationProvider>
          <RenderTabsStatus
            statuses={{
              taskTypes,
              priorities,
              assignees,
            }}
            onStatusChange={(type, statuses) => {
              if (type === "type") setTaskTypes(statuses);
              if (type === "priority") setPriorities(statuses);
              if (type === "assignee") setAssignees(statuses);
            }}
          />
        </FilterTranslationProvider>
        <FilterTranslationProvider>
          <RenderTabsCategory />
        </FilterTranslationProvider>
        <FilterTranslationProvider>
          <RenderTabsLabel />
        </FilterTranslationProvider>
        <FilterTranslationProvider>
          <RenderTabsDateRange
            onSelect={(range) => {
              if (range.startDate) {
                handleFilterChange("createdAtFrom", range.startDate);
              }
              if (range.endDate) {
                handleFilterChange("createdAtTo", range.endDate);
              }
            }}
          />
        </FilterTranslationProvider>
        <Button
          variant="outline"
          className="ml-auto rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
          onClick={clearAllFilters}
        >
          <XMarkIcon className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>
    </Card>
  );
};

export default TabFilters;

"use client";

import { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import DatePicker from "react-datepicker";

import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";

import "react-datepicker/dist/react-datepicker.css";

import DatePickerCustomDay from "~/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "~/components/DatePickerCustomHeaderTwoMonth";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface RenderTabsDateRangeProps {
  onSelect: (range: DateRange) => void;
}

export default function RenderTabsDateRange({
  onSelect,
}: RenderTabsDateRangeProps) {
  const t = useTranslations("Tasks");
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange({ startDate: start, endDate: end });
    onSelect({ startDate: start, endDate: end });
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              open
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            <span className="ml-2">
              {dateRange.startDate && dateRange.endDate
                ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                : t("filters.dateRange")}
            </span>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-0 z-10 mt-2 w-screen max-w-sm transform px-4 sm:px-0">
              <Card className="overflow-hidden rounded-xl border border-blue-100 bg-white/90 shadow-xl">
                <div className="relative bg-white p-7 dark:bg-neutral-800">
                  <DatePicker
                    selected={dateRange.startDate}
                    onChange={handleDateChange}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    selectsRange
                    inline
                    monthsShown={2}
                    showPopperArrow={false}
                    renderCustomHeader={(props) => (
                      <DatePickerCustomHeaderTwoMonth {...props} />
                    )}
                    renderDayContents={(day, date) => {
                      if (!date) return <div>{day}</div>;
                      return (
                        <DatePickerCustomDay dayOfMonth={day} date={date} />
                      );
                    }}
                  />
                </div>
              </Card>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

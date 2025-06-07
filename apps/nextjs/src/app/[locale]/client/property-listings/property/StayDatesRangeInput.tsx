"use client";

import type { FC } from "react";
import React, { Fragment, useState } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import DatePicker from "react-datepicker";

import DatePickerCustomDay from "~/app/[locale]/_components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "~/app/[locale]/_components/DatePickerCustomHeaderTwoMonth";
import ClearDataButton from "~/app/[locale]/(client-components)/(HeroSearchForm)/ClearDataButton";

export interface StayDatesRangeInputProps {
  className?: string;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "flex-1",
}) => {
  const t = useTranslations("realEstate");
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2023/02/06"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2023/02/23"));

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300 dark:text-neutral-400">
          <CalendarIcon className="h-5 w-5 lg:h-7 lg:w-7" />
        </div>
        <div className="flex-grow text-start">
          <span className="block font-semibold xl:text-lg">
            {startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            }) ?? t("search.guests.addGuests")}
            {endDate
              ? " - " +
                endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </span>
          <span className="mt-1 block text-sm font-light leading-none text-neutral-400">
            {t("detail.sections.checkInTime")} -{" "}
            {t("detail.sections.checkOutTime")}
          </span>
        </div>
      </>
    );
  };

  return (
    <Popover className={`StayDatesRangeInput relative z-10 flex ${className}`}>
      {({ open }) => (
        <>
          <PopoverButton
            className={`relative flex flex-1 items-center gap-x-3 p-3 focus:outline-none ${
              open ? "shadow-lg" : ""
            }`}
          >
            {renderInput()}
            {startDate && open && (
              <ClearDataButton onClick={() => onChangeDate([null, null])} />
            )}
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
            <PopoverPanel className="absolute end-0 start-auto top-full z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-3xl xl:-end-10">
              <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800">
                <DatePicker
                  selected={startDate}
                  onChange={onChangeDate}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  monthsShown={2}
                  showPopperArrow={false}
                  inline
                  renderCustomHeader={(p) => (
                    <DatePickerCustomHeaderTwoMonth {...p} />
                  )}
                  renderDayContents={(day, date) => (
                    <DatePickerCustomDay dayOfMonth={day} date={date} />
                  )}
                />
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default StayDatesRangeInput;

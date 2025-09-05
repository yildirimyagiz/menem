"use client";

import type { FC } from "react";
import React, { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import type { GuestsObject, PathName } from "~/types/type";
import NcInputNumber from "~/components/NcInputNumber";
import ClearDataButton from "./ClearDataButton";
import ButtonSubmit from "./Hero-search-component/ButtonSubmit";

export interface GuestsInputProps {
  fieldClassName?: string;
  className?: string;
  buttonSubmitHref?: PathName;
  hasButtonSubmit?: boolean;
}

const GuestsInput: FC<GuestsInputProps> = ({
  fieldClassName = "[ nc-hero-field-padding ]",
  className = "[ nc-flex-1 ]",
  buttonSubmitHref = "/listing-hotel-map",
  hasButtonSubmit = true,
}) => {
  const [guestAdults, setGuestAdults] = useState(2);
  const [guestChildren, setGuestChildren] = useState(1);
  const [guestInfants, setGuestInfants] = useState(1);

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    if (type === "guestAdults") setGuestAdults(value);
    if (type === "guestChildren") setGuestChildren(value);
    if (type === "guestInfants") setGuestInfants(value);
  };

  const totalGuests = guestAdults + guestChildren + guestInfants;

  return (
    <Popover className={`relative flex ${className}`}>
      {({ open }) => (
        <>
          <div
            className={`z-10 flex flex-1 cursor-pointer items-center ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            <Popover.Button
              className={`relative z-10 flex items-center ${fieldClassName} space-x-3`}
            >
              <UserPlusIcon className="h-5 w-5 text-neutral-300 dark:text-neutral-400 lg:h-7 lg:w-7" />
              <div className="flex-grow">
                <span className="block font-semibold xl:text-lg">
                  {totalGuests || ""} Guests
                </span>
                <span className="mt-1 block text-sm font-light leading-none text-neutral-400">
                  {totalGuests ? "Guests" : "Add guests"}
                </span>
              </div>
              {totalGuests > 0 && open && (
                <ClearDataButton
                  onClick={() => {
                    setGuestAdults(0);
                    setGuestChildren(0);
                    setGuestInfants(0);
                  }}
                />
              )}
            </Popover.Button>

            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <ButtonSubmit href={buttonSubmitHref} />
              </div>
            )}
          </div>

          {open && (
            <div className="absolute inset-x-0 top-1/2 z-0 h-8 -translate-y-1/2 bg-white dark:bg-neutral-800" />
          )}

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-full max-w-sm rounded-3xl bg-white px-4 py-5 shadow-xl dark:bg-neutral-800 sm:min-w-[340px] sm:px-8 sm:py-6">
              <NcInputNumber
                className="w-full"
                defaultValue={guestAdults}
                onChange={(value) => handleChangeData(value, "guestAdults")}
                max={10}
                min={1}
                label="Adults"
                desc="Ages 13 or above"
              />
              <NcInputNumber
                className="mt-6 w-full"
                defaultValue={guestChildren}
                onChange={(value) => handleChangeData(value, "guestChildren")}
                max={4}
                label="Children"
                desc="Ages 2–12"
              />
              <NcInputNumber
                className="mt-6 w-full"
                defaultValue={guestInfants}
                onChange={(value) => handleChangeData(value, "guestInfants")}
                max={4}
                label="Infants"
                desc="Ages 0–2"
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GuestsInput;

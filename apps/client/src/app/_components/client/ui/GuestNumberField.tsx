"use client";

import type { FC } from "react";
import { useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import type { GuestsObject } from "~/types/type";
import NcInputNumber from "~/components/NcInputNumber";
import T from "~/utils/getT";
import { ClearDataButton } from "./ClearDataButton";

const styles = {
  button: {
    base: "relative z-10 shrink-0 w-full cursor-pointer flex items-center gap-x-3 focus:outline-hidden text-start",
    focused:
      "rounded-full bg-transparent focus-visible:outline-hidden dark:bg-white/5 custom-shadow-1 ",
    default: "px-7 py-4 xl:px-8 xl:py-6",
    small: "py-3 px-7 xl:px-8",
  },
  mainText: {
    default: "text-base xl:text-lg",
    small: "text-base",
  },
  panel: {
    base: "absolute end-0 top-full z-50 mt-3 flex w-sm flex-col gap-y-6 rounded-3xl bg-white px-8 py-7 shadow-xl transition duration-150 data-closed:translate-y-1 data-closed:opacity-0 dark:bg-neutral-800",
    default: "",
    small: "",
  },
};

interface Props {
  fieldStyle: "default" | "small";
  className?: string;
  clearDataButtonClassName?: string;
}

export const GuestNumberField: FC<Props> = ({
  fieldStyle = "default",
  className = "flex-1",
  clearDataButtonClassName,
}) => {
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(2);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(1);
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(1);

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    const newValue = {
      guestAdults: guestAdultsInputValue,
      guestChildren: guestChildrenInputValue,
      guestInfants: guestInfantsInputValue,
    };
    if (type === "guestAdults") {
      setGuestAdultsInputValue(value);
      newValue.guestAdults = value;
    }
    if (type === "guestChildren") {
      setGuestChildrenInputValue(value);
      newValue.guestChildren = value;
    }
    if (type === "guestInfants") {
      setGuestInfantsInputValue(value);
      newValue.guestInfants = value;
    }
  };

  const totalGuests =
    guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue;
  return (
    <Popover className={`group relative z-10 flex ${className}`}>
      {({ open: showPopover }) => (
        <>
          <PopoverButton
            className={clsx(
              styles.button.base,
              styles.button[fieldStyle],
              showPopover && styles.button.focused,
            )}
          >
            {fieldStyle === "default" && (
              <UserPlusIcon className="size-5 text-neutral-300 dark:text-neutral-400 lg:size-7" />
            )}

            <div className="grow">
              <span
                className={clsx(
                  "block font-semibold",
                  styles.mainText[fieldStyle],
                )}
              >
                {totalGuests || ""} Guests
              </span>
              <span className="mt-1 block text-sm font-light leading-none text-neutral-400">
                {totalGuests ? "Guests" : "Add guests"}
              </span>
            </div>
          </PopoverButton>

          <ClearDataButton
            className={clsx(
              !totalGuests && "sr-only",
              clearDataButtonClassName,
            )}
            onClick={() => {
              setGuestAdultsInputValue(0);
              setGuestChildrenInputValue(0);
              setGuestInfantsInputValue(0);
            }}
          />

          <PopoverPanel
            unmount={false}
            transition
            className={clsx(styles.panel.base, styles.panel[fieldStyle])}
          >
            <NcInputNumber
              className="w-full"
              defaultValue={guestAdultsInputValue}
              onChange={(value) => handleChangeData(value, "guestAdults")}
              max={10}
              min={1}
              label="Adults"
              desc="Ages 13 or above"
            />
            <NcInputNumber
              className="w-full"
              defaultValue={guestChildrenInputValue}
              onChange={(value) => handleChangeData(value, "guestChildren")}
              max={4}
              label="Children"
              desc="Ages 2–12"
            />
            <NcInputNumber
              className="w-full"
              defaultValue={guestInfantsInputValue}
              onChange={(value) => handleChangeData(value, "guestInfants")}
              max={4}
              label="Infants"
              desc="Ages 0–2"
            />
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};

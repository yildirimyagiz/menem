"use client";

import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";

import NcInputNumber from "~/components/NcInputNumber";
import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";

const RenderTabsRoomAndBeds = () => {
  const t = useTranslations();

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`dark:hover:border-neutral-6000 flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-400 focus:outline-none dark:border-neutral-700 ${
              open ? "!border-primary-500" : ""
            }`}
          >
            <span>{t("rooms")}</span>
            <i className="las la-angle-down ml-2"></i>
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
            <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                <div className="relative flex flex-col space-y-5 px-5 py-6">
                  <NcInputNumber label={t("bedrooms")} max={10} />
                  <NcInputNumber label={t("bathrooms")} max={10} />
                  <NcInputNumber label={t("size")} max={10} />
                </div>
                <div className="flex items-center justify-between bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                  <ButtonThird onClick={close} sizeClass="px-4 py-2 sm:px-5">
                    {t("clear")}
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={close}
                    type={"button"}
                    className="px-4 py-2 sm:px-5"
                    loading={false}
                  >
                    {t("apply")}
                  </ButtonPrimary>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default RenderTabsRoomAndBeds;

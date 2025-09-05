"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import Checkbox from "~/shared/Checkbox";

interface TabMobileFilterProps {
  isOpenMoreFilter: boolean;
  openModalMoreFilter: () => void;
  closeModalMoreFilter: () => void;
  moreFilterOptions: {
    label: string;
    value: string;
  }[];
  translationNamespace?: string;
  onApply?: () => void;
  onClear?: () => void;
}

const TabMobileFilter: React.FC<TabMobileFilterProps> = ({
  isOpenMoreFilter,
  openModalMoreFilter,
  closeModalMoreFilter,
  moreFilterOptions,
  translationNamespace = "tasks",
  onApply,
  onClear,
}) => {
  const t = useTranslations();

  const handleApply = () => {
    onApply?.();
    closeModalMoreFilter();
  };

  const handleClear = () => {
    onClear?.();
    closeModalMoreFilter();
  };

  return (
    <>
      <div
        onClick={openModalMoreFilter}
        className="flex cursor-pointer items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm transition-all hover:border-neutral-400 dark:border-neutral-700"
      >
        <span className="inline-flex items-center">
          <i className="las la-filter mr-2 text-lg"></i>
          {t("common.filters")}
        </span>
      </div>

      <Transition appear show={isOpenMoreFilter} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeModalMoreFilter}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-neutral-900">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {t("common.filters")}
                  </Dialog.Title>
                  <div className="mt-4">
                    <div className="flex flex-col space-y-4">
                      {moreFilterOptions.map((item) => (
                        <div key={item.value}>
                          <Checkbox
                            name={item.value}
                            label={t(
                              `${translationNamespace}.filters.${item.value}`,
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <ButtonThird
                      onClick={handleClear}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      {t("common.clear")}
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={handleApply}
                      type="button"
                      className="px-4 py-2 sm:px-5"
                      loading={false}
                    >
                      {t("common.apply")}
                    </ButtonPrimary>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TabMobileFilter;

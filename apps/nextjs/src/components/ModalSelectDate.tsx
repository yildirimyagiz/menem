"use client";

import type { FC } from "react";
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";

import ButtonPrimary from "~/shared/ButtonPrimary";
import DatePickerCustomDay from "./DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "./DatePickerCustomHeaderTwoMonth";

interface ModalSelectDateProps {
  renderChildren?: (p: { openModal: () => void }) => React.ReactNode;
}

const ModalSelectDate: FC<ModalSelectDateProps> = ({ renderChildren }) => {
  const [showModal, setShowModal] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2023/02/06"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2023/02/23"));

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  //
  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const renderButtonOpenModal = () => {
    return renderChildren ? (
      renderChildren({ openModal })
    ) : (
      <button onClick={openModal}>Select Date</button>
    );
  };

  return (
    <>
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-50"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative flex h-full flex-1 flex-col justify-between overflow-hidden">
                  <>
                    <div className="absolute left-4 top-4">
                      <button
                        className="focus:outline-none focus:ring-0"
                        onClick={closeModal}
                      >
                        <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col overflow-auto p-1 pt-12">
                      <div className="flex flex-1 flex-col bg-white dark:bg-neutral-800">
                        <div className="flex flex-1 animate-[myblur_0.4s_ease-in-out] flex-col overflow-auto transition-opacity">
                          <div className="p-5">
                            <span className="block text-xl font-semibold sm:text-2xl">
                              {` When's your trip?`}
                            </span>
                          </div>
                          <div className="relative z-10 flex flex-1">
                            <div className="overflow-hidden rounded-3xl">
                              <DatePicker
                                selected={startDate ?? undefined}
                                onChange={onChangeDate}
                                startDate={startDate ?? undefined}
                                endDate={endDate ?? undefined}
                                selectsRange
                                monthsShown={2}
                                showPopperArrow={false}
                                inline
                                renderCustomHeader={(p) => (
                                  <DatePickerCustomHeaderTwoMonth {...p} />
                                )}
                                renderDayContents={(day, date) => (
                                  <DatePickerCustomDay
                                    dayOfMonth={day}
                                    date={date}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
                      <button
                        type="button"
                        className="flex-shrink-0 font-semibold underline"
                        onClick={() => {
                          onChangeDate([null, null]);
                        }}
                      >
                        Clear dates
                      </button>
                      <ButtonPrimary
                        onClick={closeModal}
                        sizeClass="px-4 py-2 sm:px-5"
                        type={"button"}
                        className={""}
                        loading={false}
                      >
                        Save
                      </ButtonPrimary>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalSelectDate;

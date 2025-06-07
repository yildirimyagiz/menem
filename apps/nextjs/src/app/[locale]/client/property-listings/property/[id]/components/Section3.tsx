"use client";

import type { Key } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useTranslations } from "next-intl";

import type { Property } from "@acme/db";

import ButtonClose from "~/shared/ButtonClose";
import ButtonSecondary from "~/shared/ButtonSecondary";

interface AmenitiesProps {
  propertyData: Property;
  isOpenModalAmenities: boolean;
  openModalAmenities: () => void;
  closeModalAmenities: () => void;
}

const Amenities: React.FC<AmenitiesProps> = ({
  propertyData,
  isOpenModalAmenities,
  openModalAmenities,
  closeModalAmenities,
}) => {
  const t = useTranslations();

  return (
    <div className="listingSection__wrap">
      <div>
        <h2 className="text-2xl font-semibold">{t("amenities")}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {t("description")}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* 6 */}
      <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 dark:text-neutral-300 xl:grid-cols-3">
        {propertyData.amenities?.map((amenity: Key | null | undefined) => (
          <div key={amenity} className="flex items-center gap-x-3">
            <span>{t(`amenities.${amenity}`)}</span>
          </div>
        ))}
      </div>

      {/* ----- */}
      <div className="w-14 border-b border-neutral-200"></div>
      <div>
        <ButtonSecondary onClick={openModalAmenities}>
          {t("showMore")}
        </ButtonSecondary>
      </div>

      {/* Modal */}
      <Dialog
        open={isOpenModalAmenities}
        onClose={closeModalAmenities}
        className="relative z-50 hidden lg:block"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 duration-200 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex max-h-screen w-screen items-center justify-center p-4">
          <DialogPanel
            className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl duration-200 ease-out data-[closed]:translate-y-16 data-[closed]:opacity-0 dark:border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            transition
          >
            <div className="relative flex-shrink-0 border-b border-neutral-200 px-6 py-4 text-center dark:border-neutral-800">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {t("amenities")}
              </DialogTitle>
              <span className="absolute start-3 top-3">
                <ButtonClose onClick={closeModalAmenities} />
              </span>
            </div>

            <div className="hiddenScrollbar flex-1 divide-y divide-neutral-200 overflow-y-auto px-8 text-neutral-700 dark:divide-neutral-700 dark:text-neutral-300">
              {propertyData.amenities?.map(
                (amenity: Key | null | undefined) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-x-5 py-2.5 sm:py-4 lg:gap-x-8 lg:py-5"
                  >
                    <span>{t(`amenities.${amenity}`)}</span>
                  </div>
                ),
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Amenities;

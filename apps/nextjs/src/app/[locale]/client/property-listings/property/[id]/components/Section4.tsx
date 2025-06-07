"use client";

import type {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useTranslations } from "next-intl";

import type { Property } from "~/utils/interfaces";

interface Section4Props {
  propertyData: Property;
}

const Section4: React.FC<Section4Props> = ({ propertyData }) => {
  const t = useTranslations("properties");

  return (
    <div className="listingSection__wrap">
      {/* HEADING */}
      <div>
        <h2 className="text-2xl font-semibold">
          {t("detail.sections.roomRates")}
        </h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {t("detail.sections.priceNote")}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* CONTENT */}
      <div className="flow-root">
        <div className="-mb-4 text-sm text-neutral-600 dark:text-neutral-300 sm:text-base">
          {propertyData.bedrooms?.map(
            (room: {
              id: Key | null | undefined;
              name:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<AwaitedReactNode>
                | null
                | undefined;
              basePrice:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<AwaitedReactNode>
                | null
                | undefined;
            }) => (
              <div
                key={room.id}
                className="flex items-center justify-between gap-x-4 rounded-lg p-4"
              >
                <span>{room.name}</span>
                <span>
                  {room.basePrice} {propertyData.PricingRules?.[0]?.basePrice}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Section4;

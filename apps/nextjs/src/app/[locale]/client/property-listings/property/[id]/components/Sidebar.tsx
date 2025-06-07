"use client";

import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { Property } from "~/utils/interfaces";
import Badge from "~/shared/Badge";
import ButtonPrimary from "~/shared/ButtonPrimary";
import GuestsInput from "../../GuestsInput";
import StayDatesRangeInput from "../../StayDatesRangeInput";

interface SidebarProps {
  propertyData: Property;
}

const Sidebar: React.FC<SidebarProps> = ({ propertyData }) => {
  const t = useTranslations("properties");

  const getDisplayPrice = () => {
    const { marketValue, listingType, currencyId } = propertyData;
    const displayPrice = marketValue ?? 0;
    let priceLabel = "";

    switch (listingType) {
      case "SALE":
        priceLabel = ""; // Just show the price for sale
        break;
      case "RENT":
        priceLabel = `/${t("detail.sidebar.monthly")}`;
        break;
      case "BOOKING":
        priceLabel = `/${t("detail.sidebar.night")}`;
        break;
      default:
        priceLabel = "";
    }

    return {
      displayPrice: displayPrice.toLocaleString(),
      priceLabel,
      currency: currencyId ?? "USD", // Default to USD if not specified
    };
  };

  const renderPriceSection = () => {
    const { displayPrice, priceLabel, currency } = getDisplayPrice();

    return (
      <div className="flex flex-col">
        <span className="text-3xl font-semibold">
          {displayPrice}
          <span className="ms-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
            {currency} {priceLabel}
          </span>
        </span>
      </div>
    );
  };

  const renderContactButton = () => {
    const { contactMethod, id } = propertyData;

    const buttonProps = {
      href: {
        pathname: `/contact/${id}`,
        path: `/contact/${id}`,
      },
      type: "button" as const,
      className: "w-full",
      loading: false,
    };

    switch (contactMethod) {
      case "MESSAGE":
        return (
          <ButtonPrimary {...buttonProps}>{t("sendMessage")}</ButtonPrimary>
        );
      case "EMAIL":
        return <ButtonPrimary {...buttonProps}>{t("sendEmail")}</ButtonPrimary>;
      case "PHONE":
        return <ButtonPrimary {...buttonProps}>{t("callNow")}</ButtonPrimary>;
      default:
        return <ButtonPrimary {...buttonProps}>{t("contact")}</ButtonPrimary>;
    }
  };

  const renderPropertyDetails = () => {
    const {
      listingType,
      size,
      yearBuilt,
      bedrooms,
      bathrooms,
      features = [],
      amenities = [],
    } = propertyData;

    return (
      <div className="space-y-4">
        <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
          <span>{t("listingType")}</span>
          <span>{listingType}</span>
        </div>

        {size && (
          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>{t("size")}</span>
            <span>{size} m²</span>
          </div>
        )}

        {yearBuilt && (
          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>{t("buildYear")}</span>
            <span>{yearBuilt}</span>
          </div>
        )}

        {(bedrooms ?? bathrooms) && (
          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>{t("rooms")}</span>
            <span>
              {bedrooms && `${bedrooms} ${t("bedrooms")}`}
              {bedrooms && bathrooms ? " • " : ""}
              {bathrooms && `${bathrooms} ${t("bathrooms")}`}
            </span>
          </div>
        )}

        {features.length > 0 && (
          <div className="pt-2">
            <h4 className="mb-2 text-sm font-medium">{t("features")}</h4>
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 5).map((feature, index) => (
                <Badge key={index} name={String(feature)} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderForm = () => {
    const { listingType } = propertyData;

    switch (listingType) {
      case "SALE":
        return (
          <div className="flex flex-col space-y-4">
            {renderPriceSection()}
            {renderPropertyDetails()}
            {renderContactButton()}
          </div>
        );

      case "RENT":
        return (
          <div className="flex flex-col space-y-4">
            {renderPriceSection()}
            <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
              <span>{t("securityDeposit")}</span>
              <span>
                {propertyData.insuranceValue?.toLocaleString() ?? "N/A"}{" "}
                {propertyData.currencyId ?? "USD"}
              </span>
            </div>
            {renderPropertyDetails()}
            {renderContactButton()}
          </div>
        );

      case "BOOKING":
        return (
          <div className="flex flex-col space-y-4">
            {renderPriceSection()}
            <StayDatesRangeInput />
            <GuestsInput />
            {renderPropertyDetails()}
            {renderContactButton()}
          </div>
        );

      default:
        return (
          <div className="flex flex-col space-y-4">
            {renderPriceSection()}
            {renderPropertyDetails()}
            {renderContactButton()}
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      {renderForm()}
    </div>
  );
};

export default Sidebar;

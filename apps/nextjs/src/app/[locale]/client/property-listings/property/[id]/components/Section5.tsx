"use client";

import { useTranslations } from "next-intl";

import type { Property } from "~/utils/interfaces";
import { Timer02Icon } from "~/components/Icons";
import StartRating from "~/components/starRating";
import Avatar from "~/shared/Avatar";
import ButtonSecondary from "~/shared/ButtonSecondary";

interface HostInformationProps {
  propertyData: Property;
}

const HostInformation: React.FC<HostInformationProps> = ({ propertyData }) => {
  const t = useTranslations();

  return (
    <div className="listingSection__wrap">
      {/* HEADING */}
      <h2 className="text-2xl font-semibold">{t("hostInformation")}</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      {/* host */}
      <div className="flex items-center gap-x-4">
        <Avatar
          hasChecked
          hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
          sizeClass="h-14 w-14 text-lg"
          radius="rounded-full"
        />
        <div>
          <a className="block text-xl font-medium" href="##">
            {propertyData?.Owner?.username ?? t("anonymous")}
          </a>
          <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <StartRating rating={null} />
            <span className="mx-2">·</span>
            <span>
              {t("responseTime")}: {propertyData?.Owner?.responseTime ?? "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* info */}
      <div className="block space-y-2.5 text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-x-3">
          <Timer02Icon className="h-6 w-6" />
          <span>
            {t("responseTime")}:{" "}
            {propertyData?.Owner?.responseTime
              ? new Date(propertyData?.Owner?.responseTime).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>

      {/* == */}
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div>
        <ButtonSecondary
          href={{
            pathname: `/author/${propertyData?.Owner?.id}`,
            path: `/author/${propertyData?.Owner?.id}`,
          }}
          className="mr-2"
          type="button"
          loading={false}
        >
          {t("contactHost")}
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default HostInformation;

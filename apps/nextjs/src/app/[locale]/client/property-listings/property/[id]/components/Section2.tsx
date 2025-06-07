"use client";

import { useTranslations } from "next-intl";

import type { Property } from "@acme/db";

interface DetailsInformationProps {
  propertyData: Property;
}

const DetailsInformation: React.FC<DetailsInformationProps> = ({
  propertyData,
}) => {
  const t = useTranslations("properties");

  return (
    <div className="listingSection__wrap">
      <h2 className="text-2xl font-semibold">
        {t("detail.sections.stayInformation")}
      </h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="text-neutral-600 dark:text-neutral-300">
        {propertyData.description}
      </div>
    </div>
  );
};

export default DetailsInformation;

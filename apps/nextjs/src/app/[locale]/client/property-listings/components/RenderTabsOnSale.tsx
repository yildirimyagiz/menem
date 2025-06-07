"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface RenderTabsOnSaleProps {
  isOnSale: boolean;
  setIsOnSale: (value: boolean) => void;
  renderXClear: () => JSX.Element;
}

const RenderTabsOnSale: React.FC<RenderTabsOnSaleProps> = ({
  isOnSale,
  setIsOnSale,
  renderXClear,
}) => {
  const t = useTranslations();

  return (
    <div
      className={`flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm transition-all focus:outline-none ${
        isOnSale
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-neutral-300 dark:border-neutral-700"
      }`}
      onClick={() => setIsOnSale(!isOnSale)}
    >
      <span>{t("featured")}</span>
      {isOnSale && renderXClear()}
    </div>
  );
};

export default RenderTabsOnSale;

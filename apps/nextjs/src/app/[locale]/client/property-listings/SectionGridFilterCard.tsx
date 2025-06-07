"use client";

import type { FC } from "react";
import React from "react";
import { useTranslations } from "next-intl";

import type { Property } from "@acme/validators";

import Heading2 from "~/shared/Heading2";
import Pagination from "~/shared/Pagination";
import PropertyCard from "./components/PropertyCard";

export interface SectionGridFilterCardProps {
  className?: string;
  data?: Property[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  title?: string;
  subtitle?: string;
  noPropertiesText?: string;
  hideHeader?: boolean;
}

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data = [],
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  title,
  subtitle = "",
  noPropertiesText,
  hideHeader = false,
}) => {
  const t = useTranslations();

  const defaultTitle = t("properties");
  const defaultNoPropertiesText = t("noProperties");

  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
      {/* Only show header if hideHeader is false */}
      {!hideHeader && (
        <>
          <Heading2
            heading={title ?? defaultTitle}
            subHeading={
              <span className="mt-3 block text-neutral-500 dark:text-neutral-400">
                {subtitle ||
                  `${totalCount} ${
                    totalCount === 1 ? t("property") : t("properties")
                  }`}
              </span>
            }
          />
        </>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {data.length === 0 ? (
          <div className="col-span-full text-center text-neutral-500 dark:text-neutral-400">
            {noPropertiesText ?? defaultNoPropertiesText}
          </div>
        ) : (
          data.map((property) => (
            <PropertyCard
              key={property.id}
              data={property}
              className="h-full"
            />
          ))
        )}
      </div>

      <div className="mt-16 flex items-center justify-center">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={
            onPageChange ?? ((page) => console.log(`Page changed to ${page}`))
          }
        />
      </div>
    </div>
  );
};

export default SectionGridFilterCard;

"use client";

import type { ReactNode } from "react";
import React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import type { SearchTab } from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import BackgroundSection from "~/app/[locale]/_components/BackgroundSection";
import SectionGridAuthorBox from "~/app/[locale]/_components/SectionGridAuthorBox";
import SectionSliderNewCategories from "~/app/[locale]/_components/SectionSliderNewCategories";
import SectionSubscribe2 from "~/app/[locale]/_components/SectionSubscribe2";
import HeroSearchForm from "~/app/[locale]/(client-components)/(HeroSearchForm)/HeroSearchForm";
import SectionHero2ArchivePage from "../(server-components)/SectionHero2ArchivePage";

const Layout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const isDetailPage = pathname?.includes("/property/") ?? false;
  const isMapView = pathname?.includes("/listing-real-estate-map") ?? false;

  // We need to cast this as a SearchTab since the translation is a string
  const propertiesTab = "Properties" as SearchTab;

  return (
    <div
      className={`nc-PropertyRealEstateMapPage ${isMapView ? "is-map-view" : ""}`}
    >
      {!isDetailPage && !isMapView && (
        <>
          <HeroSearchForm currentTab={propertiesTab} />
          <div className="container pb-24 lg:pb-28">
            <SectionHero2ArchivePage />
          </div>
        </>
      )}

      {/* Map view takes full width */}
      <div className={isMapView ? "h-[calc(100vh-96px)] w-full" : ""}>
        {children}
      </div>

      {!isDetailPage && !isMapView && (
        <div className="container overflow-hidden">
          {/* SECTION 1 */}
          <div className="relative py-16">
            <BackgroundSection />
            <SectionSliderNewCategories
              heading={t("exploreRealEstatePropertys")}
              subHeading={t("exploreHousesBasedOnTypes")}
              categoryCardType="card5"
              itemPerRow={5}
              sliderStyle="style2"
            />
          </div>

          {/* SECTION */}
          <SectionSubscribe2 />

          {/* SECTION */}
          <div className="relative mb-24 py-16 lg:mb-28">
            <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20" />
            <SectionGridAuthorBox />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;

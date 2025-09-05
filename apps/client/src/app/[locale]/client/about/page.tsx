"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import BackgroundSection from "~/components/BackgroundSection";
import BgGlassmorphism from "~/components/BgGlassmorphism";
import SectionClientSay from "~/components/SectionClientSay";
import SectionSubscribe2 from "~/components/SectionSubscribe2";
import rightImg from "~/images/about-hero-right.png";
import SectionFounder from "./SectionFounder";
import SectionHero from "./SectionHero";
import SectionStatistic from "./SectionIstatistic";

export type PageAboutProps = object;

const PageAbout: FC<PageAboutProps> = () => {
  const t = useTranslations("About");
  
  return (
    <div className={`nc-PageAbout relative overflow-hidden`}>
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container space-y-16 py-16 lg:space-y-28 lg:py-28">
        <SectionHero
          rightImg={rightImg}
          heading={t("heading", { defaultValue: "👋 About Us." })}
          btnText={t("heroButton", { defaultValue: "Learn More" })}
          subHeading={t("subHeading", { defaultValue: "We're impartial and independent, and every day we create distinctive, world-class programmes and content which inform, educate and entertain millions of people in the around the world." })}
        />

        <SectionFounder />
        <div className="relative py-16">
          <BackgroundSection />
          <SectionClientSay />
        </div>

        <SectionStatistic />

        <SectionSubscribe2 />
      </div>
    </div>
  );
};

export default PageAbout;

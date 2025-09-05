"use client";

import { useTranslations } from "next-intl";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";

import HIW1img from "../../images/HIW1.png";
import HIW2img from "../../images/HIW2.png";
import HIW3img from "../../images/HIW3.png";
import VectorImg from "../../images/VectorHIW.svg";
import Heading from "../../shared/Heading";

export interface SectionHowItWorkProps {
  className?: string;
  data?: {
    id: number;
    title: string;
    desc: string;
    img: StaticImageData;
    imgDark?: StaticImageData;
  }[];
  title?: string;
}

const SectionHowItWork: FC<SectionHowItWorkProps> = ({
  className = "",
  data,
  title,
}) => {
  const t = useTranslations("Index");

  const DEMO_DATA: SectionHowItWorkProps["data"] = [
    {
      id: 1,
      img: HIW1img,
      title: t("howItWork.steps.book.title", { defaultValue: "Book & relax" }),
      desc: t("howItWork.steps.book.desc", {
        defaultValue:
          "Let each trip be an inspirational journey, each room a peaceful space",
      }),
    },
    {
      id: 2,
      img: HIW2img,
      title: t("howItWork.steps.checklist.title", {
        defaultValue: "Smart checklist",
      }),
      desc: t("howItWork.steps.checklist.desc", {
        defaultValue:
          "Let each trip be an inspirational journey, each room a peaceful space",
      }),
    },
    {
      id: 3,
      img: HIW3img,
      title: t("howItWork.steps.save.title", { defaultValue: "Save more" }),
      desc: t("howItWork.steps.save.desc", {
        defaultValue:
          "Let each trip be an inspirational journey, each room a peaceful space",
      }),
    },
  ];

  const displayData = data || DEMO_DATA;
  const displayTitle =
    title || t("howItWork.title", { defaultValue: "How it works" });
  return (
    <section
      className={`relative py-20 ${className} overflow-hidden`}
      data-nc-id="SectionHowItWork"
    >
      {/* AceternityUI-inspired animated gradient background */}
      <div className="animate-gradient-x pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/60" />
      <Heading
        isCenter
        desc={t("howItWork.subtitle", { defaultValue: "Keep calm & travel on" })}
      >
        {displayTitle}
      </Heading>
      <div className="relative mt-20 grid gap-16 md:grid-cols-3">
        <Image
          className="pointer-events-none absolute inset-x-0 top-10 hidden select-none md:block"
          src={VectorImg}
          alt="vector"
        />
        {displayData.map((item, idx) => (
          <div
            key={item.id}
            className="group relative mx-auto flex max-w-xs flex-col items-center overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-lg transition-shadow hover:shadow-2xl"
          >
            {/* AceternityUI-inspired animated gradient overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Image
              alt=""
              className="relative z-10 mx-auto mb-8 max-w-[180px] transition-transform duration-300 group-hover:scale-105"
              src={item.img}
            />
            <div className="relative z-10 mt-auto px-4 pb-8 text-center">
              <h3 className="mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-xl font-semibold text-transparent">
                {item.title}
              </h3>
              <span className="mt-2 block text-base text-neutral-500 dark:text-neutral-400">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionHowItWork;

import type { StaticImageData } from "next/image";
import type { FC, ReactNode } from "react";
import React from "react";
import Image from "next/image";

import type { Route } from "~/routers/types"; // Import Route type
import ButtonPrimary from "~/shared/ButtonPrimary";

export interface SectionHeroProps {
  className?: string;
  rightImg: StaticImageData | string; // Allow both StaticImageData and string
  heading: ReactNode;
  subHeading: string;
  btnText: string;
}

const SectionHero: FC<SectionHeroProps> = ({
  className = "",
  rightImg,
  heading,
  subHeading,
  btnText,
}) => {
  // Create a Route object for the href
  const buttonHref: Route<string> = {
    pathname: "/authorize/login",
    path: "",
  };

  return (
    <div className={`nc-SectionHero relative ${className}`}>
      <div className="relative flex flex-col items-center space-y-14 text-center lg:flex-row lg:space-x-10 lg:space-y-0 lg:text-left">
        <div className="w-screen max-w-full space-y-5 lg:space-y-7 xl:max-w-lg">
          <h2 className="text-3xl font-semibold !leading-tight text-neutral-900 dark:text-neutral-100 md:text-4xl xl:text-5xl">
            {heading}
          </h2>
          <span className="text-neutral-6000 block text-base dark:text-neutral-400 xl:text-lg">
            {subHeading}
          </span>
          {!!btnText && (
            <ButtonPrimary
              href={buttonHref}
              type={"button"}
              className=""
              loading={false}
            >
              {btnText}
            </ButtonPrimary>
          )}
        </div>
        <div className="flex-grow">
          <Image className="w-full" src={rightImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SectionHero;

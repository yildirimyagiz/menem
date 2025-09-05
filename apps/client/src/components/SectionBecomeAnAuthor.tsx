import type { FC } from "react";
import React, { memo } from "react";
import Image from "next/image";

import rightImgDemo from "~/images/BecomeAnAuthorImg.png";
import ButtonPrimary from "~/shared/ButtonPrimary";
import Logo from "~/shared/Logo";

export interface SectionBecomeAnAuthorProps {
  className?: string;
  rightImg?: string;
}

const SectionBecomeAnAuthor: FC<SectionBecomeAnAuthorProps> = ({
  className = "",
  rightImg = rightImgDemo,
}) => {
  return (
    <div
      className={`nc-SectionBecomeAnAuthor relative flex flex-col items-center lg:flex-row ${className}`}
      data-nc-id="SectionBecomeAnAuthor"
    >
      <div className="mb-16 flex-shrink-0 lg:mb-0 lg:mr-10 lg:w-2/5">
        <Logo className="w-20" />
        <h2 className="mt-6 text-3xl font-semibold sm:mt-11 sm:text-4xl">
          Why did you choose us?
        </h2>
        <p className="mt-6 text-neutral-500 dark:text-neutral-400">
          Accompanying us, you have a trip full of experiences. With Chisfis,
          booking accommodation, resort villas, hotels, private houses,
          apartments... becomes fast, convenient, and easy.
        </p>
        <ButtonPrimary type="button" loading={false} className="mt-6 sm:mt-11">
          Become an author
        </ButtonPrimary>
      </div>
      <div className="relative h-[500px] w-full flex-grow lg:h-auto">
        <Image
          alt="Become an Author"
          src={rightImg}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-xl object-cover"
        />
      </div>
    </div>
  );
};

export default memo(SectionBecomeAnAuthor);

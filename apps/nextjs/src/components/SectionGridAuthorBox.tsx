import type { FC } from "react";
import React from "react";

import type { AuthorType } from "~/data/types";
import CardAuthorBox from "~/app/[locale]/_components/CardAuthorBox";
import CardAuthorBox2 from "~/app/[locale]/_components/CardAuthorBox2";
import { DEMO_AUTHORS } from "~/data/authors";
import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonSecondary from "~/shared/ButtonSecondary";
import Heading from "~/shared/Heading";

export interface SectionGridAuthorBoxProps {
  className?: string;
  authors?: AuthorType[];
  boxCard?: "box1" | "box2";
  gridClassName?: string;
}

const DEMO_DATA = DEMO_AUTHORS.filter((_, i) => i < 10);

const SectionGridAuthorBox: FC<SectionGridAuthorBoxProps> = ({
  className = "",
  authors = DEMO_DATA,
  boxCard = "box1",
  gridClassName = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ",
}) => {
  return (
    <div
      className={`nc-SectionGridAuthorBox relative ${className}`}
      data-nc-id="SectionGridAuthorBox"
    >
      <Heading desc="Rating based on customer reviews" isCenter>
        Top 10 author of the month
      </Heading>
      <div className={`grid gap-6 md:gap-8 ${gridClassName}`}>
        {authors.map((author, index) =>
          boxCard === "box2" ? (
            <CardAuthorBox2 key={author.id} author={author} />
          ) : (
            <CardAuthorBox
              index={index < 3 ? index + 1 : undefined}
              key={author.id}
              author={author}
            />
          ),
        )}
      </div>
      <div className="mt-16 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-5 sm:space-y-0">
        <ButtonSecondary loading>Show me more </ButtonSecondary>
        <ButtonPrimary type="button" className="" loading={false}>
          Become a host
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridAuthorBox;

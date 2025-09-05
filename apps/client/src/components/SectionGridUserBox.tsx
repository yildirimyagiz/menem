import type { User } from "@reservatior/validators/src/schemas/user";
import type { FC } from "react";
import React from "react";

import ButtonPrimary from "../shared/ButtonPrimary";
import ButtonSecondary from "../shared/ButtonSecondary";
import Heading from "../shared/Heading";
import CardUserBox from "./CardUserBox";
import CardUserBox2 from "./CardUserBox2";

export interface SectionGridUserBoxProps {
  className?: string;
  users?: User[];
  boxCard?: "box1" | "box2";
  gridClassName?: string;
}

const SectionGridUserBox: FC<SectionGridUserBoxProps> = ({
  className = "",
  users = [],
  boxCard = "box1",
  gridClassName = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ",
}) => {
  return (
    <div
      className={`nc-SectionGridUserBox relative ${className}`}
      data-nc-id="SectionGridUserBox"
    >
      <Heading desc="Rating based on customer reviews" isCenter>
        Top 10 users of the month
      </Heading>
      <div className={`grid gap-6 md:gap-8 ${gridClassName}`}>
        {Array.isArray(users) &&
          users.map((user, index) =>
            boxCard === "box2" ? (
              <CardUserBox2 key={user.id} user={user} />
            ) : (
              <CardUserBox
                index={index < 3 ? index + 1 : undefined}
                key={user.id}
                user={user}
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

export default SectionGridUserBox;

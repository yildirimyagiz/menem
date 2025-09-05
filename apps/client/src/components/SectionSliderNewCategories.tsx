"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useWindowSize } from "react-use";

import type { Route } from "~/routers/types";
import Heading from "~/shared/Heading";
import { variants } from "~/utils/animationVariants";
import CardCategory3 from "./CardCategory3";
import CardCategory4 from "./CardCategory4";
import CardCategory5 from "./CardCategory5";
import NextBtn from "./NextBtn";
import PrevBtn from "./PrevBtn";

export type TwMainColor =
  | "pink"
  | "green"
  | "yellow"
  | "red"
  | "indigo"
  | "blue"
  | "purple"
  | "gray";

export interface TaxonomyType {
  id: string | number;
  name: string;
  href: Route<string>; // Ensure this is a Route<string>
  count?: number;
  thumbnail?: string;
  desc?: string;
  color?: TwMainColor | string;
  taxonomy: "category" | "tag";
  Category: "hotel" | "stay" | "experiences" | "car" | "ticket" | "property";
  listingType?: "ForRent" | "ForSale" | "Booking";
  status: "active" | "inactive" | "pending" | "sold" | "rented" | "booked";
}
export interface SectionSliderNewCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  categories?: TaxonomyType[];
  categoryCardType?: "card3" | "card4" | "card5";
  itemPerRow?: 4 | 5;
  sliderStyle?: "style1" | "style2";
}

const DEMO_CATS: TaxonomyType[] = [
  // Same demo data as before
];

const SectionSliderNewCategories: FC<SectionSliderNewCategoriesProps> = ({
  heading = "Suggestions for discovery",
  subHeading = "Popular places to recommend for you",
  className = "",
  itemClassName = "",
  categories = DEMO_CATS,
  itemPerRow = 5,
  categoryCardType = "card3",
  sliderStyle = "style1",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);

  const windowWidth = useWindowSize().width;

  useEffect(() => {
    if (windowWidth < 320) setNumberOfItems(1);
    else if (windowWidth < 500) setNumberOfItems(itemPerRow - 3);
    else if (windowWidth < 1024) setNumberOfItems(itemPerRow - 2);
    else if (windowWidth < 1280) setNumberOfItems(itemPerRow - 1);
    else setNumberOfItems(itemPerRow);
  }, [itemPerRow, windowWidth]);

  const changeItemId = (newVal: number) => {
    setDirection(newVal > currentIndex ? 1 : -1);
    setCurrentIndex(newVal);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < categories.length - 1) changeItemId(currentIndex + 1);
    },
    onSwipedRight: () => {
      if (currentIndex > 0) changeItemId(currentIndex - 1);
    },
    trackMouse: true,
  });

  const renderCard = (item: TaxonomyType) => {
    switch (categoryCardType) {
      case "card3":
        return <CardCategory3 taxonomy={item} />;
      case "card4":
        return <CardCategory4 taxonomy={item} />;
      case "card5":
        return <CardCategory5 taxonomy={item} />;
      default:
        return <CardCategory3 taxonomy={item} />;
    }
  };

  if (!numberOfItems) return null;

  return (
    <div className={`nc-SectionSliderNewCategories ${className}`}>
      <Heading desc={subHeading} isCenter={sliderStyle === "style2"}>
        {heading}
      </Heading>
      <MotionConfig
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className="relative flow-root" {...handlers}>
          <div className="flow-root overflow-hidden rounded-xl">
            <motion.ul
              initial={false}
              className="relative -mx-2 whitespace-nowrap xl:-mx-4"
            >
              <AnimatePresence initial={false} custom={direction}>
                {categories.map((item) => (
                  <motion.li
                    className={`relative inline-block px-2 xl:px-4 ${itemClassName}`}
                    custom={direction}
                    initial={{ x: `${(currentIndex - 1) * -100}%` }}
                    animate={{ x: `${currentIndex * -100}%` }}
                    variants={variants(200, 1)}
                    key={item.id} // use a unique id as the key
                    style={{ width: `calc(100% / ${numberOfItems})` }}
                  >
                    {renderCard(item)}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
          {currentIndex > 0 && (
            <PrevBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex - 1)}
              className="absolute -left-3 top-1/3 z-[1] h-9 w-9 -translate-y-1/2 text-lg xl:-left-6 xl:h-12 xl:w-12"
            />
          )}
          {categories.length > currentIndex + numberOfItems && (
            <NextBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex + 1)}
              className="absolute -right-3 top-1/3 z-[1] h-9 w-9 -translate-y-1/2 text-lg xl:-right-6 xl:h-12 xl:w-12"
            />
          )}
        </div>
      </MotionConfig>
    </div>
  );
};

export default SectionSliderNewCategories;

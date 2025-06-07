import React, { FC, ReactNode } from "react";

import { DEMO_STAY_LISTINGS } from "~/data/listings";
import { StayDataType } from "~/data/types";
import ButtonPrimary from "~/shared/ButtonPrimary";
import HeaderFilter from "./HeaderFilter";
import StayCard from "./StayCard";
import StayCard2 from "./StayCard2";

// Define demo data
const DEMO_DATA: StayDataType[] = DEMO_STAY_LISTINGS.slice(0, 8);

export interface SectionGridFeaturePlacesProps {
  stayPropertys?: StayDataType[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  stayPropertys = DEMO_DATA,
  gridClass = "",
  heading = "Featured places to stay",
  subHeading = "Popular places to stay that Chisfis recommends for you",
  tabs = ["New York", "Tokyo", "Paris", "London"],
  cardType = "card2",
}) => {
  // Determine the appropriate card component
  const CardComponent = cardType === "card1" ? StayCard : StayCard2;

  return (
    <div className={`nc-SectionGridFeaturePlaces relative ${gridClass}`}>
      <HeaderFilter
        tabActive="New York"
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
      />
      <div
        className={`grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4`}
      >
        {stayPropertys.map((stay) => (
          <CardComponent key={stay.id} data={stay} />
        ))}
      </div>
      <div className="mt-16 flex items-center justify-center">
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridFeaturePlaces;

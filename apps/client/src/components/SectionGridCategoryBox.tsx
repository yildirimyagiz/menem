import type { FC } from "react";
import React from "react";

import Heading from "~/shared/Heading";
import CardCategoryBox1 from "./CardCategoryBox1";

export interface SectionGridCategoryBoxProps {
  categories?: TaxonomyType[];
  headingCenter?: boolean;
  categoryCardType?: "card1";
  className?: string;
  gridClassName?: string;
}

const DEMO_CATS: TaxonomyType[] = [
  {
    id: "1",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "New York",
    taxonomy: "category",
    count: 1882,
    thumbnail:
      "https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
  {
    id: "2",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "Singapore",
    taxonomy: "category",
    count: 8288,
    thumbnail:
      "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
  {
    id: "3",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "Paris",
    taxonomy: "category",
    count: 1288,
    thumbnail:
      "https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
  {
    id: "4",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "London",
    taxonomy: "category",
    count: 112,
    thumbnail:
      "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
  {
    id: "5",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "Tokyo",
    taxonomy: "category",
    count: 323,
    thumbnail:
      "https://images.pexels.com/photos/4151484/pexels-photo-4151484.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
  {
    id: "6",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "Maldives",
    taxonomy: "category",
    count: 2223,
    thumbnail:
      "https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
  {
    id: "7",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "New York",
    taxonomy: "category",
    count: 1775,
    thumbnail:
      "https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
  {
    id: "8",
    href: { path: "/listing-hotel-map", pathname: "", query: { id: "1" } },
    name: "Singapore",
    taxonomy: "category",
    count: 1288,
    thumbnail:
      "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    Category: "hotel",
    status: "active",
    listingType: "Booking",
    PropertyType: "Hotel",
  },
];

const SectionGridCategoryBox: FC<SectionGridCategoryBoxProps> = ({
  categories = DEMO_CATS,
  categoryCardType = "card1",
  headingCenter = true,
  className = "",
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  // Directly use CardCategoryBox1 for cardType "card1"
  const CardComponent =
    categoryCardType === "card1" ? CardCategoryBox1 : CardCategoryBox1;

  return (
    <div className={`nc-SectionGridCategoryBox relative ${className}`}>
      <Heading
        desc="Discover great places near where you live"
        isCenter={headingCenter}
      >
        Explore nearby
      </Heading>
      <div className={`grid ${gridClassName} gap-5 sm:gap-6 md:gap-8`}>
        {categories.map((item) => (
          <CardComponent key={item.id} taxonomy={item} />
        ))}
      </div>
    </div>
  );
};

export default SectionGridCategoryBox;

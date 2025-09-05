import type { FC } from "react";
import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";

import type { Property, PropertyFilterInput } from "@reservatior/validators";

import type { Currency, Review, User } from "~/utils/types";
import ButtonSecondary from "~/shared/ButtonSecondary";

interface UserListingsProps {
  userName: string;
  categories: string[];
  listingType: string;
  listings: Property[];
  user: User;
}

const getCategoryTaxonomy = (category: string) => {
  return {
    id: category.toLowerCase(),
    name: category,
    href: {
      pathname: `/properties/${category.toLowerCase()}`,
      path: `/properties/${category.toLowerCase()}`,
    },
    taxonomy: "category",
    Category: category.toLowerCase(),
    status: "active",
    listingType: "SALE",
  };
};

const UserListings: FC<UserListingsProps> = ({
  userName,
  categories,
  listingType,
  listings,
  user,
}) => {
  const renderListingCard = (listing: Property) => {
    const cardData = {
      id: listing.id,
      title: listing.title,
      date: listing.createdAt.toISOString(),
      href: {
        pathname: `/property/${listing.id}`,
        path: `/property/${listing.id}`,
      },
      featuredImage: listing.Photo?.[0]?.url || "/default-image.jpg",
      listingCategory: getCategoryTaxonomy(listing.category),
      featured: listing.featured,
      isActive: listing.isActive,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      deletedAt: listing.deletedAt,
    };

    const userData = {
      id: user.id,
      displayName: user.displayName ?? user.name ?? "Unknown User",
      avatar: user.profilePicture ?? user.image ?? "/default-avatar.png",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      count: user.OwnedProperties?.length ?? 0,
      desc: "",
      jobName: "",
      href: {
        path: `/user/${user.id}`,
        pathname: `/user/${user.id}`,
      },
    };

    return (
      <div
        key={listing.id}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
          <img
            src={cardData.featuredImage}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {listing.featured && (
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {listing.category}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {listing.propertyType}
            </span>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {listing.title}
          </h3>

          <p className="mb-4 line-clamp-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
            {listing.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={userData.avatar}
                alt={userData.displayName}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {userData.displayName}
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {listing.propertyStatus}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {listing.bedrooms && listing.bathrooms
                  ? `${listing.bedrooms} bed, ${listing.bathrooms} bath`
                  : `${listing.size} sq ft`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="listingSection__wrap">
      <div>
        <h2 className="text-2xl font-semibold">{`${userName}'s Properties`}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {`${userName}'s properties are very rich, 5-star reviews help them to be more branded.`}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <div>
        <Tab.Group>
          <Tab.List className="flex space-x-1 overflow-x-auto">
            {categories.map((item) => (
              <Tab key={item} as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`block flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none focus:outline-none sm:px-6 sm:py-3 sm:text-base ${
                      selected
                        ? "bg-secondary-900 text-secondary-50"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    } `}
                  >
                    {item}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {categories.map((category, idx) => (
              <Tab.Panel key={idx}>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
                  {listings
                    .filter((listing) => listing.category === category)
                    .slice(0, 4)
                    .map((listing) => renderListingCard(listing))}
                </div>
                <div className="mt-11 flex items-center justify-center">
                  <ButtonSecondary>Show me more</ButtonSecondary>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default UserListings;

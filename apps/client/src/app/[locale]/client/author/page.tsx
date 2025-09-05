"use client";

import { Tab } from "@headlessui/react";
import {
    Award,
    BarChart3,
    Bell,
    Building,
    CheckCircle,
    Edit,
    Eye,
    Globe,
    Heart,
    Home,
    Mail,
    MessageCircle,
    Phone,
    Search,
    Shield,
    ShoppingCart,
    Star,
    User
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Fragment, useState } from "react";

import AnimatedPropertyCard from "~/app/[locale]/client/properties/components/AnimatedPropertyCard";
import StartRating from "~/app/_components/StartRating";
import CommentListing from "~/components/CommentListing";
import { useAuth } from "~/hooks/use-auth";
import Avatar from "~/shared/Avatar";
import ButtonSecondary from "~/shared/ButtonSecondary";
import TelegramButton from "~/shared/CButtons/Tbutton";
import SocialsList from "~/shared/SocialsList";
import { api } from "~/trpc/react";

export type AuthorPageProps = object;

// Function to get role configuration with translated strings
const getRoleConfig = (t: ReturnType<typeof useTranslations>) => ({
  TENANT: {
    title: t("roles.tenant.title"),
    icon: Home,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: t("roles.tenant.description"),
    longDescription: t("roles.tenant.longDescription"),
    tabs: ["Properties", "Rentals", "Reviews", "Analytics", "Activity"],
    showProperties: true,
    showRentals: true,
    showAnalytics: true,
    showTeam: false,
    showActivity: true,
    features: [
      t("roles.tenant.features.0"),
      t("roles.tenant.features.1"),
      t("roles.tenant.features.2"),
      t("roles.tenant.features.3")
    ]
  },
  GUEST: {
    title: t("roles.guest.title"),
    icon: User,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: t("roles.guest.description"),
    longDescription: t("roles.guest.longDescription"),
    tabs: ["Favorites", "Reviews", "Analytics", "Activity"],
    showProperties: false,
    showRentals: false,
    showAnalytics: true,
    showTeam: false,
    showActivity: true,
    features: [
      t("roles.guest.features.0"),
      t("roles.guest.features.1"),
      t("roles.guest.features.2"),
      t("roles.guest.features.3")
    ]
  },
  BUYER: {
    title: t("roles.buyer.title"),
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: t("roles.buyer.description"),
    longDescription: t("roles.buyer.longDescription"),
    tabs: ["Favorites", "Saved Searches", "Reviews", "Analytics", "Activity"],
    showProperties: false,
    showRentals: false,
    showAnalytics: true,
    showTeam: false,
    showActivity: true,
    features: [
      t("roles.buyer.features.0"),
      t("roles.buyer.features.1"),
      t("roles.buyer.features.2"),
      t("roles.buyer.features.3")
    ]
  },
  SELLER: {
    title: t("roles.seller.title"),
    icon: Building,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: t("roles.seller.description"),
    longDescription: t("roles.seller.longDescription"),
    tabs: ["Properties", "Listings", "Reviews", "Analytics", "Activity"],
    showProperties: true,
    showRentals: false,
    showAnalytics: true,
    showTeam: false,
    showActivity: true,
    features: [
      t("roles.seller.features.0"),
      t("roles.seller.features.1"),
      t("roles.seller.features.2"),
      t("roles.seller.features.3")
    ]
  },
  USER: {
    title: t("roles.user.title"),
    icon: User,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: t("roles.user.description"),
    longDescription: t("roles.user.longDescription"),
    tabs: ["Favorites", "Reviews", "Analytics", "Activity"],
    showProperties: false,
    showRentals: false,
    showAnalytics: true,
    showTeam: false,
    showActivity: true,
    features: [
      t("roles.user.features.0"),
      t("roles.user.features.1"),
      t("roles.user.features.2"),
      t("roles.user.features.3")
    ]
  },
  ADMIN: {
    title: t("roles.admin.title"),
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: t("roles.admin.description"),
    longDescription: t("roles.admin.longDescription"),
    tabs: ["Properties", "Rentals", "Reviews", "Analytics", "Activity", "Settings", "Team"],
    showProperties: true,
    showRentals: true,
    showAnalytics: true,
    showTeam: true,
    showActivity: true,
    showSettings: true,
    features: [
      t("roles.admin.features.0"),
      t("roles.admin.features.1"),
      t("roles.admin.features.2"),
      t("roles.admin.features.3")
    ]
  }
});

const AuthorPage: FC<AuthorPageProps> = () => {
  const { user: currentUser } = useAuth();
  const t = useTranslations("author");
  
  // Get user role configuration
  const userRole = currentUser?.role ?? "USER";
  const roleConfigs = getRoleConfig(t);
  const roleConfig: RoleConfig = roleConfigs[userRole as keyof typeof roleConfigs] || roleConfigs.USER;
  
  const [categories] = useState(roleConfig.tabs.map(tab => 
    t(`tabs.${tab.toLowerCase()}`, { defaultValue: tab })
  ));

  // Use current user's ID
  const userId = currentUser?.id;

  // Fetch user's properties
  const { data: properties, isLoading: propertiesLoading } =
    api.property.all.useQuery({ ownerId: userId }, { enabled: !!userId });

  // Fetch user's reviews
  const { data: reviews, isLoading: reviewsLoading } = api.review.all.useQuery(
    { userId: userId },
    { enabled: !!userId },
  );

  // Fetch user's analytics
  const { data: analytics, isLoading: analyticsLoading } =
    api.analytics.all.useQuery({ userId: userId }, { enabled: !!userId });

  // Fetch user's rentals (for tenants)
  const { data: rentals, isLoading: rentalsLoading } = 
    api.reservation.all.useQuery(
      { userId: userId },
      { enabled: !!userId && userRole === "TENANT" }
    );

  // Fetch user's favorites (for buyers, guests, users, admins)
  const { data: favorites, isLoading: favoritesLoading } = 
    api.favorite.all.useQuery(
      { userId: userId },
      { enabled: !!userId && ["BUYER", "GUEST", "USER", "ADMIN"].includes(userRole) }
    );

  if (!currentUser) {
    return (
      <div className="container mb-24 mt-12 flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">
            {t("authorAuthRequired", { defaultValue: "Authentication Required" })}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("authorAuthMessage", { defaultValue: "Please log in to view your profile." })}
          </p>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    // TODO: Implement send message functionality
    console.log("Send message to:", currentUser.name);
  };

  const handleCall = () => {
    // TODO: Implement call functionality
    console.log("Call:", currentUser.name);
  };

  const handleEmail = () => {
    if (currentUser.email) {
      window.location.href = `mailto:${currentUser.email}`;
    }
  };

  const isVerified = ["AGENCY", "AGENT", "SELLER"].includes(userRole);
  const RoleIcon = roleConfig.icon;

  const renderSidebar = () => {
    const userName =
      currentUser.name ?? `${currentUser.firstName} ${currentUser.lastName}`;

    return (
      <div className="flex w-full flex-col items-center space-y-6 border-neutral-200 px-0 text-center dark:border-neutral-700 sm:space-y-7 sm:rounded-2xl sm:border sm:p-6 xl:p-8">
        <div className="relative">
          <Avatar
            hasChecked={isVerified}
            hasCheckedClass="w-6 h-6 -top-0.5 right-2"
            sizeClass="w-28 h-28 text-3xl"
            imgUrl={(currentUser.profileImageUrl || currentUser.image) ?? ""}
          />
          {isVerified && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                {t("verified", { defaultValue: "Verified" })}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-3 text-center">
          <h2 className="text-3xl font-semibold">
            {(currentUser.name ??
              `${currentUser.firstName} ${currentUser.lastName}`) ||
              t("anonymousUser", { defaultValue: "Anonymous User" })}
          </h2>

          {/* Role-specific title */}
          <div className="flex items-center space-x-2">
            <RoleIcon className={`h-5 w-5 ${roleConfig.color}`} />
            <p className={`text-lg font-medium ${roleConfig.color}`}>
              {roleConfig.title}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <StartRating className="!text-base" rating={4.5} />
            <span className="text-sm text-neutral-500">
              ({reviews?.items?.length ?? 0} {t("reviews", { defaultValue: "reviews" })})
            </span>
          </div>

          <span className={`inline-flex items-center rounded-full ${roleConfig.bgColor} px-2.5 py-0.5 text-xs font-medium ${roleConfig.color}`}>
            {roleConfig.description}
          </span>
          
          {/* Enhanced role description */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-xs">
            {roleConfig.longDescription}
          </p>
        </div>



        {/* User Features */}
        <div className="w-full space-y-3">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Key Features
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {roleConfig.features?.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 rounded-md bg-gray-50 px-3 py-2 dark:bg-neutral-700">
                <Award className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={handleSendMessage}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("sendMessage", { defaultValue: "Send Message" })}
          </button>

          <button
            onClick={handleCall}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
          >
            <Phone className="mr-2 h-4 w-4" />
            {t("call", { defaultValue: "Call" })}
          </button>

          {currentUser.email && (
            <button
              onClick={handleEmail}
              className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" />
              {t("email", { defaultValue: "Email" })}
            </button>
          )}

          {currentUser.username && (
            <TelegramButton
              username={currentUser.username}
              listingTitle="Property Inquiry"
              ownerName={userName}
              className="w-full"
            />
          )}
        </div>

        <SocialsList
          className="!space-x-3"
          itemClass="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl"
        />

        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="space-y-4">
          {currentUser.email && (
            <div className="flex items-center space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-neutral-6000 dark:text-neutral-300">
                {currentUser.email}
              </span>
            </div>
          )}

          {currentUser.username && (
            <div className="flex items-center space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-neutral-6000 dark:text-neutral-300">
                @{currentUser.username}
              </span>
            </div>
          )}

          {currentUser.phoneNumber && (
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-neutral-400" />
              <span className="text-neutral-6000 dark:text-neutral-300">
                {currentUser.phoneNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStatsCards = () => {
    const propertiesData = properties?.data;
    const reviewsData = reviews?.items;
    const rentalsData = rentals?.data;
    const favoritesData = favorites?.data;

    const getStatsForRole = () => {
      const baseStats = [
        {
          title: "Reviews",
          value: reviewsData?.length ?? 0,
          subtitle: "Customer reviews",
          show: true
        },
        {
          title: "Experience",
          value: 1, // TODO: Calculate from user data
          subtitle: "Years active",
          show: true
        }
      ];

      // Role-specific stats
      if (roleConfig.showProperties) {
        baseStats.unshift({
          title: "Properties",
          value: propertiesData?.length ?? 0,
          subtitle: "Total listings",
          show: true
        });
      } else if (["BUYER", "GUEST", "USER", "ADMIN"].includes(userRole)) {
        baseStats.unshift({
          title: "Favorites",
          value: favoritesData?.length ?? 0,
          subtitle: "Saved properties",
          show: true
        });
      }

      if (userRole === "TENANT") {
        baseStats.splice(1, 0, {
          title: "Rentals",
          value: rentalsData?.length ?? 0,
          subtitle: "Active rentals",
          show: true
        });
      }

      return baseStats.filter(stat => stat.show);
    };

    const stats = getStatsForRole();

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg border bg-white p-6 dark:bg-neutral-800">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {stat.title}
            </h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stat.value}
              </span>
              <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                {stat.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPropertiesSection = () => {
    if (!roleConfig.showProperties) {
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            Properties section is not available for {roleConfig.title.toLowerCase()} users.
          </p>
        </div>
      );
    }

    if (propertiesLoading) {
      return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      );
    }

    const propertiesData = properties?.data;
    if (
      !propertiesData ||
      !Array.isArray(propertiesData) ||
      propertiesData.length === 0
    ) {
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No properties found for this {roleConfig.title.toLowerCase()}.
          </p>
        </div>
      );
    }

    const handleFavoriteToggle = (propertyId: string) => {
      // TODO: Implement favorite toggle functionality
      console.log("Toggle favorite for property:", propertyId);
    };

    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
        {propertiesData.slice(0, 4).map((property: any, index: number) => (
          <AnimatedPropertyCard
            key={property.id || index}
            property={property}
            index={index}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={false}
          />
        ))}
        {propertiesData.length > 4 && (
          <div className="mt-11 flex items-center justify-center">
            <ButtonSecondary>Show me more</ButtonSecondary>
          </div>
        )}
      </div>
    );
  };

  const renderRentalsSection = () => {
    if (userRole !== "TENANT") {
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            Rentals section is only available for tenants.
          </p>
        </div>
      );
    }

    if (rentalsLoading) {
      return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      );
    }

    const rentalsData = rentals?.data;
    if (
      !rentalsData ||
      !Array.isArray(rentalsData) ||
      rentalsData.length === 0
    ) {
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No active rentals found.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
        {rentalsData.slice(0, 4).map((rental: any, index: number) => (
          <div
            key={rental.id || index}
            className="rounded-lg border bg-white p-6 dark:bg-neutral-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{rental.property?.title || "Rental Property"}</h3>
                <p className="text-sm text-neutral-500">
                  {rental.startDate} - {rental.endDate}
                </p>
                <p className="text-sm text-neutral-500">
                  Status: {rental.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${rental.totalAmount}</p>
                <p className="text-sm text-neutral-500">Total</p>
              </div>
            </div>
          </div>
        ))}
        {rentalsData.length > 4 && (
          <div className="mt-11 flex items-center justify-center">
            <ButtonSecondary>Show me more</ButtonSecondary>
          </div>
        )}
      </div>
    );
  };

  const renderFavoritesSection = () => {
    if (!["BUYER", "GUEST", "USER", "ADMIN"].includes(userRole)) {
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            Favorites section is only available for buyers, guests, general users, and admins.
          </p>
        </div>
      );
    }

    if (favoritesLoading) {
      return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      );
    }

    const favoritesData = favorites?.data;
    if (
      !favoritesData ||
      !Array.isArray(favoritesData) ||
      favoritesData.length === 0
    ) {
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No favorite properties found.
          </p>
        </div>
      );
    }

    const handleFavoriteToggle = (propertyId: string) => {
      // TODO: Implement favorite toggle functionality
      console.log("Remove from favorites:", propertyId);
    };

    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
        {favoritesData.slice(0, 4).map((favorite: any, index: number) => (
          <AnimatedPropertyCard
            key={favorite.propertyId || index}
            property={favorite.property}
            index={index}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={true}
          />
        ))}
        {favoritesData.length > 4 && (
          <div className="mt-11 flex items-center justify-center">
            <ButtonSecondary>Show me more</ButtonSecondary>
          </div>
        )}
      </div>
    );
  };

  const renderReviewsSection = () => {
    if (reviewsLoading) {
      return (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="py-8">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
            </div>
          ))}
        </div>
      );
    }

    const reviewsData = reviews?.items;
    if (
      !reviewsData ||
      !Array.isArray(reviewsData) ||
      reviewsData.length === 0
    ) {
      return (
        <div className="py-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No reviews found for this user.
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {reviewsData.slice(0, 4).map((review: any) => (
          <CommentListing key={review.id} className="py-8" data={review} />
        ))}
        {reviewsData.length > 4 && (
          <div className="pt-8">
            <ButtonSecondary>
              View more {reviewsData.length - 4} reviews
            </ButtonSecondary>
          </div>
        )}
      </div>
    );
  };

  const renderAnalyticsSection = () => {
    if (analyticsLoading) {
      return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      );
    }

    const analyticsData = analytics?.data;
    if (
      !analyticsData ||
      !Array.isArray(analyticsData) ||
      analyticsData.length === 0
    ) {
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No analytics data available for this user.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
        {analyticsData.slice(0, 4).map((analytic: any, index: number) => (
          <div key={analytic.id || index} className="rounded-lg border p-6">
            <h3 className="font-semibold">{analytic.type || "Analytics"}</h3>
            <p className="text-sm text-neutral-500">
              {analytic.timestamp
                ? new Date(analytic.timestamp).toLocaleDateString()
                : "No date available"}
            </p>
            {analytic.value && (
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {analytic.value}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderActivitySection = () => {
    const activities = [
      {
        id: 1,
        type: "property_view",
        title: "Viewed Downtown Apartment",
        description: "You viewed a 2-bedroom apartment in downtown area",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: Eye,
        color: "text-blue-600"
      },
      {
        id: 2,
        type: "favorite_added",
        title: "Added to Favorites",
        description: "You added 'Modern Villa' to your favorites",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        icon: Heart,
        color: "text-red-600"
      },
      {
        id: 3,
        type: "review_posted",
        title: "Posted Review",
        description: "You reviewed 'Luxury Condo' with 5 stars",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        icon: Star,
        color: "text-yellow-600"
      },
      {
        id: 4,
        type: "search_performed",
        title: "Property Search",
        description: "You searched for properties in Miami area",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        icon: Search,
        color: "text-green-600"
      }
    ];

    return (
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            View All Activity
          </button>
        </div>
        
        <div className="space-y-4">
          {activities.map((activity) => {
            const ActivityIcon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-4 rounded-lg border bg-white p-4 dark:bg-neutral-800">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-700`}>
                  <ActivityIcon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                    {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSettingsSection = () => {
    return (
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium">Privacy Settings</h4>
            </div>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Manage your privacy preferences and data sharing settings.
            </p>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
              Configure Privacy
            </button>
          </div>
          
          <div className="rounded-lg border bg-white p-6 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-green-600" />
              <h4 className="font-medium">Notifications</h4>
            </div>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Control your notification preferences and alerts.
            </p>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
              Manage Notifications
            </button>
          </div>
          
          <div className="rounded-lg border bg-white p-6 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium">Language & Region</h4>
            </div>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Set your preferred language and regional settings.
            </p>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
              Change Settings
            </button>
          </div>
          
          <div className="rounded-lg border bg-white p-6 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium">Data & Analytics</h4>
            </div>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              View and manage your data usage and analytics preferences.
            </p>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTeamSection = () => {
    return (
      <div className="mt-8 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">
          Team section is not available for this user type.
        </p>
      </div>
    );
  };

  const renderMainContent = () => {
    const propertiesData = properties?.data;
    const reviewsData = reviews?.items;
    const rentalsData = rentals?.data;
    const favoritesData = favorites?.data;

    const getProfileDescription = () => {
      const userName = (currentUser.name ?? currentUser.firstName) || "User";
      const roleName = roleConfig.title.toLowerCase();
      
      if (userRole === "TENANT") {
        return `${userName} is a ${roleName} with ${rentalsData?.length ?? 0} active rentals and ${reviewsData?.length ?? 0} reviews.`;
      } else if (["BUYER", "GUEST", "USER", "ADMIN"].includes(userRole)) {
        return `${userName} is a ${roleName} with ${favoritesData?.length ?? 0} favorite properties and ${reviewsData?.length ?? 0} reviews.`;
      } else {
        return `${userName} is a ${roleName} with ${propertiesData?.length ?? 0} properties and ${reviewsData?.length ?? 0} reviews.`;
      }
    };

    const renderTabPanel = (tabName: string) => {
      // Handle translated tab names by checking against multiple possible values
      const tabNameLower = tabName.toLowerCase();
      
      // Check for favorites tab (translated or original)
      if (tabNameLower.includes("favorite") || tabNameLower === "favorites") {
        return renderFavoritesSection();
      }
      
      // Check for reviews tab (translated or original)
      if (tabNameLower.includes("review") || tabNameLower === "reviews") {
        return renderReviewsSection();
      }
      
      // Check for analytics tab (translated or original)
      if (tabNameLower.includes("analytics") || tabNameLower === "analytics") {
        return renderAnalyticsSection();
      }
      
      // Check for properties tab (translated or original)
      if (tabNameLower.includes("property") || tabNameLower === "properties") {
        return renderPropertiesSection();
      }
      
      // Check for rentals tab (translated or original)
      if (tabNameLower.includes("rental") || tabNameLower === "rentals") {
        return renderRentalsSection();
      }
      
      // Check for activity tab (translated or original)
      if (tabNameLower.includes("activity") || tabNameLower === "activity") {
        return renderActivitySection();
      }
      
      // Check for settings tab (translated or original)
      if (tabNameLower.includes("settings") || tabNameLower === "settings") {
        return renderSettingsSection();
      }
      
      // Check for team tab (translated or original)
      if (tabNameLower.includes("team") || tabNameLower === "team") {
        return renderTeamSection();
      }
      
      // Default case for unknown tabs
      return (
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            {tabName} section is not available for {roleConfig.title.toLowerCase()} users.
          </p>
        </div>
      );
    };

    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">
            {`${(currentUser.name ?? currentUser.firstName) || t('profile.defaultName')} ${t('profile.title')}`}
          </h2>
          <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
            {getProfileDescription()}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Stats Cards */}
        <div className="mt-6">{renderStatsCards()}</div>

        <div className="mt-8">
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
              {categories.map((tabName) => (
                <Tab.Panel key={tabName}>
                  {renderTabPanel(tabName)}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-AuthorPage`}>
      <main className="container mb-24 mt-12 flex flex-col lg:mb-32 lg:flex-row">
        <div className="mb-24 block flex-grow lg:mb-0">
          <div className="lg:sticky lg:top-24">{renderSidebar()}</div>
        </div>
        <div className="w-full flex-shrink-0 space-y-8 lg:w-3/5 lg:space-y-10 lg:pl-10 xl:w-2/3">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default AuthorPage;

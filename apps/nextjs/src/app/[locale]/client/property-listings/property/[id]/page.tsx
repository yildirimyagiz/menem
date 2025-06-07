"use client";

import type { FC, Key } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  ArrowRightIcon,
  MapPinIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { FacilityAmenities, ListingType } from "@acme/db";
import { PropertyAmenities } from "@acme/validators";

import type { ReviewData } from "~/components/CommentListing";
import type { Property } from "~/utils/interfaces";
import CommentProperty from "~/components/CommentListing";
import PhotoSidebar from "~/components/PhotoSidebar";
import Avatar from "~/shared/Avatar";
import Badge from "~/shared/Badge";
import ButtonCircle from "~/shared/ButtonCircle";
import ButtonClose from "~/shared/ButtonClose";
import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonSecondary from "~/shared/ButtonSecondary";
import Input from "~/shared/Input";
import { api } from "~/trpc/react";
import GuestsInput from "../GuestsInput";
import StayDatesRangeInput from "../StayDatesRangeInput";
import EnhancedPropertyTabs from "./components/EnhancedPropertyTabs";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section5 from "./components/Section5";
import Section6 from "./components/Section6";
import Section7 from "./components/Section7";
import Section8 from "./components/Section8";
import Sidebar from "./components/Sidebar";

export interface PropertyDetailPageProps {
  params?: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

// Add blur placeholder component
const BlurImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`${className} transition-all duration-300 hover:scale-105`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjVBQVRAQkBAQEBAQED/2wBDAR4eHh0aHTQaGjQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDT/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      priority={false}
    />
  );
};

const PropertyDetailPage: FC<PropertyDetailPageProps> = ({}) => {
  const t = useTranslations("properties");
  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [isPhotoSidebarOpen, setIsPhotoSidebarOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const params = useParams();
  const propertyId = (params?.id as string) || "";

  // Fetch property data
  const { data: property, isLoading: isPropertyLoading } =
    api.property.byId.useQuery({ id: propertyId }, { enabled: !!propertyId });

  // Transform the property data once
  const propertyData = useMemo(() => {
    if (!property) return null;

    // Process photos
    const processedPhotos = (property.Photo || []).map((photo) => ({
      ...photo,
      url: photo.url.startsWith("http") ? photo.url : `https://${photo.url}`,
      width: photo.width ?? 800,
      height: photo.height ?? 600,
      alt: photo.alt || property.title,
    }));

    // Process reviews
    const processedReviews = (property.Review || []).map((review) => ({
      id: review.id,
      stars: review.rating ?? 5,
      content: review.content,
      createdAt: review.createdAt,
      user: {
        id: review.userId || review.userId,
        name: review.username || "Anonymous",
        image: review.userImage || null,
      },
      replies: [], // Will be populated below
    }));

    // Add replies to reviews
    const reviewsWithReplies = processedReviews.map((review) => {
      const replies = processedReviews.filter((r) =>
        (property.Review || []).some(
          (tr) => tr.id === r.id && tr.parentId === review.id,
        ),
      );
      return replies.length > 0 ? { ...review, replies } : review;
    });

    // Filter out replies from top level
    const topLevelReviews = reviewsWithReplies.filter(
      (review) =>
        !(property.Review || []).some((r) => r.id === review.id && r.parentId),
    );

    // Get pricing information
    const pricingRule = property.PricingRules?.[0];
    const price = pricingRule?.basePrice ?? 0;
    const currency = property.currency?.code || "USD";

    return {
      ...property,
      photos: processedPhotos,
      reviews: topLevelReviews,
      price,
      currency,
      propertyAmenities: property.amenities || [],
      locationAmenities: property.Location?.amenities || [],
      facilityAmenities: property.Facility?.amenities || [],
      videoUrl: property.videoUrl,
      virtualTour: property.virtualTour,
    };
  }, [property]);

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const handleOpenModalImageGallery = (index = 0) => {
    setCurrentPhotoIndex(index);
    setIsPhotoSidebarOpen(true);
  };

  const handleClosePhotoSidebar = () => {
    setIsPhotoSidebarOpen(false);
  };

  if (isPropertyLoading || !propertyId || !propertyData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Add proper type for the property data
  const propertyWithType = propertyData as typeof propertyData & {
    photos: Array<{ url: string; alt?: string }>;
    reviews: Array<{
      id: string;
      stars: number;
      content: string;
      createdAt: Date;
      user: {
        id: string;
        name: string;
        image: string | null;
      };
      replies: any[];
    }>;
    price: number;
    currency: string;
    propertyAmenities: any[];
    locationAmenities: any[];
    facilityAmenities: any[];
    videoUrl?: string;
    virtualTour?: string;
  };

  return (
    <div className="nc-PropertyStayDetailPage">
      {/* Enhanced Property Tabs */}
      <EnhancedPropertyTabs propertyData={propertyWithType} />
      
      {/*  HEADER */}
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-2">
          <div
            className="relative col-span-2 row-span-3 cursor-pointer overflow-hidden rounded-md sm:row-span-2 sm:rounded-xl"
            onClick={() => handleOpenModalImageGallery(0)}
          >
            <BlurImage
              src={propertyWithType.photos?.[0]?.url ?? ""}
              alt={propertyWithType.title}
              className="rounded-md object-cover sm:rounded-xl"
            />
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
          </div>
          {propertyData.Photo?.filter((_, i) => i >= 1 && i < 5).map(
            (photo, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-md sm:rounded-xl ${
                  typeof index === "number" && index >= 3
                    ? "hidden sm:block"
                    : ""
                }`}
                onClick={() => handleOpenModalImageGallery(index + 1)}
              >
                <div className="aspect-h-3 aspect-w-4 sm:aspect-h-5 sm:aspect-w-6">
                  <BlurImage
                    src={photo.url}
                    alt={propertyData.title}
                    className="rounded-md object-cover sm:rounded-xl"
                  />
                </div>

                {/* OVERLAY */}
                <div className="absolute inset-0 cursor-pointer bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100" />
              </div>
            ),
          )}

          <button
            className="absolute bottom-3 left-3 z-10 hidden rounded-xl bg-neutral-100 px-4 py-2 text-neutral-500 hover:bg-neutral-200 md:flex md:items-center md:justify-center"
            onClick={() => handleOpenModalImageGallery(0)}
          >
            <Squares2X2Icon className="h-5 w-5" />
            <span className="ml-2 text-sm font-medium text-neutral-800">
              {t("detail.showAllPhotos")}
            </span>
          </button>
        </div>
      </header>

      {/* Photo Sidebar */}
      <PhotoSidebar
        propertyId={propertyId}
        isOpen={isPhotoSidebarOpen}
        onClose={handleClosePhotoSidebar}
        title={propertyData.title}
        photos={propertyData.Photo?.map((photo) => ({
          url: photo.url,
          caption: photo.caption,
          alt: photo.alt,
        }))}
        currentPhotoIndex={currentPhotoIndex}
        propertyAmenities={propertyData.propertyAmenities}
        locationAmenities={propertyData.locationAmenities}
        facilityAmenities={propertyData.facilityAmenities}
        videoUrl={propertyData.videoUrl}
        virtualTour={propertyData.virtualTour}
      />

      {/* Navigation Tabs */}
      <PropertyTabs propertyData={propertyData} />

      {/* MAIN */}
      <main className="relative z-10 mt-11 flex flex-col lg:flex-row">
        {/* CONTENT */}
        <div className="w-full space-y-8 lg:w-3/5 lg:space-y-10 lg:pe-10 xl:w-2/3">
          {/* Pricing Section */}
          <div id="pricing">
            <Section1 propertyData={propertyData} />
          </div>

          {/* About Section */}
          <div id="about">
            <Section2 propertyData={propertyData} />
          </div>

          {/* Contact Section */}
          <div id="contact">
            <Section6 propertyData={propertyData} />
          </div>

          {/* Amenities Section */}
          <div id="amenities">
            <Section3
              propertyData={propertyData}
              isOpenModalAmenities={isOpenModalAmenities}
              openModalAmenities={openModalAmenities}
              closeModalAmenities={closeModalAmenities}
            />
          </div>

          {/* Fees and Policies Section */}
          <div id="fees">
            <Section4 propertyData={propertyData} />
          </div>

          {/* Location Section */}
          <div id="location">
            <Section5 propertyData={propertyData} />
          </div>

          {/* Education Section */}
          <div id="education">
            <Section7 propertyData={propertyData} />
          </div>

          {/* Transportation Section */}
          <div id="transportation">
            <Section8 propertyData={propertyData} />
          </div>

          {/* Points of Interest Section */}
          <div id="points-of-interest">
            <Section8 propertyData={propertyData} />
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="space-y-8">
            <h2 className="text-2xl font-semibold">{t("reviews")}</h2>
            {propertyData.Review && propertyData.Review.length > 0 ? (
              propertyData.Review.map((review) => {
                // Transform the review to match ReviewData type
                const reviewData: ReviewData = {
                  id: review.id,
                  stars: review.rating ?? 5,
                  content: review.content,
                  createdAt: review.createdAt,
                  user: {
                    id: review.userId,
                    name: review.User?.username ?? t("anonymous"),
                    image: review.User?.image ?? null,
                  },
                };

                return (
                  <CommentProperty
                    key={review.id}
                    className="mt-8"
                    data={reviewData}
                  />
                );
              })
            ) : (
              <p className="text-gray-500">{t("noReviewsYet")}</p>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="mt-14 hidden flex-grow lg:mt-0 lg:block">
          <div className="sticky top-28">
            <propertyId
              propertyId={propertyId}
              listingType={propertyData.listingType}
              price={propertyData.price}
              availabilityDate={propertyData.Availability}
              checkInTime={propertyData.checkInTime}
              checkOutTime={propertyData.checkOutTime}
              owner={{
                id: propertyData.Owner?.id,
                userName: propertyData.Owner?.username,
                email: propertyData.Owner?.email,
                image: propertyData.Owner?.image,
                type: propertyData.Owner?.type,
                responseRate: propertyData.Owner?.responseRate,
                responseTime: propertyData.Owner?.responseTime,
                starRating: propertyData.Owner?.starRating,
              }}
              facility={
                propertyData.Facility
                  ? {
                      name: propertyData.Facility.name,
                      facilityType: propertyData.Facility.facilityType,
                    }
                  : null
              }
              onClose={() => console.log("Close sidebar")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetailPage;

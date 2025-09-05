"use client";

import type { FC } from "react";
import { useState } from "react";
import Image from "next/image";
import {
  Bath,
  Bed,
  Calendar,
  Car,
  CheckCircle,
  Coffee,
  Copy,
  Dumbbell,
  Facebook,
  Flame,
  Heart,
  Home,
  Leaf,
  Link2,
  Map,
  MapPin,
  PawPrint,
  Share2,
  Shield,
  Snowflake,
  Square,
  Star,
  Tv,
  Twitter,
  Users,
  Wifi,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import ListingImageGallery from "~/components/listing-image-gallery/ListingImageGallery";

// Placeholder for MapContainer import
// import MapContainer from "~/components/MapContainer";

interface ListingDetailsProps {
  property: any; // Replace with your property type if available
}

const amenityIcons: Record<string, JSX.Element> = {
  POOL: <Home className="h-4 w-4 text-blue-500" />,
  GYM: <Dumbbell className="h-4 w-4 text-blue-500" />,
  PARKING: <Car className="h-4 w-4 text-blue-500" />,
  WIFI: <Wifi className="h-4 w-4 text-blue-500" />,
  SECURITY: <Shield className="h-4 w-4 text-blue-500" />,
  FURNISHED: <Home className="h-4 w-4 text-blue-500" />,
  PET_FRIENDLY: <PawPrint className="h-4 w-4 text-blue-500" />,
  GREEN: <Leaf className="h-4 w-4 text-green-500" />,
  ELEVATOR: <Home className="h-4 w-4 text-blue-500" />,
  CAFE: <Coffee className="h-4 w-4 text-blue-500" />,
  TV: <Tv className="h-4 w-4 text-blue-500" />,
  AIR_CONDITIONING: <Snowflake className="h-4 w-4 text-blue-500" />,
  HEATING: <Flame className="h-4 w-4 text-orange-500" />,
  MAP: <Map className="h-4 w-4 text-blue-500" />,
};

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

const ListingDetails: FC<ListingDetailsProps> = ({
  property: l,
}): JSX.Element => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => ({
      amenities: !isMobile(),
      reviews: !isMobile(),
      contact: !isMobile(),
    }),
  );
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };
  const price = l.PricingRules?.[0]?.basePrice ?? l.marketValue ?? 0;
  const currency =
    typeof l.Currency === "object" &&
    l.Currency !== null &&
    "code" in l.Currency
      ? l.Currency.code
      : (l.PricingRules?.[0]?.currencyId ?? "USD");

  // Debug: log the Photo array
  console.log("Photo array:", l.Photo);

  // Build images array for gallery
  const images =
    l.Photo && Array.isArray(l.Photo) && l.Photo.length > 0
      ? l.Photo.map((p: any, idx: number) => ({
          id: idx,
          url: p.url || "/images/placeholder.png",
          caption: p.caption || l.title || "Property Photo",
        }))
      : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("photos");

  // Mock/sample data for all gallery types
  const floorPlans = [
    { id: 1, url: "/images/floorplan1.png", caption: "1 Bedroom Floor Plan" },
    { id: 2, url: "/images/floorplan2.png", caption: "2 Bedroom Floor Plan" },
  ];
  const matterportTour = "https://my.matterport.com/show/?m=exampleTourId";
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const siteMap = {
    id: 1,
    url: "/images/site-map.png",
    caption: "Property Site Map",
  };
  const locationMap = {
    id: 1,
    url: "/images/location-map.png",
    caption: "Location Map",
  };

  // Collapsible section toggle
  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 pb-12">
      {/* Apartments.com-style hero photo section at the top */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="w-full rounded-xl bg-white p-0 shadow-lg md:p-6">
          {/* Top tab bar */}
          <div className="w-full border-b bg-white px-4 pb-2 pt-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex gap-2">
                <TabsTrigger
                  value="photos"
                  className="border-b-2 border-green-600 font-semibold text-green-700"
                >
                  Photos
                </TabsTrigger>
                <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
                <TabsTrigger value="matterport">
                  Matterport 3D Tours
                </TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="siteMap">Property Site Map</TabsTrigger>
                <TabsTrigger value="locationMap">Location Map</TabsTrigger>
              </TabsList>
              <TabsContent value="photos">
                {/* Main image with arrows (Photos) */}
                <div className="relative flex w-full items-center justify-center bg-white py-6">
                  {/* Left arrow */}
                  <button
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-100 p-3 shadow hover:bg-green-600 hover:text-white focus:outline-none"
                    onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                    aria-label="Previous photo"
                    disabled={activeIndex === 0}
                    tabIndex={activeIndex === 0 ? -1 : 0}
                  >
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  {/* Main image or placeholder */}
                  {images.length > 0 ? (
                    <div
                      className="relative mx-auto cursor-zoom-in overflow-hidden rounded-xl bg-white shadow-lg"
                      style={{ maxWidth: 600, maxHeight: 420 }}
                      onClick={() => setModalOpen(true)}
                      tabIndex={0}
                      aria-label="Open photo gallery"
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setModalOpen(true);
                      }}
                    >
                      <Image
                        src={images[activeIndex].url}
                        width={600}
                        height={420}
                        alt={images[activeIndex].caption}
                        className="rounded-xl bg-white object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="flex h-[340px] w-[600px] items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          width="64"
                          height="64"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="mb-2 text-blue-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0l7 7a2 2 0 002.828 0l7-7"
                          />
                        </svg>
                        <span className="text-lg font-semibold text-blue-700">
                          No photos available yet
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Right arrow */}
                  <button
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-100 p-3 shadow hover:bg-green-600 hover:text-white focus:outline-none"
                    onClick={() =>
                      setActiveIndex((i) => Math.min(i + 1, images.length - 1))
                    }
                    aria-label="Next photo"
                    disabled={
                      activeIndex === images.length - 1 || images.length === 0
                    }
                    tabIndex={
                      activeIndex === images.length - 1 || images.length === 0
                        ? -1
                        : 0
                    }
                  >
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
                {/* Caption and photo count */}
                <div className="mb-2 mt-2 flex w-full flex-col items-center justify-center">
                  <div className="text-base font-medium text-gray-800">
                    {images[activeIndex]?.caption || "Property Photo"}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {images.length > 0
                      ? `${activeIndex + 1} / ${images.length}`
                      : null}
                  </div>
                </div>
                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="w-full overflow-x-auto px-4 pb-4">
                    <div className="flex items-center justify-center gap-2">
                      {images.map(
                        (
                          img: { id: number; url: string; caption?: string },
                          i: number,
                        ) => (
                          <button
                            key={img.id}
                            onClick={() => {
                              setActiveIndex(i);
                              setModalOpen(true);
                            }}
                            className={`border-2 ${i === activeIndex ? "border-green-600" : "border-transparent"} overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            style={{ minWidth: 64, minHeight: 48 }}
                            aria-label={`Show photo ${i + 1}`}
                          >
                            <Image
                              src={img.url}
                              alt={img.caption || `Photo ${i + 1}`}
                              width={64}
                              height={48}
                              className="object-cover"
                            />
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="floorplans">
                <div className="flex flex-col items-center gap-4 py-6">
                  {floorPlans.map((plan) => (
                    <div key={plan.id} className="flex flex-col items-center">
                      <Image
                        src={plan.url}
                        alt={plan.caption}
                        width={400}
                        height={300}
                        className="rounded-lg border shadow"
                      />
                      <div className="mt-2 text-sm text-gray-700">
                        {plan.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="matterport">
                <div className="flex items-center justify-center py-6">
                  <iframe
                    src={matterportTour}
                    width="600"
                    height="400"
                    allowFullScreen
                    title="Matterport 3D Tour"
                    className="rounded-lg border shadow"
                  />
                </div>
              </TabsContent>
              <TabsContent value="video">
                <div className="flex items-center justify-center py-6">
                  <iframe
                    width="600"
                    height="340"
                    src={videoUrl}
                    title="Property Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg border shadow"
                  />
                </div>
              </TabsContent>
              <TabsContent value="siteMap">
                <div className="flex flex-col items-center py-6">
                  <Image
                    src={siteMap.url}
                    alt={siteMap.caption}
                    width={400}
                    height={300}
                    className="rounded-lg border shadow"
                  />
                  <div className="mt-2 text-sm text-gray-700">
                    {siteMap.caption}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="locationMap">
                <div className="flex flex-col items-center py-6">
                  <Image
                    src={locationMap.url}
                    alt={locationMap.caption}
                    width={400}
                    height={300}
                    className="rounded-lg border shadow"
                  />
                  <div className="mt-2 text-sm text-gray-700">
                    {locationMap.caption}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          {/* Modal for gallery experience */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
              <div className="w-full rounded-xl bg-white p-0 shadow-lg md:p-6">
                {/* Top tab bar */}
                <div className="w-full border-b bg-white px-4 pb-2 pt-4">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="flex gap-2">
                      <TabsTrigger
                        value="photos"
                        className="border-b-2 border-green-600 font-semibold text-green-700"
                      >
                        Photos
                      </TabsTrigger>
                      <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
                      <TabsTrigger value="matterport">
                        Matterport 3D Tours
                      </TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
                      <TabsTrigger value="siteMap">
                        Property Site Map
                      </TabsTrigger>
                      <TabsTrigger value="locationMap">
                        Location Map
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="photos">
                      {/* Main image with arrows (Photos) */}
                      <div className="relative flex w-full items-center justify-center bg-white py-6">
                        {/* Left arrow */}
                        <button
                          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-100 p-3 shadow hover:bg-green-600 hover:text-white focus:outline-none"
                          onClick={() =>
                            setActiveIndex((i) => Math.max(i - 1, 0))
                          }
                          aria-label="Previous photo"
                          disabled={activeIndex === 0}
                          tabIndex={activeIndex === 0 ? -1 : 0}
                        >
                          <svg
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        {/* Main image or placeholder */}
                        {images.length > 0 ? (
                          <div
                            className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-lg"
                            style={{ maxWidth: 600, maxHeight: 420 }}
                          >
                            <Image
                              src={images[activeIndex].url}
                              width={600}
                              height={420}
                              alt={images[activeIndex].caption}
                              className="rounded-xl bg-white object-contain"
                              priority
                            />
                          </div>
                        ) : (
                          <div className="flex h-[340px] w-[600px] items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
                            <div className="flex flex-col items-center gap-2">
                              <svg
                                width="64"
                                height="64"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="mb-2 text-blue-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0l7 7a2 2 0 002.828 0l7-7"
                                />
                              </svg>
                              <span className="text-lg font-semibold text-blue-700">
                                No photos available yet
                              </span>
                            </div>
                          </div>
                        )}
                        {/* Right arrow */}
                        <button
                          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-100 p-3 shadow hover:bg-green-600 hover:text-white focus:outline-none"
                          onClick={() =>
                            setActiveIndex((i) =>
                              Math.min(i + 1, images.length - 1),
                            )
                          }
                          aria-label="Next photo"
                          disabled={
                            activeIndex === images.length - 1 ||
                            images.length === 0
                          }
                          tabIndex={
                            activeIndex === images.length - 1 ||
                            images.length === 0
                              ? -1
                              : 0
                          }
                        >
                          <svg
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                      {/* Caption and photo count */}
                      <div className="mb-2 mt-2 flex w-full flex-col items-center justify-center">
                        <div className="text-base font-medium text-gray-800">
                          {images[activeIndex]?.caption || "Property Photo"}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {images.length > 0
                            ? `${activeIndex + 1} / ${images.length}`
                            : null}
                        </div>
                      </div>
                      {/* Thumbnail strip */}
                      {images.length > 1 && (
                        <div className="w-full overflow-x-auto px-4 pb-4">
                          <div className="flex items-center justify-center gap-2">
                            {images.map(
                              (
                                img: {
                                  id: number;
                                  url: string;
                                  caption?: string;
                                },
                                i: number,
                              ) => (
                                <button
                                  key={img.id}
                                  onClick={() => setActiveIndex(i)}
                                  className={`border-2 ${i === activeIndex ? "border-green-600" : "border-transparent"} overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                                  style={{ minWidth: 64, minHeight: 48 }}
                                  aria-label={`Show photo ${i + 1}`}
                                >
                                  <Image
                                    src={img.url}
                                    alt={img.caption || `Photo ${i + 1}`}
                                    width={64}
                                    height={48}
                                    className="object-cover"
                                  />
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="floorplans">
                      <div className="flex flex-col items-center gap-4 py-6">
                        {floorPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="flex flex-col items-center"
                          >
                            <Image
                              src={plan.url}
                              alt={plan.caption}
                              width={400}
                              height={300}
                              className="rounded-lg border shadow"
                            />
                            <div className="mt-2 text-sm text-gray-700">
                              {plan.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="matterport">
                      <div className="flex items-center justify-center py-6">
                        <iframe
                          src={matterportTour}
                          width="600"
                          height="400"
                          allowFullScreen
                          title="Matterport 3D Tour"
                          className="rounded-lg border shadow"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="video">
                      <div className="flex items-center justify-center py-6">
                        <iframe
                          width="600"
                          height="340"
                          src={videoUrl}
                          title="Property Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg border shadow"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="siteMap">
                      <div className="flex flex-col items-center py-6">
                        <Image
                          src={siteMap.url}
                          alt={siteMap.caption}
                          width={400}
                          height={300}
                          className="rounded-lg border shadow"
                        />
                        <div className="mt-2 text-sm text-gray-700">
                          {siteMap.caption}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="locationMap">
                      <div className="flex flex-col items-center py-6">
                        <Image
                          src={locationMap.url}
                          alt={locationMap.caption}
                          width={400}
                          height={300}
                          className="rounded-lg border shadow"
                        />
                        <div className="mt-2 text-sm text-gray-700">
                          {locationMap.caption}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
          <div className="shadow-t flex w-full items-center justify-between bg-white px-4 py-3">
            <div className="text-lg font-bold text-blue-900">
              {currency} {price?.toLocaleString()}{" "}
              <span className="text-base font-normal text-gray-500">/mo</span>
            </div>
            <Button
              className="bg-blue-700 text-white"
              onClick={() => setShowContact(true)}
            >
              Check Availability
            </Button>
          </div>
        </div>
        {/* Property Summary Section */}
        <div className="mx-auto mt-8 max-w-5xl rounded-xl bg-white px-4 py-6 shadow-md md:flex md:items-center md:justify-between md:gap-8">
          <div className="flex-1">
            <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-blue-900">
              {l.title}
              <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Share listing"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share this listing</DialogTitle>
                    <DialogDescription>
                      Copy the link or share on social media.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 py-2">
                    <div className="flex items-center gap-2 rounded bg-blue-50 px-2 py-1">
                      <Link2 className="h-4 w-4 text-blue-500" />
                      <span className="truncate text-sm">{shareUrl}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopy}
                        aria-label="Copy link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Facebook"
                      >
                        <Button variant="outline" size="icon">
                          <Facebook className="h-4 w-4 text-blue-700" />
                        </Button>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Twitter"
                      >
                        <Button variant="outline" size="icon">
                          <Twitter className="h-4 w-4 text-blue-500" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button variant="ghost" className="mt-2 w-full">
                      Close
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </h1>
            <div className="mb-1 flex items-center gap-2 text-blue-700">
              <MapPin className="h-5 w-5" />
              <span>{l.address}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-yellow-500">
              <Star className="h-5 w-5" />
              <span className="font-semibold text-blue-900">
                {l.averageRating?.toFixed(1) || "-"}
              </span>
              <span className="text-gray-500">
                ({l.Review?.length || 0} reviews)
              </span>
              {l.featured && <Badge color="yellow">Featured</Badge>}
              {l.mlScore && l.mlScore > 80 && (
                <Badge color="green">Verified</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-blue-800">
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> {l.bedrooms} beds
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" /> {l.bathrooms} baths
              </span>
              <span className="flex items-center gap-1">
                <Square className="h-4 w-4" /> {l.size} sqft
              </span>
              <span className="flex items-center gap-1">
                <Home className="h-4 w-4" /> {l.propertyType}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> {l.propertyStatus}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {l.category}
              </span>
            </div>
          </div>
        </div>
        {/* Property Details Section (all enums and info) */}
        <div className="mx-auto mt-6 max-w-5xl rounded-xl bg-white px-4 py-6 shadow-md">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-800">
            <Shield className="h-5 w-5 text-blue-600" /> Property Details
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm text-blue-900 md:grid-cols-2">
            {/* General */}
            {l.propertyType && (
              <div>
                <span className="font-semibold">Type:</span>{" "}
                <Badge>{l.propertyType}</Badge>
              </div>
            )}
            {l.propertyStatus && (
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <Badge>{l.propertyStatus}</Badge>
              </div>
            )}
            {l.category && (
              <div>
                <span className="font-semibold">Category:</span>{" "}
                <Badge>{l.category}</Badge>
              </div>
            )}
            {l.listingType && (
              <div>
                <span className="font-semibold">Listing Type:</span>{" "}
                <Badge>{l.listingType}</Badge>
              </div>
            )}
            {l.condition && (
              <div>
                <span className="font-semibold">Condition:</span>{" "}
                <Badge>{l.condition}</Badge>
              </div>
            )}
            {l.yearBuilt && (
              <div>
                <span className="font-semibold">Year Built:</span> {l.yearBuilt}
              </div>
            )}
            {l.floors && (
              <div>
                <span className="font-semibold">Floors:</span> {l.floors}
              </div>
            )}
            {l.size && (
              <div>
                <span className="font-semibold">Size:</span> {l.size} sqft
              </div>
            )}
            {/* Technical */}
            {l.constructionType && (
              <div>
                <span className="font-semibold">Construction:</span>{" "}
                <Badge>{l.constructionType}</Badge>
              </div>
            )}
            {l.buildingClass && (
              <div>
                <span className="font-semibold">Building Class:</span>{" "}
                <Badge>{l.buildingClass}</Badge>
              </div>
            )}
            {l.energyRating && (
              <div>
                <span className="font-semibold">Energy Rating:</span>{" "}
                <Badge>{l.energyRating}</Badge>
              </div>
            )}
            {l.energyEfficiencyRating && (
              <div>
                <span className="font-semibold">Efficiency:</span>{" "}
                <Badge>{l.energyEfficiencyRating}</Badge>
              </div>
            )}
            {l.coolingType && (
              <div>
                <span className="font-semibold">Cooling:</span>{" "}
                <Badge>{l.coolingType}</Badge>
              </div>
            )}
            {l.heatingType && (
              <div>
                <span className="font-semibold">Heating:</span>{" "}
                <Badge>{l.heatingType}</Badge>
              </div>
            )}
            {l.greenCertification && (
              <div>
                <span className="font-semibold">Green Cert.:</span>{" "}
                <Badge>{l.greenCertification}</Badge>
              </div>
            )}
            {l.architecturalStyle && (
              <div>
                <span className="font-semibold">Style:</span>{" "}
                <Badge>{l.architecturalStyle}</Badge>
              </div>
            )}
            {l.parkingType && (
              <div>
                <span className="font-semibold">Parking Type:</span>{" "}
                <Badge>{l.parkingType}</Badge>
              </div>
            )}
            {l.parkingSpaces && (
              <div>
                <span className="font-semibold">Parking Spaces:</span>{" "}
                {l.parkingSpaces}
              </div>
            )}
            {/* Legal/Ownership */}
            {l.ownershipType && (
              <div>
                <span className="font-semibold">Ownership:</span>{" "}
                <Badge>{l.ownershipType}</Badge>
              </div>
            )}
            {l.ownershipCategory && (
              <div>
                <span className="font-semibold">Ownership Category:</span>{" "}
                <Badge>{l.ownershipCategory}</Badge>
              </div>
            )}
            {l.titleDeedNumber && (
              <div>
                <span className="font-semibold">Title Deed #:</span>{" "}
                {l.titleDeedNumber}
              </div>
            )}
            {l.titleDeedDate && (
              <div>
                <span className="font-semibold">Title Deed Date:</span>{" "}
                {new Date(l.titleDeedDate).toLocaleDateString()}
              </div>
            )}
            {/* Financial */}
            {l.marketValue && (
              <div>
                <span className="font-semibold">Market Value:</span> $
                {l.marketValue.toLocaleString()}
              </div>
            )}
            {l.taxValue && (
              <div>
                <span className="font-semibold">Tax Value:</span> $
                {l.taxValue.toLocaleString()}
              </div>
            )}
            {l.insuranceValue && (
              <div>
                <span className="font-semibold">Insurance Value:</span> $
                {l.insuranceValue.toLocaleString()}
              </div>
            )}
            {typeof l.mortgageEligible === "boolean" && (
              <div>
                <span className="font-semibold">Mortgage Eligible:</span>{" "}
                <Badge color={l.mortgageEligible ? "green" : "red"}>
                  {l.mortgageEligible ? "Yes" : "No"}
                </Badge>
              </div>
            )}
            {/* Contact */}
            {l.contactMethod && (
              <div>
                <span className="font-semibold">Contact Method:</span>{" "}
                <Badge>{l.contactMethod}</Badge>
              </div>
            )}
            {/* Amenities/Features (arrays) */}
            {l.features && l.features.length > 0 && (
              <div className="col-span-2">
                <span className="font-semibold">Features:</span>{" "}
                {l.features.map((f: string) => (
                  <Badge key={f} className="ml-1">
                    {f}
                  </Badge>
                ))}
              </div>
            )}
            {l.amenities && l.amenities.length > 0 && (
              <div className="col-span-2">
                <span className="font-semibold">Amenities:</span>{" "}
                {l.amenities.map((a: string) => (
                  <Badge key={a} className="ml-1">
                    {a}
                  </Badge>
                ))}
              </div>
            )}
            {l.locationAmenities && l.locationAmenities.length > 0 && (
              <div className="col-span-2">
                <span className="font-semibold">Location Amenities:</span>{" "}
                {l.locationAmenities.map((la: string) => (
                  <Badge key={la} className="ml-1">
                    {la}
                  </Badge>
                ))}
              </div>
            )}
            {l.facilityAmenities && l.facilityAmenities.length > 0 && (
              <div className="col-span-2">
                <span className="font-semibold">Facility Amenities:</span>{" "}
                {l.facilityAmenities.map((fa: string) => (
                  <Badge key={fa} className="ml-1">
                    {fa}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-8 px-4 md:flex-row">
          {/* Main Details */}
          <div className="flex-1">
            {/* Collapsible Amenities Section */}
            <div className="mb-6">
              <button
                className="mb-2 flex w-full items-center justify-between text-lg font-semibold text-blue-800 md:hidden"
                aria-expanded={!!openSections.amenities}
                aria-controls="amenities-section"
                onClick={() => toggleSection("amenities")}
              >
                Amenities & Features
                <span>{openSections.amenities ? "−" : "+"}</span>
              </button>
              <h2 className="mb-2 hidden text-lg font-semibold text-blue-800 md:block">
                Amenities & Features
              </h2>
              {!!openSections.amenities && (
                <div id="amenities-section">
                  <div className="mb-2">
                    <h3 className="mb-1 text-sm font-semibold text-blue-700">
                      Community Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(l.amenitiesWithLabels || []).map((a: any) => (
                        <span
                          key={a.value}
                          className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800"
                        >
                          {amenityIcons[a.value] || (
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                          )}{" "}
                          {a.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  {l.featuresWithLabels && l.featuresWithLabels.length > 0 && (
                    <div className="mb-2">
                      <h3 className="mb-1 text-sm font-semibold text-blue-700">
                        Apartment Features
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {l.featuresWithLabels.map((f: any) => (
                          <span
                            key={f.value}
                            className="flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-800"
                          >
                            {amenityIcons[f.value] || (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            )}{" "}
                            {f.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {l.locationAmenities && l.locationAmenities.length > 0 && (
                    <div className="mb-2">
                      <h3 className="mb-1 text-sm font-semibold text-blue-700">
                        Location Amenities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {l.locationAmenities.map((la: string) => (
                          <span
                            key={la}
                            className="flex items-center gap-1 rounded bg-purple-50 px-2 py-1 text-xs font-medium text-purple-800"
                          >
                            {amenityIcons[la] || (
                              <CheckCircle className="h-4 w-4 text-purple-400" />
                            )}{" "}
                            {la}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {l.facilityAmenities && l.facilityAmenities.length > 0 && (
                    <div className="mb-2">
                      <h3 className="mb-1 text-sm font-semibold text-blue-700">
                        Facility Amenities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {l.facilityAmenities.map((fa: string) => (
                          <span
                            key={fa}
                            className="flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs font-medium text-orange-800"
                          >
                            {amenityIcons[fa] || (
                              <CheckCircle className="h-4 w-4 text-orange-400" />
                            )}{" "}
                            {fa}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Collapsible Map Section */}
            <div className="mb-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-blue-800">
                <Map className="h-5 w-5 text-blue-600" /> Location &
                Neighborhood
              </h2>
              {/* TODO: Replace with <MapContainer coordinates={l.Location?.coordinates} title={l.title} /> */}
              <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
                <span className="text-lg font-medium text-blue-700 opacity-70">
                  Map coming soon
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-blue-500" />
                {l.address}
              </div>
            </div>
            {/* Collapsible Reviews Section */}
            <div className="mb-6">
              <button
                className="mb-2 flex w-full items-center justify-between text-lg font-semibold text-blue-800 md:hidden"
                aria-expanded={!!openSections.reviews}
                aria-controls="reviews-section"
                onClick={() => toggleSection("reviews")}
              >
                Reviews
                <span>{openSections.reviews ? "−" : "+"}</span>
              </button>
              <h2 className="mb-2 hidden text-lg font-semibold text-blue-800 md:block">
                Reviews
              </h2>
              {!!openSections.reviews && l.Review && l.Review.length > 0 && (
                <div id="reviews-section" className="space-y-2">
                  {l.Review.map((r: any, i: number) => (
                    <Card key={i} className="p-4">
                      <div className="mb-1 font-semibold text-blue-900">
                        {r.User?.name || "Anonymous"}
                      </div>
                      <div className="mb-1 text-yellow-500">
                        Rating: {r.rating}
                      </div>
                      <div className="text-gray-700">{r.comment}</div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            {/* Collapsible Contact Form Section */}
            <div className="mb-6">
              <button
                className="mb-2 flex w-full items-center justify-between text-lg font-semibold text-blue-800 md:hidden"
                aria-expanded={!!openSections.contact}
                aria-controls="contact-section"
                onClick={() => toggleSection("contact")}
              >
                Contact
                <span>{openSections.contact ? "−" : "+"}</span>
              </button>
              <h2 className="mb-2 hidden text-lg font-semibold text-blue-800 md:block">
                Contact
              </h2>
              {!!openSections.contact && (
                <div id="contact-section">
                  <form className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full rounded border p-2"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full rounded border p-2"
                    />
                    <textarea
                      placeholder="Message"
                      className="w-full rounded border p-2"
                      rows={3}
                    />
                    <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                      Send Inquiry
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
          {/* Sticky Sidebar */}
          <aside className="relative mb-8 w-full max-w-xs flex-shrink-0 md:sticky md:top-24 md:mb-0">
            <Card className="border-blue-200 bg-white shadow-lg">
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-900">
                    {currency} {price?.toLocaleString()}
                    <span className="ml-1 text-base font-normal text-gray-500">
                      /mo
                    </span>
                  </div>
                  <button
                    className={`ml-2 rounded-full p-2 transition-colors ${isFavorite ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Save to favorites"
                    }
                    onClick={() => setIsFavorite((f) => !f)}
                    type="button"
                  >
                    <Heart
                      className={`h-6 w-6 ${isFavorite ? "fill-red-500" : ""}`}
                    />
                  </button>
                </div>
                {l.featured && (
                  <div className="mb-2 inline-block rounded bg-yellow-400/90 px-3 py-1 text-xs font-bold uppercase text-white shadow">
                    Featured
                  </div>
                )}
                {/* Contact Info */}
                {l.contactPhone && (
                  <div className="mb-2 text-sm text-blue-700">
                    <span className="font-semibold">Phone:</span>{" "}
                    {l.contactPhone}
                  </div>
                )}
                {l.contactEmail && (
                  <div className="mb-2 text-sm text-blue-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {l.contactEmail}
                  </div>
                )}
                <Button className="mt-2 w-full bg-blue-700 text-white hover:bg-blue-800">
                  Check Availability
                </Button>
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" /> Schedule a Tour
                  </Button>
                  <Button
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </Card>
          </aside>
        </div>
        {/* Contact Modal for Mobile Sticky CTA */}
        {showContact && (
          <Dialog open={showContact} onOpenChange={setShowContact}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact</DialogTitle>
                <DialogDescription>
                  Send an inquiry about this property.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full rounded border p-2"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full rounded border p-2"
                />
                <textarea
                  placeholder="Message"
                  className="w-full rounded border p-2"
                  rows={3}
                />
                <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                  Send Inquiry
                </Button>
              </form>
              <DialogClose asChild>
                <Button variant="ghost" className="mt-2 w-full">
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ListingDetails;

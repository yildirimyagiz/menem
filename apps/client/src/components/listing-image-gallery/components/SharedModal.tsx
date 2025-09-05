import { useState } from "react";
import Image from "next/image";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Tabs, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import type { PropertyGalleryImage } from "../utils/types";
import { variants } from "~/utils/animationVariants";
import { DEMO_IMAGE } from "../ListingImageGallery";
import downloadPhoto from "../utils/downloadPhoto";
import { range } from "../utils/range";
import Twitter from "./Icons/Twitter";

interface SharedModalProps {
  index: number;
  images?: PropertyGalleryImage[];
  currentPhoto?: PropertyGalleryImage;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}

export default function SharedModal({
  index,
  images = DEMO_IMAGE,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);

  const filteredImages = images?.filter((img: PropertyGalleryImage) =>
    range(index - 15, index + 15).includes(img.id),
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  const currentImage = images ? images[index] : currentPhoto;

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div className="relative z-50 mx-auto flex w-full max-w-5xl flex-col items-center rounded-xl bg-white p-0 shadow-xl md:p-6">
        {/* Sticky close button */}
        <button
          className="absolute right-4 top-4 z-20 rounded-full bg-white p-2 shadow hover:bg-gray-200 focus:outline-none"
          onClick={closeModal}
          aria-label="Close gallery"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {/* Top tab bar */}
        <div className="sticky top-0 z-10 w-full border-b bg-white px-4 pb-2 pt-4">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="flex gap-2">
              <TabsTrigger
                value="photos"
                className="border-b-2 border-green-600 font-semibold text-green-700"
              >
                Photos
              </TabsTrigger>
              <TabsTrigger value="floorplans" disabled>
                Floor Plans
              </TabsTrigger>
              <TabsTrigger value="matterport" disabled>
                Matterport 3D Tours
              </TabsTrigger>
              <TabsTrigger value="video" disabled>
                Video
              </TabsTrigger>
              <TabsTrigger value="siteMap" disabled>
                Property Site Map
              </TabsTrigger>
              <TabsTrigger value="locationMap" disabled>
                Location Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Main image with arrows */}
        <div className="relative flex w-full items-center justify-center bg-white py-6">
          {/* Left arrow */}
          <button
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-100 p-3 shadow hover:bg-green-600 hover:text-white focus:outline-none"
            onClick={() => changePhotoId(index - 1)}
            aria-label="Previous photo"
            disabled={index === 0}
            tabIndex={index === 0 ? -1 : 0}
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </button>
          {/* Main image */}
          <div
            className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-lg"
            style={{ maxWidth: 600, maxHeight: 420 }}
          >
            <Image
              src={currentImage?.url || ""}
              width={600}
              height={420}
              alt={currentImage?.caption || "Property photo"}
              className="rounded-xl bg-white object-contain"
              onLoad={() => setLoaded(true)}
              priority
            />
          </div>
          {/* Right arrow */}
          <button
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-100 p-3 shadow hover:bg-green-600 hover:text-white focus:outline-none"
            onClick={() => changePhotoId(index + 1)}
            aria-label="Next photo"
            disabled={index === images.length - 1}
            tabIndex={index === images.length - 1 ? -1 : 0}
          >
            <ChevronRightIcon className="h-7 w-7" />
          </button>
        </div>
        {/* Caption and photo count */}
        <div className="mb-2 mt-2 flex w-full flex-col items-center justify-center">
          <div className="text-base font-medium text-gray-800">
            {currentImage?.caption || "Property Photo"}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {index + 1} / {images.length}
          </div>
        </div>
        {/* Thumbnail strip */}
        <div className="w-full overflow-x-auto px-4 pb-4">
          <div className="flex items-center justify-center gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => changePhotoId(i)}
                className={`border-2 ${i === index ? "border-green-600" : "border-transparent"} overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
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
            ))}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

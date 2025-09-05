"use client";

import type { StaticImageData } from "next/image";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import type { Route } from "~/routers/types";
import { variants } from "~/utils/animationVariants";

export interface GallerySliderProps {
  className?: string;
  photos: { src: string; alt: string }[];
  ratioClass?: string;
  uniqueID: string;
  href: string | Route;
  featuredImage?: StaticImageData | string;
  defaultImage?: StaticImageData | string;
  imageClass?: string;
  galleryClass?: string;
  navigation?: boolean;
}

const DEFAULT_IMAGE = { src: "/images/placeholder.jpg", alt: "Default Image" };

export default function GallerySlider({
  className = "",
  photos = [],
  ratioClass = "aspect-w-4 aspect-h-3",
  imageClass = "",
  galleryClass = "rounded-xl",
  href = "/",
  navigation = true,
  defaultImage = DEFAULT_IMAGE.src,
}: GallerySliderProps) {
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const images =
    photos.length > 0
      ? photos
      : [{ src: defaultImage, alt: DEFAULT_IMAGE.alt }];

  function changePhotoId(newVal: number) {
    setDirection(newVal > index ? 1 : -1);
    setIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => index < images.length - 1 && changePhotoId(index + 1),
    onSwipedRight: () => index > 0 && changePhotoId(index - 1),
    trackMouse: true,
  });

  const safeIndex = Math.min(Math.max(0, index), images.length - 1);
  const currentImage = images[safeIndex] ?? DEFAULT_IMAGE;

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className={`group/cardGallerySlider group relative ${className}`}
        {...handlers}
      >
        <div className={`w-full overflow-hidden ${galleryClass}`}>
          <Link
            href={href}
            className={`relative flex items-center justify-center ${ratioClass}`}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={safeIndex}
                custom={direction}
                variants={variants(340, 1)}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={currentImage.src}
                    fill
                    alt={currentImage.alt}
                    className={`object-cover ${imageClass}`}
                    onLoad={() => setLoaded(true)}
                    sizes="(max-width: 1025px) 100vw, 300px"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </Link>
        </div>

        {images.length > 1 && (
          <>
            {loaded && navigation && (
              <div className="opacity-0 transition-opacity group-hover/cardGallerySlider:opacity-100">
                {safeIndex > 0 && (
                  <button
                    aria-label="Previous image"
                    className="dark:border-neutral-6000 absolute left-3 top-[calc(50%-16px)] flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-neutral-300 focus:outline-none dark:bg-neutral-900 dark:hover:border-neutral-500"
                    onClick={() => changePhotoId(safeIndex - 1)}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                )}
                {safeIndex + 1 < images.length && (
                  <button
                    aria-label="Next image"
                    className="dark:border-neutral-6000 absolute right-3 top-[calc(50%-16px)] flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-neutral-300 focus:outline-none dark:bg-neutral-900 dark:hover:border-neutral-500"
                    onClick={() => changePhotoId(safeIndex + 1)}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-10 rounded-b-lg bg-gradient-to-t from-neutral-900 opacity-50"></div>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform items-center justify-center space-x-1.5">
              {images.map((_, i) => (
                <button
                  className={`h-1.5 w-1.5 rounded-full ${i === safeIndex ? "bg-white" : "bg-white/60"}`}
                  onClick={() => changePhotoId(i)}
                  key={i}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </MotionConfig>
  );
}

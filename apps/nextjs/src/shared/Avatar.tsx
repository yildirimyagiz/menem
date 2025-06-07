"use client";

import type { StaticImageData } from "next/image";
import type { FC } from "react";
import React, { useState } from "react";
import Image from "next/image";

import { avatarColors } from "~/contains/contants";

export interface AvatarProps {
  containerClassName?: string;
  sizeClass?:
    | "h-6 w-6 text-sm"
    | "h-8 w-8 text-sm"
    | "h-9 w-9 text-sm"
    | "h-10 w-10 text-base"
    | "h-14 w-14 text-lg"
    | "w-20 h-20 text-2xl"
    | "w-28 h-28 text-3xl"
    | "w-8 h-8 sm:h-11 sm:w-11"
    | "w-11 h-11 md:w-24 md:h-24"
    | "w-8 h-8 sm:w-9 sm:h-9"
    | "w-12 h-12";
  radius?: string;
  imgUrl?: string | StaticImageData;
  userName?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
}

const Avatar: FC<AvatarProps> = ({
  containerClassName = "ring-1 ring-white dark:ring-neutral-900",
  sizeClass = "h-6 w-6 text-sm",
  radius = "rounded-full",
  imgUrl,
  userName = "John Doe",
  hasChecked = false,
  hasCheckedClass = "w-4 h-4 -top-0.5 -right-0.5",
}) => {
  const [imageError, setImageError] = useState(false);

  const getSize = () => {
    switch (sizeClass) {
      case "h-10 w-10 text-base":
        return { width: 40, height: 40 };
      case "h-14 w-14 text-lg":
        return { width: 56, height: 56 };
      case "w-20 h-20 text-2xl":
        return { width: 80, height: 80 };
      case "w-28 h-28 text-3xl":
        return { width: 112, height: 112 };
      case "w-8 h-8 sm:h-11 sm:w-11":
        return { width: 32, height: 32 };
      case "w-11 h-11 md:w-24 md:h-24":
        return { width: 44, height: 44 };
      case "w-8 h-8 sm:w-9 sm:h-9":
        return { width: 36, height: 36 };
      case "w-12 h-12":
        return { width: 48, height: 48 };
      case "h-6 w-6 text-sm":
      default:
        return { width: 24, height: 24 };
    }
  };

  const { width, height } = getSize();
  const bgColor = _setBgColor(userName);

  return (
    <div
      className={`wil-avatar relative inline-flex flex-shrink-0 items-center justify-center font-semibold uppercase text-neutral-100 shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
      style={{ backgroundColor: bgColor }}
      aria-label={userName}
    >
      {imgUrl && !imageError ? (
        <Image
          className={`absolute inset-0 h-full w-full object-cover ${radius}`}
          src={imgUrl}
          alt={`Avatar image of ${userName}`}
          width={width}
          height={height}
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="wil-avatar__name">{userName[0]}</span>
      )}
      {hasChecked && (
        <span
          className={`absolute flex items-center justify-center rounded-full bg-teal-500 text-xs text-white ${hasCheckedClass}`}
          aria-label="Checked"
        >
          <i className="las la-check" aria-hidden="true"></i>
        </span>
      )}
    </div>
  );
};

// Utility function moved outside the component
const _setBgColor = (name: string) => {
  const backgroundIndex = Math.floor(name.charCodeAt(0) % avatarColors.length);
  return avatarColors[backgroundIndex];
};

export default React.memo(Avatar);

import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import ButtonSecondary from "~/shared/ButtonSecondary";

export interface CollectionProps {
  className?: string;
  featuredImage?: string;
  name?: string;
  desc?: string;
  color?: string;
}

const Collection: FC<CollectionProps> = ({
  className = "",
  featuredImage = "https://images.pexels.com/photos/5059013/pexels-photo-5059013.jpeg?auto=compress&cs=tinysrgb&w=1600",
  name = "Collection",
  desc = "The most popular <br /> in the world",
  color,
}) => {
  return (
    <Link
      href={"/listing-hotel"}
      className={`nc-Collection block ${className}`}
    >
      <div
        className={`aspect-w-16 aspect-h-11 sm:aspect-h-10 group relative h-0 w-full overflow-hidden rounded-2xl ${color}`}
      >
        <div className="relative h-full w-full">
          <Image
            src={featuredImage}
            alt={`Featured image of ${name}`}
            layout="fill"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
            priority // Adds the image to the priority loading queue
          />
        </div>
        <span className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-40"></span>

        <div className="absolute inset-5 flex flex-col">
          <div className="max-w-xs">
            <span className={`mb-2 block text-sm text-slate-700`}>{name}</span>
            {desc && (
              <h2
                className={`text-xl font-semibold text-slate-900 md:text-2xl`}
                dangerouslySetInnerHTML={{ __html: desc }}
              ></h2>
            )}
          </div>
          <div className="mt-auto">
            <ButtonSecondary
              sizeClass="py-3 px-4 sm:py-3.5 sm:px-6"
              fontSize="text-sm font-medium"
            >
              Show more
            </ButtonSecondary>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Collection;

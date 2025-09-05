import type { FC } from "react";
import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

export interface StartRatingProps {
  className?: string;
  rating?: number;
  reviewCount?: number;
}

const StartRating: FC<StartRatingProps> = ({
  className = "",
  rating = 4.5,
  reviewCount = 112,
}) => (
  <div
    className={`nc-StartRating flex items-center space-x-1 text-sm ${className}`}
    data-nc-id="StartRating"
  >
    <StarIcon className="h-4 w-4 text-orange-500" />
    <span className="font-medium">{rating}</span>
    <span className="text-neutral-500 dark:text-neutral-400">
      ({reviewCount})
    </span>
  </div>
);

export default StartRating;

"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

export interface FiveStartIconForRateProps {
  className?: string;
  iconClass?: string;
  defaultValue?: number;
  onRatingChange: (rating: number) => void;
  averageRating?: number;
}

const FiveStartIconForRate: FC<FiveStartIconForRateProps> = ({
  className = "",
  iconClass = "w-4 h-4",
  defaultValue = 5,
}) => {
  const [point, setPoint] = useState(defaultValue);
  const [currentHover, setCurrentHover] = useState(0);

  useEffect(() => {
    setPoint(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className={`nc-FiveStartIconForRate flex items-center text-neutral-300 ${className}`}
      data-nc-id="FiveStartIconForRate"
    >
      {[1, 2, 3, 4, 5].map((item) => {
        return (
          <StarIcon
            key={item}
            className={`${
              point >= item || currentHover >= item ? "text-yellow-500" : ""
            } ${iconClass}`}
            onMouseEnter={() => setCurrentHover(() => item)}
            onMouseLeave={() => setCurrentHover(() => 0)}
            onClick={() => setPoint(() => item)}
          />
        );
      })}
    </div>
  );
};

export default FiveStartIconForRate;

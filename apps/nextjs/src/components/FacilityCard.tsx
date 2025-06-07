import React from "react";
import Image from "next/image";

import ButtonSecondary from "~/shared/ButtonSecondary";
import StarRating from "./starRating";

export interface Review {
  id: string;
  userId: string;
  content: string;
  stars: number | null;
  createdAt: string; // ISO date string
  user: {
    name: string; // Assuming user has a name property
  };
}

export interface FacilityCardProps {
  data: {
    id: string;
    name: string;
    details: string;
    averageRating: number | null;
    reviewCount: number;
    unitCount: number;
    photos: { url: string }[];
    reviews: Review[];
  };
}

const FacilityCard: React.FC<FacilityCardProps> = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-neutral-800">
      {data.photos.length > 0 && (
        <Image
          src={data.photos[0]?.url}
          alt={data.name}
          width={500} // Adjust as needed
          height={300} // Adjust as needed
          className="h-48 w-full object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{data.name}</h3>
        <StarRating className="!text-base" rating={data.averageRating} />
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          {data.details}
        </p>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {data.unitCount} units available
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {data.reviewCount} reviews
        </p>
        <div className="mt-4">
          <ButtonSecondary>View Details</ButtonSecondary>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-semibold">Reviews</h4>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {data.reviews.length > 0 ? (
              data.reviews.map((review) => (
                <div key={review.id} className="py-2">
                  <div className="flex items-center justify-between">
                    <StarRating className="!text-sm" rating={review.stars} />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    <strong>{review.user.name}:</strong> {review.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">
                No reviews yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;

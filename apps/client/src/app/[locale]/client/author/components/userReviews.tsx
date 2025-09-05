import type { FC } from "react";
import React from "react";

import type { ReviewData } from "~/components/CommentListing";
import CommentListing from "~/components/CommentListing";
import ButtonSecondary from "~/shared/ButtonSecondary";

interface AuthorReviewsProps {
  reviewCount: number;
  displayCount?: number;
  showViewMore?: boolean;
  reviews: ReviewData[];
}

const AuthorReviews: FC<AuthorReviewsProps> = ({
  reviewCount,
  displayCount = 4,
  showViewMore = true,
  reviews,
}) => {
  return (
    <div className="listingSection__wrap">
      <h2 className="text-2xl font-semibold">
        Reviews ({reviewCount} reviews)
      </h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {[...Array(displayCount)].map((_, index) => (
          <CommentListing
            key={index}
            hasPropertyTitle
            className={index === 0 ? "pb-8" : "py-8"}
            data={
              reviews[index] ?? {
                id: "",
                stars: 0,
                comment: "",
                createdAt: new Date(),
                user: null,
              }
            }
          />
        ))}
        {showViewMore && reviewCount > displayCount && (
          <div className="pt-8">
            <ButtonSecondary>
              View more {reviewCount - displayCount} reviews
            </ButtonSecondary>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorReviews;

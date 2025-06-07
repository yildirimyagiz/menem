"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { Property } from "~/utils/types";
import CommentProperty from "~/app/[locale]/_components/CommentProperty";
import FiveStartIconForRate from "~/app/[locale]/_components/FiveStartIconForRate";
import ButtonCircle from "~/shared/ButtonCircle";
import Input from "~/shared/Input";

interface ReviewsProps {
  propertyData: Property;
}

const Reviews: React.FC<ReviewsProps> = ({ propertyData }) => {
  const t = useTranslations();

  return (
    <div className="listingSection__wrap">
      {/* HEADING */}
      <h2 className="text-2xl font-semibold">
        {t("Reviews")} ({propertyData.reviews.length} {t("reviews")})
      </h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      {/* Content */}
      <div className="space-y-5">
        <FiveStartIconForRate
          iconClass="w-6 h-6"
          className="gap-x-0.5"
          onRatingChange={function (rating: number): void {
            throw new Error("Function not implemented.");
          }}
        />
        <div className="relative">
          <Input
            fontClass=""
            sizeClass="h-16 px-4 py-3"
            rounded="rounded-3xl"
            placeholder={t("shareThoughts")}
          />
          <ButtonCircle
            className="absolute end-2 top-1/2 -translate-y-1/2"
            size=" w-12 h-12 "
          >
            <ArrowRightIcon className="h-5 w-5 rtl:rotate-180" />
          </ButtonCircle>
        </div>
      </div>

      {/* comment */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {propertyData.reviews.map((review) => (
          <CommentProperty
            key={review.id}
            className="py-8"
            data={{
              id: review.id,
              stars: review.stars ?? 0,
              content: review.content,
              createdAt: review.createdAt,
              user: {
                id: review.id,
                name: review.id,
                image: null,
              },
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;

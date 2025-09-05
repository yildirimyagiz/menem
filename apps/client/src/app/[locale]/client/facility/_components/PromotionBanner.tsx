import React from "react";

import { Card, CardContent } from "@reservatior/ui/card";

export const PromotionBanner = ({
  title,
  description,
  discount,
  validUntil,
}: {
  title: string;
  description: string;
  discount?: number;
  validUntil?: string;
}) => (
  <Card className="flex flex-col items-center border-0 bg-gradient-to-r from-pink-100 to-yellow-100 p-4 text-center shadow-lg dark:from-pink-900 dark:to-yellow-900">
    <CardContent>
      <div className="mb-2 text-2xl font-bold text-pink-700 dark:text-pink-300">
        {title}
      </div>
      <div className="mb-2 text-base text-neutral-700 dark:text-neutral-200">
        {description}
      </div>
      {discount && (
        <div className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
          Save {discount}%
        </div>
      )}
      {validUntil && (
        <div className="mt-1 text-xs text-neutral-400">
          Valid until: {validUntil}
        </div>
      )}
    </CardContent>
  </Card>
);

export default PromotionBanner;

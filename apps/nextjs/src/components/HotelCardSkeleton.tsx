import type { FC } from "react";

export const HotelCardSkeleton: FC = () => (
  <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-neutral-900">
    <div className="aspect-w-4 aspect-h-3 animate-pulse bg-gray-200 dark:bg-gray-700" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex justify-between">
        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  </div>
);

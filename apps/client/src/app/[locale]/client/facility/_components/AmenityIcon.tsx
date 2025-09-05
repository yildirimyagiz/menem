import React from "react";

import { cn } from "~/lib/utils";

// TODO: Replace with actual amenity icon mapping
const amenityIcons: Record<string, React.ReactNode> = {
  POOL: <span>🏊‍♂️</span>,
  GYM: <span>🏋️</span>,
  PARKING: <span>🚗</span>,
  // ...add more as needed
};

export const AmenityIcon = ({
  amenity,
  className,
}: {
  amenity: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-100 to-blue-100 px-2 py-1 dark:from-green-900 dark:to-blue-900",
      className,
    )}
  >
    {amenityIcons[amenity] || <span>✨</span>}
    <span className="text-sm font-medium">{amenity.replace(/_/g, " ")}</span>
  </div>
);

export default AmenityIcon;

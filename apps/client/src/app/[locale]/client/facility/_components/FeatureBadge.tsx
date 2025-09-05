import React from "react";

import { Badge } from "@reservatior/ui/badge";

// TODO: Replace with actual feature icon mapping
const featureIcons: Record<string, React.ReactNode> = {
  FURNISHED: <span>🛋️</span>,
  BALCONY: <span>🏞️</span>,
  SEA_VIEW: <span>🌊</span>,
  // ...add more as needed
};

export const FeatureBadge = ({ feature }: { feature: string }) => (
  <Badge className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 text-sm font-medium dark:from-blue-900 dark:to-purple-900">
    {featureIcons[feature] || <span>✨</span>}
    <span>{feature.replace(/_/g, " ")}</span>
  </Badge>
);

export default FeatureBadge;

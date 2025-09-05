import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

export const PromotionalHighlight = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) => (
  <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md dark:from-blue-950/30 dark:to-purple-950/30">
    <CardHeader className="flex flex-row items-center gap-2">
      {icon && <div className="text-2xl">{icon}</div>}
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </CardContent>
  </Card>
);

export default PromotionalHighlight;

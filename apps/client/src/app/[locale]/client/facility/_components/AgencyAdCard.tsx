import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

export const AgencyAdCard = ({
  agency,
  promotion,
  logoUrl,
}: {
  agency: { name: string; description?: string };
  promotion?: string;
  logoUrl?: string;
}) => (
  <Card className="flex flex-col items-center border-0 bg-gradient-to-br from-blue-50 to-green-50 p-4 text-center shadow-md dark:from-blue-950/30 dark:to-green-950/30">
    <CardHeader className="flex flex-col items-center">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={agency.name}
          className="mb-2 h-16 w-16 rounded-full"
        />
      )}
      <CardTitle className="text-lg font-bold">{agency.name}</CardTitle>
    </CardHeader>
    <CardContent>
      {promotion && (
        <div className="mb-1 text-base font-semibold text-green-700 dark:text-green-300">
          {promotion}
        </div>
      )}
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        {agency.description}
      </div>
    </CardContent>
  </Card>
);

export default AgencyAdCard;

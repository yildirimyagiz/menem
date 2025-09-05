import type { ReactNode } from "react";

import { Card, CardContent } from "./card";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        {icon && <div className="mb-2">{icon}</div>}
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
        {actions && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  );
};

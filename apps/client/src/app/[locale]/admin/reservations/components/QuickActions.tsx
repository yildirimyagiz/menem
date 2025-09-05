import { Button } from "@reservatior/ui/button";

interface QuickActionsProps {
  onRefresh: () => void;
  onCreate?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onRefresh,
  onCreate,
}) => (
  <div className="flex gap-2">
    <Button variant="outline" onClick={onRefresh}>
      Refresh
    </Button>
    <Button variant="default" onClick={onCreate} disabled={!onCreate}>
      New Reservation
    </Button>
  </div>
);

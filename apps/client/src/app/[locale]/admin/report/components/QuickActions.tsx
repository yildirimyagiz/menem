import { Button } from "@reservatior/ui/button";

interface QuickActionsProps {
  onRefresh: () => void;
  onGenerate?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onRefresh,
  onGenerate,
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onRefresh}>
        Refresh
      </Button>
      <Button variant="default" onClick={onGenerate} disabled={!onGenerate}>
        Generate Report
      </Button>
    </div>
  );
};

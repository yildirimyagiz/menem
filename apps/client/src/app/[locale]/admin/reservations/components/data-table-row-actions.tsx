import { Button } from "@reservatior/ui/button";

interface DataTableRowActionsProps {
  reservation: any;
}

export const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
  reservation,
}) => (
  <div className="flex gap-2">
    <Button variant="outline" size="sm">
      View
    </Button>
    <Button variant="default" size="sm">
      Edit
    </Button>
    <Button variant="destructive" size="sm">
      Delete
    </Button>
  </div>
);

import type { Report } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

interface DeleteReportModalProps {
  report: Report;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteReportModal: React.FC<DeleteReportModalProps> = ({
  report,
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Delete Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Are you sure you want to delete the report{" "}
            <span className="font-semibold">{report.title}</span>?
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

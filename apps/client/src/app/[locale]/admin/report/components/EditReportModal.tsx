import { useState } from "react";

import type { Report } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { ReportStatus, ReportType } from "@reservatior/validators";

interface EditReportModalProps {
  report: Report;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Partial<Report>) => void;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  report,
  open,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(report.title);
  const [type, setType] = useState<ReportType>(report.reportType);
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [description, setDescription] = useState(report.description ?? "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave({ title, reportType: type, status, description });
            }}
            className="flex flex-col gap-4"
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
            <Select
              value={type}
              onValueChange={(value) => setType(value as ReportType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ReportType).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as ReportStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ReportStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <textarea
              className="min-h-[80px] rounded border px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

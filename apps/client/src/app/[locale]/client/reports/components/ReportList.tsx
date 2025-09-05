import type { FC } from "react";
import { format } from "date-fns";

import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";

import type { ReportWithContent } from "../page";

interface ReportListProps {
  reports: ReportWithContent[];
  onView: (report: ReportWithContent) => void;
  onDownload: (report: ReportWithContent) => void;
  onDelete: (report: ReportWithContent) => void;
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ReportList: FC<ReportListProps> = ({
  reports,
  onView,
  onDownload,
  onDelete,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getStatusColor = (status: ReportWithContent["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600";
      case "IN_PROGRESS":
        return "text-yellow-600";
      case "FAILED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Generated Reports</h2>
      {isLoading ? (
        <div className="text-center">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center text-gray-500">
          No reports generated yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Generated Reports Table">
            <thead>
              <tr className="border-b">
                <th scope="col" className="px-4 py-2 text-left">
                  Type
                </th>
                <th scope="col" className="px-4 py-2 text-left">
                  Format
                </th>
                <th scope="col" className="px-4 py-2 text-left">
                  Created
                </th>
                <th scope="col" className="px-4 py-2 text-left">
                  Status
                </th>
                <th scope="col" className="px-4 py-2 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="px-4 py-2">{report.type}</td>
                  <td className="px-4 py-2">{report.format}</td>
                  <td className="px-4 py-2">
                    {format(new Date(report.createdAt), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2">
                    <span className={getStatusColor(report.status)}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="View report"
                        onClick={() => onView(report)}
                        disabled={report.status !== "COMPLETED"}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Download report"
                        onClick={() => onDownload(report)}
                        disabled={report.status !== "COMPLETED"}
                      >
                        Download
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label="Delete report"
                        onClick={() => onDelete(report)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span className="px-2 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReportList;

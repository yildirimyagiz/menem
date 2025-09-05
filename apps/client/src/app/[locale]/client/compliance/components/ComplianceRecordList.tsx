"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, FileText, Pencil } from "lucide-react";

import type { ComplianceRecord } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Skeleton } from "@reservatior/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import Badge from "~/shared/Badge";
import { api } from "~/trpc/react";

interface ComplianceRecordListProps {
  entityId?: string;
  entityType?: string;
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  onViewDetails?: (record: ComplianceRecord) => void;
  onEdit?: (record: ComplianceRecord) => void;
}

interface ComplianceRecordResponse {
  data: (ComplianceRecord | null)[];
  page: number;
  limit: number;
  total: number;
}

export default function ComplianceRecordList({
  entityId,
  entityType,
  propertyId,
  agentId,
  agencyId,
  onViewDetails,
  onEdit,
}: ComplianceRecordListProps) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading } = api.complianceRecord.all.useQuery({
    entityId,
    entityType,
    propertyId,
    agentId,
    agencyId,
    page,
    pageSize,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const getStatusColor = (
    status: string,
  ): "green" | "red" | "yellow" | "gray" => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      case "PENDING":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const response = data as ComplianceRecordResponse | undefined;
  const records =
    Array.isArray(response?.data)
      ? response.data.filter(
          (record): record is ComplianceRecord => record !== null,
        )
      : [];

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <FileText className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold">No Compliance Records</h3>
        <p className="text-sm text-gray-500">
          There are no compliance records to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record: ComplianceRecord) => (
              <TableRow key={record.id}>
                <TableCell>{getTypeLabel(record.type)}</TableCell>
                <TableCell>
                  <Badge
                    name={record.status}
                    color={getStatusColor(record.status)}
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    name={record.isVerified ? "Yes" : "No"}
                    color={record.isVerified ? "green" : "gray"}
                  />
                </TableCell>
                <TableCell>
                  {record.expiryDate
                    ? format(new Date(record.expiryDate), "PPP")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {record.createdAt &&
                    format(new Date(record.createdAt), "PPP")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails?.(record)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(record)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {response && response.total > pageSize && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * pageSize >= response.total}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

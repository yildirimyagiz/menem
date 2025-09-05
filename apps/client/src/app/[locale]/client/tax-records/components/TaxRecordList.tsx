"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { Badge } from "@reservatior/ui/badge";
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

import { SimplePagination } from "~/components/ui/pagination";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface TaxRecord {
  id: string;
  year: number;
  amount: number;
  percentage: number;
  paid: boolean;
  dueDate: Date | null;
  paidDate: Date | null;
  notes: string | null;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
  Property: {
    id: string;
    title: string;
  };
}

interface TaxRecordListProps {
  propertyId?: string;
  clientId?: string;
}

const STATUS_COLORS = {
  paid: "bg-green-500",
  overdue: "bg-red-500",
  pending: "bg-yellow-500",
} as const;

export default function TaxRecordList({
  propertyId,
  clientId,
}: TaxRecordListProps) {
  const t = useTranslations("taxRecords");
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, refetch } = api.taxRecord.all.useQuery({
    propertyId,
    page,
    pageSize,
    sortBy: "dueDate",
    sortOrder: "asc",
  });

  const markAsPaidMutation = api.taxRecord.markAsPaid.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: t("success.payment"),
        description: t("success.paymentDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("error.payment"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (paid: boolean, dueDate: Date | null) => {
    if (paid) return STATUS_COLORS.paid;
    if (dueDate && new Date(dueDate) < new Date()) return STATUS_COLORS.overdue;
    return STATUS_COLORS.pending;
  };

  const handlePayment = async (recordId: string) => {
    try {
      await markAsPaidMutation.mutateAsync({ id: recordId });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {t("noRecords")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("year")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("percentage")}</TableHead>
            <TableHead>{t("dueDate")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((record: TaxRecord) => (
            <TableRow key={record.id}>
              <TableCell>{record.year}</TableCell>
              <TableCell>{record.amount.toLocaleString()}</TableCell>
              <TableCell>{record.percentage}%</TableCell>
              <TableCell>
                {record.dueDate ? format(new Date(record.dueDate), "PPP") : "-"}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(record.paid, record.dueDate)}>
                  {record.paid
                    ? t("status.paid")
                    : record.dueDate && new Date(record.dueDate) < new Date()
                      ? t("status.overdue")
                      : t("status.pending")}
                </Badge>
              </TableCell>
              <TableCell>
                {!record.paid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePayment(record.id)}
                    disabled={markAsPaidMutation.isPending}
                  >
                    {t("pay")}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data && data.totalPages > 1 && (
        <SimplePagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

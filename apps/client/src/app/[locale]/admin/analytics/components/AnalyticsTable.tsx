"use client";

import { motion } from "framer-motion";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@reservatior/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";

interface AnalyticsTableProps {
  analytics: any[];
  isLoading: boolean;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "LISTING_VIEW":
      return "bg-blue-100 text-blue-800";
    case "BOOKING_CONVERSION":
      return "bg-green-100 text-green-800";
    case "ML_PROPERTY_SCORE":
      return "bg-purple-100 text-purple-800";
    case "USER_ENGAGEMENT":
      return "bg-yellow-100 text-yellow-800";
    case "REVENUE":
      return "bg-emerald-100 text-emerald-800";
    case "PERFORMANCE":
      return "bg-orange-100 text-orange-800";
    case "AGENT_PERFORMANCE":
      return "bg-indigo-100 text-indigo-800";
    case "AGENCY_PERFORMANCE":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AnalyticsTable({
  analytics,
  isLoading,
}: AnalyticsTableProps) {
  const t = useTranslations();
  const utils = api.useUtils();

  const deleteMutation = api.analytics.delete.useMutation({
    onSuccess: async () => {
      await utils.analytics.all.invalidate();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm(t("Analytics.table.confirmDelete"))) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting analytics:", error);
      }
    }
  };

  const handleViewDetails = (analytics: any) => {
    // TODO: Implement view details modal
    console.log("View analytics details:", analytics);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!analytics.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">{t("Analytics.table.noData")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Analytics.table.type")}</TableHead>
            <TableHead>{t("Analytics.table.entity")}</TableHead>
            <TableHead>{t("Analytics.table.relatedTo")}</TableHead>
            <TableHead>{t("Analytics.table.timestamp")}</TableHead>
            <TableHead>{t("Analytics.table.data")}</TableHead>
            <TableHead className="text-right">
              {t("Analytics.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analytics.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell>
                <Badge className={getTypeColor(item.type)}>
                  {t(`Analytics.types.${item.type}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{item.entityType}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.entityId}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {item.property && (
                    <div className="text-sm">
                      <span className="font-medium">Property:</span>{" "}
                      {item.property.title}
                    </div>
                  )}
                  {item.user && (
                    <div className="text-sm">
                      <span className="font-medium">User:</span>{" "}
                      {item.user.name}
                    </div>
                  )}
                  {item.agent && (
                    <div className="text-sm">
                      <span className="font-medium">Agent:</span>{" "}
                      {item.agent.name}
                    </div>
                  )}
                  {item.agency && (
                    <div className="text-sm">
                      <span className="font-medium">Agency:</span>{" "}
                      {item.agency.name}
                    </div>
                  )}
                  {item.reservation && (
                    <div className="text-sm">
                      <span className="font-medium">Reservation:</span>{" "}
                      {item.reservation.status}
                    </div>
                  )}
                  {item.task && (
                    <div className="text-sm">
                      <span className="font-medium">Task:</span>{" "}
                      {item.task.title}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-sm">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {new Date(item.timestamp).toLocaleString()}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                {item.data ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm text-muted-foreground">
                        {Object.keys(item.data).length} fields
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <pre className="max-w-xs overflow-auto text-xs">
                        {JSON.stringify(item.data, null, 2)}
                      </pre>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {t("Analytics.table.actions")}
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("Analytics.table.viewDetails")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("Analytics.table.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

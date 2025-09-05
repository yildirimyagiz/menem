"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  FileText,
  MoreHorizontal,
  PenTool,
  Trash2,
  User,
  Users,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

import type { ContractCardData } from "../types";
import { cn } from "~/lib/utils";
import { ContractStatusBadge } from "./ContractStatusBadge";

interface ContractCardProps {
  contract: ContractCardData;
  onClick?: (id: string) => void;
  onTermsClick?: (id: string) => void;
  onSignClick?: (id: string) => void;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}

const ContractCard = ({
  contract,
  onClick,
  onTermsClick,
  onSignClick,
  onEditClick,
  onDeleteClick,
}: ContractCardProps) => {
  const t = useTranslations("contract");
  const handleCardClick = () => {
    if (onClick) onClick(contract.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isExpired = daysRemaining < 0;
  const isExpiringSoon = daysRemaining <= 30 && daysRemaining >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20" />

      {/* Status indicator */}
      <div className="absolute right-4 top-4">
        <ContractStatusBadge status={contract.status} />
      </div>

      {/* Header */}
      <div className="relative mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              {contract.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {contract.description || t("card.noDescription")}
            </p>
          </div>

          {/* Action menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onTermsClick && (
                <DropdownMenuItem onClick={() => onTermsClick(contract.id)}>
                  <FileText className="mr-2 h-4 w-4" />
                  {t("card.actions.viewTerms")}
                </DropdownMenuItem>
              )}
              {onSignClick && (
                <DropdownMenuItem onClick={() => onSignClick(contract.id)}>
                  <PenTool className="mr-2 h-4 w-4" />
                  {t("card.actions.signContract")}
                </DropdownMenuItem>
              )}
              {onEditClick && (
                <DropdownMenuItem onClick={() => onEditClick(contract.id)}>
                  <PenTool className="mr-2 h-4 w-4" />
                  {t("card.actions.editContract")}
                </DropdownMenuItem>
              )}
              {onDeleteClick && (
                <DropdownMenuItem
                  onClick={() => onDeleteClick(contract.id)}
                  className="text-red-600 focus:text-red-600 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("card.actions.deleteContract")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contract Details */}
      <div className="relative mb-6 space-y-3">
        {/* Property */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t("card.property")}
            </p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {contract.property?.name ?? "Unknown Property"}
            </p>
          </div>
        </div>

        {/* Tenant */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Tenant
            </p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {contract.tenant?.name ?? "Unknown Tenant"}
            </p>
          </div>
        </div>

        {/* Agency */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t("card.agency")}
            </p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {contract.agency?.name ?? "Unknown Agency"}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t("card.duration")}
            </p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
            </p>
          </div>
        </div>

        {/* Days Remaining */}
        {!isExpired && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t("card.daysRemaining")}
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  isExpiringSoon
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-neutral-900 dark:text-white",
                )}
              >
                {daysRemaining} days
                {isExpiringSoon && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {t("card.expiringSoon")}
                  </Badge>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Expired Warning */}
        {isExpired && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t("card.status")}
              </p>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Expired {Math.abs(daysRemaining)} days ago
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {t("card.created")} {formatDate(contract.createdAt)}
        </div>

        <div className="flex items-center gap-2">
          {onTermsClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTermsClick(contract.id);
              }}
              className="h-8 text-xs"
            >
              <FileText className="mr-1 h-3 w-3" />
              {t("card.terms")}
            </Button>
          )}

          {onClick && (
            <Button
              variant="default"
              size="sm"
              onClick={handleCardClick}
              className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700"
            >
              <ArrowRight className="mr-1 h-3 w-3" />
              {t("card.view")}
            </Button>
          )}
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-blue-200 dark:group-hover:border-blue-800" />
    </motion.div>
  );
};

export default ContractCard;

import React, { useMemo } from "react";
import { Calendar, Mail, Phone, User, X } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { ScrollArea } from "@reservatior/ui/scroll-area";
import { Separator } from "@reservatior/ui/separator";

import { useLanguage } from "~/context/LanguageContext";

type PaymentStatus =
  | "PAID"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "REFUNDED"
  | "CANCELLED";

interface Tenant {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  leaseStartDate?: Date | string;
  leaseEndDate?: Date | string;
  paymentStatus: PaymentStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface TenantDetailsModalProps {
  tenant: Tenant;
  onClose: () => void;
}

interface DetailItem {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  category?: string;
}

function safeDateString(date: Date | string | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TenantDetailsModal({
  tenant,
  onClose,
}: TenantDetailsModalProps) {
  const { t } = useLanguage();

  const tenantDetails = useMemo(() => {
    const basicDetails: DetailItem[] = [
      {
        label: t("Tenant.fields.firstName"),
        value: tenant.firstName,
        icon: <User className="h-4 w-4" />,
        category: t("Tenant.details.basicInformation"),
      },
      {
        label: t("Tenant.fields.lastName"),
        value: tenant.lastName,
        icon: <User className="h-4 w-4" />,
        category: t("Tenant.details.basicInformation"),
      },
      {
        label: t("Tenant.fields.email"),
        value: tenant.email,
        icon: <Mail className="h-4 w-4" />,
        category: t("Tenant.details.basicInformation"),
      },
      {
        label: t("Tenant.fields.phoneNumber"),
        value: tenant.phoneNumber ?? t("Tenant.details.notAvailable"),
        icon: <Phone className="h-4 w-4" />,
        category: t("Tenant.details.basicInformation"),
      },
    ];

    const leaseDetails: DetailItem[] = [
      {
        label: t("Tenant.fields.leaseStartDate"),
        value: safeDateString(tenant.leaseStartDate),
        icon: <Calendar className="h-4 w-4" />,
        category: t("Tenant.details.leaseInformation"),
      },
      {
        label: t("Tenant.fields.leaseEndDate"),
        value: safeDateString(tenant.leaseEndDate),
        icon: <Calendar className="h-4 w-4" />,
        category: t("Tenant.details.leaseInformation"),
      },
      {
        label: t("Tenant.fields.paymentStatus"),
        value: (
          <Badge variant="secondary">
            {t(`Tenant.paymentStatus.${tenant.paymentStatus}`)}
          </Badge>
        ),
        category: t("Tenant.details.leaseInformation"),
      },
    ];

    const dates: DetailItem[] = [
      {
        label: t("Tenant.details.registeredOn"),
        value: safeDateString(tenant.createdAt),
        icon: <Calendar className="h-4 w-4" />,
        category: t("Tenant.details.dates"),
      },
      {
        label: t("Tenant.details.lastUpdated"),
        value: safeDateString(tenant.updatedAt),
        icon: <Calendar className="h-4 w-4" />,
        category: t("Tenant.details.dates"),
      },
    ];

    return [...basicDetails, ...leaseDetails, ...dates];
  }, [tenant, t]);

  const groupedDetails = useMemo(() => {
    return tenantDetails.reduce(
      (acc, detail) => {
        const category = detail.category ?? t("Tenant.details.other");
        acc[category] ??= [];
        acc[category].push(detail);
        return acc;
      },
      {} as Record<string, DetailItem[]>,
    );
  }, [tenantDetails, t]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("Tenant.details.title")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("Tenant.details.close")}</span>
          </Button>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="space-y-6">
            {Object.entries(groupedDetails).map(([category, details]) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                  {category}
                </h3>
                <div className="space-y-4">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <div className="flex items-center gap-2">
                        {detail.icon}
                        <span className="font-medium">{detail.label}:</span>
                      </div>
                      <div className="col-span-3">{detail.value}</div>
                    </div>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

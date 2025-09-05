import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@reservatior/ui/button";
import { DataTable } from "@reservatior/ui/data-table";
import { Input } from "@reservatior/ui/input";

import { useLanguage } from "~/context/LanguageContext";
import AddTenant from "./AddTenant";
import { createColumns } from "./columns";
import type { TenantRow, TenantPaymentStatus } from "./columns";
import TenantDetailsModal from "./TenantDetailsModal";

interface TenantTableProps {
  tenants: TenantRow[];
}

export function TenantTable({ tenants }: TenantTableProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedTenant, setSelectedTenant] = useState<TenantRow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | TenantPaymentStatus>("");
  const STATUS_OPTIONS: TenantPaymentStatus[] = [
    "PAID",
    "UNPAID",
    "PARTIALLY_PAID",
    "OVERDUE",
    "REFUNDED",
    "CANCELLED",
  ];

  const handleTenantClick = (tenant: TenantRow) => {
    setSelectedTenant(tenant);
  };

  const handleEditTenant = (tenant: TenantRow) => {
    router.push(`/admin/tenants/${tenant.id}/edit`);
  };

  const handleDeleteTenant = async (_id: string) => {
    // Implement delete functionality
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "" || tenant.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = createColumns(
    handleTenantClick,
    handleEditTenant,
    handleDeleteTenant,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder={t("Tenant.table.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "" | TenantPaymentStatus)}
          className="rounded-md border border-input bg-background px-3 py-2"
          aria-label={t("Tenant.table.filterByStatus")}
        >
          <option value="">{t("Tenant.table.allStatuses")}</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {t(`Tenant.paymentStatus.${status}`)}
            </option>
          ))}
        </select>
        <Button onClick={() => setIsAddModalOpen(true)}>
          {t("Tenant.table.addTenant")}
        </Button>
      </div>

      <DataTable columns={columns} data={filteredTenants} />

      {selectedTenant && (
        <TenantDetailsModal
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
        />
      )}

      {isAddModalOpen && (
        <AddTenant
          onClose={() => setIsAddModalOpen(false)}
          onTenantAdded={() => {
            setIsAddModalOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

export default TenantTable;

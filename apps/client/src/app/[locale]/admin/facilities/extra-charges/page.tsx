"use client";

import { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";

import type { ExtraCharge } from "~/app/[locale]/client/facility/types";
import ExtraChargeList from "~/app/[locale]/client/facility/_components/ExtraChargeList";
import ExtraChargeModal from "~/app/[locale]/client/facility/_components/ExtraChargeModal";
import { api } from "~/trpc/react";

export default function ExtraChargesAdminPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCharge, setEditCharge] = useState<ExtraCharge | null>(null);
  const [charges, setCharges] = useState<ExtraCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = api.extraCharge.all.useQuery({});

  useEffect(() => {
    if (data?.data?.items) {
      const mapped: ExtraCharge[] = data.data.items.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        deletedAt: c.deletedAt,
        facilityId: c.facilityId,
        icon: typeof c.icon === "string" ? c.icon : undefined,
        logo: typeof c.logo === "string" ? c.logo : undefined,
        includedServices: c.includedServices,
        // add any other fields required by ExtraCharge type
      }));
      setCharges(mapped);
    } else {
      setCharges([]);
    }
    setLoading(isLoading);
    setError(queryError ? queryError.message : null);
  }, [data, isLoading, queryError]);

  const deleteMutation = api.extraCharge.delete.useMutation();

  const handleAdd = () => {
    setEditCharge(null);
    setModalOpen(true);
  };
  const handleEdit = (id: string) => {
    const charge = charges.find((c) => c.id === id);
    setEditCharge(
      charge
        ? {
            ...charge,
            description: charge.description ?? undefined,
            icon: typeof charge.icon === "string" ? charge.icon : undefined,
            logo: typeof charge.logo === "string" ? charge.logo : undefined,
          }
        : null,
    );
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this extra charge?"))
      return;
    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete extra charge");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Extra Charges</h1>
          <p className="text-gray-600">
            Manage all extra charges for facilities
          </p>
        </div>
        <Button onClick={handleAdd}>Add Extra Charge</Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading extra charges...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-500">Error loading extra charges: {error}</p>
          </div>
        </div>
      ) : (
        <ExtraChargeList
          charges={charges}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <ExtraChargeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetch}
        initialData={editCharge}
      />
    </div>
  );
}

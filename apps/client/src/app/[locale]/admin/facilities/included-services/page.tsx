"use client";

import { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";

import type { IncludedService } from "~/app/[locale]/client/facility/types";
import IncludedServiceList from "~/app/[locale]/client/facility/_components/IncludedServiceList";
import IncludedServiceModal from "~/app/[locale]/client/facility/_components/IncludedServiceModal";
import { api } from "~/trpc/react";

export default function IncludedServicesAdminPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState<IncludedService | null>(null);
  const [services, setServices] = useState<IncludedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = api.includedService.all.useQuery({});
  const deleteMutation = api.includedService.delete.useMutation();

  useEffect(() => {
    if (data?.data?.items) {
      setServices(
        (data.data.items as any[]).map((s: any) => ({
          ...s,
          description: s.description ?? undefined,
        })),
      );
    } else {
      setServices([]);
    }
    setLoading(isLoading);
    setError(queryError ? queryError.message : null);
  }, [data, isLoading, queryError]);

  const handleAdd = () => {
    setEditService(null);
    setModalOpen(true);
  };
  const handleEdit = (id: string) => {
    const service = services.find((s) => s.id === id);
    setEditService(
      service
        ? { ...service, description: service.description ?? undefined }
        : null,
    );
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to delete this included service?")
    )
      return;
    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete included service");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Included Services</h1>
          <p className="text-gray-600">
            Manage all included services for facilities
          </p>
        </div>
        <Button onClick={handleAdd}>Add Included Service</Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">
              Loading included services...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-500">
              Error loading included services: {error}
            </p>
          </div>
        </div>
      ) : (
        <IncludedServiceList
          services={services}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <IncludedServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetch}
        initialData={editService}
      />
    </div>
  );
}

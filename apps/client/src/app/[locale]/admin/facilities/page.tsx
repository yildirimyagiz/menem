"use client";

import type { Facility } from "@prisma/client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";
import { Table } from "@reservatior/ui/table";

import type { FacilityFilter } from "../../client/facility/types";
import FacilityCard from "~/components/FacilityCard";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import FacilityCreateModal from "../../client/facility/_components/FacilityCreateModal";
import FacilityDeleteModal from "../../client/facility/_components/FacilityDeleteModal";
import FacilityEditModal from "../../client/facility/_components/FacilityEditModal";
import FacilityExportModal from "../../client/facility/_components/FacilityExportModal";
import FacilityFilterForm from "../../client/facility/_components/FacilityFilterForm";
import FacilityImportModal from "../../client/facility/_components/FacilityImportModal";
import { getFacilityColumns } from "./_components/columns";
import { DataTable } from "./_components/DataTable";

const FacilitiesPage = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [selectedFacility, setSelectedFacility] = React.useState<string | null>(
    null,
  );
  const [facilities, setFacilities] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [facilitiesPerPage, setFacilitiesPerPage] = React.useState(20);
  const [filter, setFilter] = React.useState<FacilityFilter | undefined>(
    undefined,
  );
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");

  // Fetch facilities with filter
  const { data, refetch, isLoading, error } = api.facility.all.useQuery(
    {
      page: currentPage,
      pageSize: facilitiesPerPage,
    },
    {
      enabled: true,
    },
  );

  React.useEffect(() => {
    if (!data) return;
    console.log("Raw API response for facilities:", data);
    const facilitiesArray = Array.isArray(data.data) ? data.data : [];
    if (facilitiesArray.length) {
      setFacilities(facilitiesArray as any[]);
      console.log("Mapped facilities:", facilitiesArray);
    } else {
      setFacilities([]);
      if (!Array.isArray(data.data)) {
        console.warn("Facilities data not found in expected shape:", data);
      }
    }
  }, [data]);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (facilityId: string) => {
    setSelectedFacility(facilityId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (facilityId: string) => {
    setSelectedFacility(facilityId);
    setIsDeleteModalOpen(true);
  };

  // Implement the filter handler
  const handleFilter = (filter: FacilityFilter) => {
    setFilter(filter);
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Facilities Management</h1>
          <p className="text-muted-foreground">
            Manage all facilities and amenities for your properties
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            Import
          </Button>
          <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
            Export
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Facility
          </Button>
        </div>
      </div>

      <FacilityFilterForm onFilter={handleFilter} />

      <Card className="space-y-4">
        <div className="mb-2 flex justify-end">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
            className="mr-2"
          >
            Table View
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </Button>
        </div>
        {facilities.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No facilities found.
          </div>
        ) : viewMode === "table" ? (
          <div>
            <DataTable
              columns={getFacilityColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
              })}
              data={facilities}
              isLoading={isLoading}
              error={error?.message}
              meta={{
                onEdit: handleEdit,
                onDelete: handleDelete,
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {facilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                data={facility}
                onEdit={() => handleEdit(facility.id)}
                onDelete={() => handleDelete(facility.id)}
              />
            ))}
          </div>
        )}
      </Card>

      <FacilityCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      {selectedFacility && (
        <FacilityEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          facilityId={selectedFacility}
          onSuccess={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
      {selectedFacility && (
        <FacilityDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          facilityId={selectedFacility}
          onSuccess={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
      <FacilityImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <FacilityExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        facilities={facilities}
        onSuccess={() => {
          setIsExportModalOpen(false);
          toast({
            title: "Success",
            description: "Facilities exported successfully",
          });
        }}
      />
    </div>
  );
};

export default FacilitiesPage;

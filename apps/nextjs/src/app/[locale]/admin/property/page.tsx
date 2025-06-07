"use client";

import type { TRPCClientErrorLike } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import type { AppRouter } from "@acme/api";
import type { Property } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Input } from "@acme/ui/input";

import { toast } from "~/hooks/use-toast"; // Use consistent toast hook

import { api } from "~/trpc/react";
import AddProperty from "./components/AddProperty";
import PropertyEditSidebar from "./components/PropertySidebar";
import PropertyTable from "./components/PropertyTable";

export default function PropertiesPage() {
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: fetchedProperties,
    isLoading: queryLoading,
    error: queryError,
  } = api.property.all.useQuery({
    page: currentPage,
    pageSize: propertiesPerPage,
  });

  // Type guard for TRPC errors
  function getErrorMessage(error: unknown): string {
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }
    return "An unknown error occurred.";
  }

  useEffect(() => {
    if (queryError) {
      setError(getErrorMessage(queryError));
    }
  }, [fetchedProperties, queryError]);

  const deleteMutation = api.property.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Property deleted successfully!" });
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      setError(msg);
      toast({ title: msg, variant: "destructive" });
    },
  });

  const handleViewDetails = useCallback((property: Property) => {
    setSelectedProperty(property);
    setEditedProperty(property);
    setEditMode(false);
  }, []);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Are you sure you want to delete this property?")) {
        try {
          await deleteMutation.mutateAsync(id);
          // Refetch handled by query invalidation; no need to update local state
        } catch {
          // Error handling is done in mutation callbacks
        }
      }
    },
    [deleteMutation],
  );

  const handleCloseSidebar = useCallback(() => {
    console.log("Closing Sidebar");
    setSelectedProperty(null);
    setEditMode(false);
    setEditedProperty(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setEditedProperty(null);
  }, []);

  const handlePropertyAdded = useCallback(() => {
    const utils = api.useUtils();
    void utils.property.all.invalidate();
    toast({ title: "Property added successfully!" });
  }, []);

  const handleInputChange = useCallback(
    async <K extends keyof Property>(field: K, value: Property[K]) => {
      setEditedProperty((prev) => {
        if (!prev) return null;
        return { ...prev, [field]: value };
      });
      return Promise.resolve();
    },
    [],
  );

  // Use paginated data from the API
  const properties: Property[] = Array.isArray(fetchedProperties?.data)
    ? (fetchedProperties.data.filter(Boolean) as Property[])
    : [];
  const totalProperties = fetchedProperties?.data?.total ?? 0;

  const filteredProperties = useMemo(() => {
    if (!properties.length) return [];
    return properties.filter((property) => {
      const searchableFields = [
        property.title,
        property.description,
        property.propertyType,
        property.propertyStatus,
      ].filter(Boolean);
      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
  }, [properties, searchTerm]);

  if (queryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading properties...</p>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">
            No properties found. Get started by adding your first property!
          </p>
          <Button className="mt-4" onClick={() => setShowAddPropertyForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add First Property
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / propertiesPerPage),
  );

  return (
    <div className="container mx-auto flex py-10">
      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Property Listings</h1>
          <Button onClick={() => setShowAddPropertyForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Property
          </Button>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-2">
            <Input
              placeholder="Search properties..."
              className="w-[300px]"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" disabled={queryLoading}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        <Card>
          <CardHeader>
            <CardTitle>All Properties</CardTitle>
            <CardDescription>
              Manage and view all your property listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyTable
              properties={filteredProperties.slice(
                (currentPage - 1) * propertiesPerPage,
                currentPage * propertiesPerPage,
              )}
              onViewDetails={handleViewDetails}
              onEdit={(property) => {
                setSelectedProperty(property);
                setEditMode(true);
              }}
              onDelete={handleDelete}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * propertiesPerPage + 1}-
              {Math.min(
                currentPage * propertiesPerPage,
                filteredProperties.length,
              )}{" "}
              of {filteredProperties.length} results
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {selectedProperty && (
        <PropertyEditSidebar
          selectedProperty={selectedProperty}
          editMode={editMode}
          editedProperty={editedProperty}
          closeSidebar={handleCloseSidebar}
          handleEdit={handleEdit}
          handleCancel={handleCancel}
          handleInputChange={handleInputChange}
          handleCloseSidebar={() => {
            setSelectedProperty(null);
            setEditMode(false);
            setEditedProperty(null);
            // TODO: Add additional sidebar close logic here if needed
          }}
          handleUpdateProperty={async (_updatedProperty: Partial<Property>) => {
            // TODO: Implement update property mutation logic here
            toast({
  title: "Property update not yet implemented.",
  description: undefined,
});
          }}
        />
      )}

      {showAddPropertyForm && (
        <AddProperty
          onPropertyAdded={handlePropertyAdded}
          onClose={() => setShowAddPropertyForm(false)}
        />
      )}
    </div>
  );
}

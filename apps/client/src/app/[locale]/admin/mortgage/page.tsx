"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@reservatior/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { MortgageModal } from "./_components/MortgageModal";

const MortgageCreditsPage = () => {
  const { data, isPending, isError, error, refetch } =
    api.mortgage.all.useQuery({}, { refetchOnWindowFocus: false });

  const mortgages = useMemo(
    () => (Array.isArray(data?.data) ? data.data.filter(Boolean) : []),
    [data],
  );

  // Example: Calculate best rates, total credits, etc.
  const summary = useMemo(() => {
    if (!mortgages.length) return null;
    const totalPrincipal = mortgages.reduce(
      (sum, m) => sum + (m.principal || 0),
      0,
    );
    const bestRate = Math.min(...mortgages.map((m) => m.interestRate ?? 99));
    return { totalPrincipal, bestRate };
  }, [mortgages]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedMortgage, setSelectedMortgage] = useState(null);

  // Fetch properties for property select
  const { data: propertiesData } = api.property.all.useQuery({});
  const properties = useMemo(
    () => (Array.isArray(propertiesData?.data) ? propertiesData.data : []),
    [propertiesData],
  );

  const deleteMutation = api.mortgage.delete.useMutation();

  const handleCreate = () => {
    setModalMode("create");
    setSelectedMortgage(null);
    setIsModalOpen(true);
  };
  const handleEdit = (mortgage: any) => {
    setModalMode("edit");
    setSelectedMortgage(mortgage);
    setIsModalOpen(true);
  };
  const handleSaved = () => {
    setIsModalOpen(false);
    refetch();
  };
  const handleDelete = async (mortgage: any) => {
    if (!window.confirm("Are you sure you want to delete this mortgage?"))
      return;
    await deleteMutation.mutateAsync(mortgage.id);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Credits & Mortgage Comparison
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Compare available credits, mortgage options, and brief clients for
              sale and reservation credits.
            </p>
          </div>
          <Button onClick={handleCreate} className="ml-4">
            Add Mortgage
          </Button>
        </div>
      </motion.div>

      {/* Summary/Briefing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="rounded-lg bg-white/80 p-4 shadow-md dark:bg-slate-800/80">
          <h2 className="mb-2 text-xl font-semibold">Summary</h2>
          {summary ? (
            <ul className="ml-6 list-disc text-gray-700 dark:text-gray-200">
              <li>
                Total Principal:{" "}
                <span className="font-bold">
                  {summary.totalPrincipal.toLocaleString()}
                </span>
              </li>
              <li>
                Best Interest Rate:{" "}
                <span className="font-bold">{summary.bestRate}%</span>
              </li>
              <li>
                Sale Options: <span className="font-bold">(Coming soon)</span>
              </li>
              <li>
                Reservation Credits:{" "}
                <span className="font-bold">(Coming soon)</span>
              </li>
            </ul>
          ) : (
            <span className="text-gray-500">No mortgage data available.</span>
          )}
        </div>
      </motion.div>

      {/* Admin DataTable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80"
      >
        {isPending ? (
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Loading credits...
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl text-red-600">!</span>
              </div>
              <p className="text-lg text-red-600">
                Error loading credits: {error?.message}
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto p-6">
            <DataTable
              columns={columns.map((col) =>
                col.id === "actions"
                  ? {
                      ...col,
                      cell: ({ row }) => (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(row.original)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(row.original)}
                          >
                            Delete
                          </Button>
                        </div>
                      ),
                    }
                  : col,
              )}
              data={mortgages}
            />
          </div>
        )}
      </motion.div>

      <MortgageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        mortgage={selectedMortgage}
        onSaved={handleSaved}
        properties={properties
          .filter(Boolean)
          .map((p: any) => ({ id: p.id, name: p.name }))}
      />

      {/* Placeholders for future features */}
      {/* <div className="mt-8">Charts, filters, and export features coming soon.</div> */}
    </div>
  );
};

export default MortgageCreditsPage;

"use client";

import { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";

import type { Expense } from "~/app/[locale]/client/facility/types";
import ExpenseList from "~/app/[locale]/client/facility/_components/ExpenseList";
import ExpenseModal from "~/app/[locale]/client/facility/_components/ExpenseModal";
import { api } from "~/trpc/react";

export default function ExpensesAdminPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = api.expense.all.useQuery({});

  useEffect(() => {
    let items: any[] = [];
    if (Array.isArray(data?.data)) {
      items = data.data;
    } else if (Array.isArray(data)) {
      items = data;
    }
    setExpenses(items);
    setLoading(isLoading);
    setError(queryError ? queryError.message : null);
  }, [data, isLoading, queryError]);

  const deleteMutation = api.expense.delete.useMutation();

  const handleAdd = () => {
    setEditExpense(null);
    setModalOpen(true);
  };
  const handleEdit = (id: string) => {
    const expense = expenses.find((e) => e.id === id) ?? null;
    setEditExpense(expense);
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await deleteMutation.mutateAsync(id);
      refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete expense");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-gray-600">Manage all expenses for facilities</p>
        </div>
        <Button onClick={handleAdd}>Add Expense</Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading expenses...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-500">Error loading expenses: {error}</p>
          </div>
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetch}
        initialData={editExpense}
      />
    </div>
  );
}

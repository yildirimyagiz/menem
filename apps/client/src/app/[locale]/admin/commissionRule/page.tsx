"use client";

import React, { useCallback, useMemo, useState } from "react";

import type { CommissionRule } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";

import { api } from "~/trpc/react";

// TODO: import DataTable, columns, modals from ./components

export default function AdminCommissionRulePage() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // TODO: Add filter state for advanced filtering

  const {
    data: rulesData,
    isLoading,
    error,
    refetch,
  } = api.commissionRule.all.useQuery({
    // TODO: Add filter params
    // e.g. search, pagination, etc.
  });

  const rules = useMemo(() => rulesData?.data ?? [], [rulesData]);

  // TODO: Define columns with edit/delete actions
  const columns = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commission Rules</h1>
          <p className="text-muted-foreground">
            Manage all commission rules for providers and payments.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Add Rule</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="Search by provider or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" onClick={() => refetch()}>
              Search
            </Button>
            {/* TODO: Add advanced filter controls */}
          </div>
          {/* TODO: Replace with DataTable */}
          <div className="rounded border p-4 text-gray-500">
            Commission rules table goes here.
          </div>
        </CardContent>
      </Card>
      {/* TODO: Add Create/Edit/Delete modals */}
    </div>
  );
}

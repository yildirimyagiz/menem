"use client";

import React, { useMemo, useState } from "react";

import type { CommissionRule } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";

import { api } from "~/trpc/react";

// TODO: import CommissionRuleList, CommissionRuleModal from "./_components"

export default function ClientCommissionRulePage() {
  const [search, setSearch] = useState("");
  // TODO: Add filter state if needed

  const {
    data: rulesData,
    isLoading,
    error,
    refetch,
  } = api.commissionRule.all.useQuery({
    // TODO: Add filter params (e.g. user-specific, search, etc.)
  });

  const rules = useMemo(() => rulesData?.data ?? [], [rulesData]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Commission Rules</h1>
          <p className="text-gray-600">
            View your commission rules and payment terms.
          </p>
        </div>
        {/* TODO: Add button for new requests if needed */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Commission Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="Search by type or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" onClick={() => refetch()}>
              Search
            </Button>
            {/* TODO: Add filter controls if needed */}
          </div>
          {/* TODO: Replace with CommissionRuleList */}
          <div className="rounded border p-4 text-gray-500">
            Commission rules list goes here.
          </div>
        </CardContent>
      </Card>
      {/* TODO: Add CommissionRuleModal for details if needed */}
    </div>
  );
}

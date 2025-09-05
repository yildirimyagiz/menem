"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { AgentStatusEnum } from "@reservatior/validators";

import { api } from "~/trpc/react";

interface AgentFilter {
  search?: string;
  status?: string;
  agencyId?: string;
}

interface AgentFilterFormProps {
  onFilter: (filter: AgentFilter) => void;
  initialValues?: AgentFilter;
}

export default function AgentFilterForm({
  onFilter,
  initialValues = {},
}: AgentFilterFormProps) {
  const [search, setSearch] = useState(initialValues.search ?? "");
  const [status, setStatus] = useState(initialValues.status ?? "all");
  const [agencyId, setAgencyId] = useState(initialValues.agencyId ?? "all");

  // Fetch agencies for the dropdown
  const { data: agenciesData } = api.agency.all.useQuery({
    page: 1,
    pageSize: 100,
    sortBy: "name",
    sortOrder: "asc",
  });

  const agencies = agenciesData?.data?.data ?? [];

  // Filter out null agencies and ensure they have required properties
  const validAgencies = agencies.filter(
    (agency): agency is any =>
      agency !== null &&
      typeof agency === "object" &&
      "id" in agency &&
      "name" in agency &&
      typeof agency.id === "string" &&
      typeof agency.name === "string",
  );

  const handleApply = () => {
    onFilter({
      search: search || undefined,
      status: status !== "all" ? status : undefined,
      agencyId: agencyId !== "all" ? agencyId : undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setAgencyId("all");
    onFilter({});
  };

  // Update form when initial values change
  useEffect(() => {
    setSearch(initialValues.search ?? "");
    setStatus(initialValues.status ?? "all");
    setAgencyId(initialValues.agencyId ?? "all");
  }, [initialValues]);

  const hasActiveFilters = search || status !== "all" || agencyId !== "all";

  return (
    <div className="space-y-4">
      {/* Current Filters Display */}
      {hasActiveFilters && (
        <div className="rounded-md bg-muted p-3">
          <h4 className="mb-2 text-sm font-medium">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                Search: "{search}"
              </span>
            )}
            {status !== "all" && (
              <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                Status: {status}
              </span>
            )}
            {agencyId !== "all" && (
              <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                Agency:{" "}
                {validAgencies.find((a) => a.id === agencyId)?.name ?? agencyId}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Search</label>
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {AgentStatusEnum.options.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Agency</label>
          <Select value={agencyId} onValueChange={setAgencyId}>
            <SelectTrigger>
              <SelectValue placeholder="Select agency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agencies</SelectItem>
              {validAgencies.map((agency) => (
                <SelectItem key={agency.id} value={agency.id}>
                  {agency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
}

"use client";

import { Filter, Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";
import { Textarea } from "@reservatior/ui/textarea";

import type { Ticket } from "@reservatior/validators";
import { api } from "~/trpc/react";

export default function AdminTicketPage() {
  const t = useTranslations();
  // Defensive translator: if messages are not loaded correctly and t returns a key-like string,
  // use the provided fallback to avoid showing raw i18n keys in UI.
  const safeT = useCallback((
    key: string,
    fallback: string,
    values?: Record<string, unknown>,
  ): string => {
    try {
      // next-intl v3 expects `default` for fallback
      const translated = t(key as never, { ...(values ?? {}), default: fallback } as never) as unknown as string;
      if (!translated || translated === key || translated.includes(".")) return fallback;
      return translated;
    } catch {
      return fallback;
    }
  }, [t]);

  type TStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "ARCHIVED";
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | TStatus>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    subject: string;
    description: string;
    status: TStatus;
    agentId: string;
  }>({
    subject: "",
    description: "",
    status: "OPEN",
    agentId: "",
  });
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  const statuses = useMemo(
    () => [
      { key: "", label: safeT("filters.status.all", "All") },
      { key: "OPEN", label: safeT("filters.status.open", "Open") },
      { key: "IN_PROGRESS", label: safeT("filters.status.inProgress", "In Progress") },
      { key: "RESOLVED", label: safeT("filters.status.resolved", "Resolved") },
      { key: "CLOSED", label: safeT("filters.status.closed", "Closed") },
      { key: "ARCHIVED", label: safeT("filters.status.archived", "Archived") },
    ],
    [safeT],
  );

  // Localized status label helper for table badges
  const statusLabel = (s: TStatus) => {
    switch (s) {
      case "OPEN":
        return safeT("statusLabels.open", "Open");
      case "IN_PROGRESS":
        return safeT("statusLabels.inProgress", "In Progress");
      case "RESOLVED":
        return safeT("statusLabels.resolved", "Resolved");
      case "CLOSED":
        return safeT("statusLabels.closed", "Closed");
      case "ARCHIVED":
        return safeT("statusLabels.archived", "Archived");
      default:
        return s;
    }
  };

  // helpers used across queries
  const isObject = (val: unknown): val is Record<string, unknown> =>
    typeof val === "object" && val !== null;
  const getFullName = (u: { name?: string | null; firstName?: string | null; lastName?: string | null; email?: string | null } | null | undefined, fallback?: string) => {
    if (!u) return fallback ?? "-";
    if (u.name?.trim()) return u.name;
    const first = (u.firstName ?? "").trim();
    const last = (u.lastName ?? "").trim();
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (u.email?.trim()) return u.email;
    return fallback ?? "-";
  };
  const getBooleanField = (o: unknown, key: string): boolean => {
    if (isObject(o) && key in o) {
      const v = (o)[key];
      return typeof v === "boolean" ? v : false;
    }
    return false;
  };

   
  // @ts-expect-error tRPC router typing collision on accessor; tracked elsewhere
  const ticketsQuery = api.ticket.all.useQuery(
    {
      subject: query || undefined,
      status: status || undefined,
      page,
      pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { keepPreviousData: true },
  );

  const tqData: unknown = (ticketsQuery as Record<string, unknown> | null | undefined)?.data;
  const isTicketsPayload = (
    val: unknown,
  ): val is { data: Ticket[]; total: number; totalPages: number } =>
    isObject(val) &&
    Array.isArray((val).data) &&
    typeof (val).total === "number" &&
    typeof (val).totalPages === "number";
  const payload = isTicketsPayload(tqData) ? tqData : undefined;
  const tickets = payload?.data ?? [];
  const total = payload?.total ?? 0;
  const totalPages = payload?.totalPages ?? 1;
  const isLoading = getBooleanField(ticketsQuery, "isLoading");
  const from = (page - 1) * pageSize + (tickets.length ? 1 : 0);
  const to = (page - 1) * pageSize + tickets.length;

  useEffect(() => {
    setPage(1);
  }, [query, status]);

  // Load agents for assignment field
  // @ts-expect-error tRPC router typing collision on accessor; tracked elsewhere
  const agentsQuery = api.agent.all.useQuery({}, { enabled: createOpen });
  interface AgentLite { id: string; name?: string | null; email?: string | null }
  const isAgentLite = (val: unknown): val is AgentLite =>
    isObject(val) && typeof (val as { id?: unknown }).id === "string";
  const extractAgents = (input: unknown): AgentLite[] => {
    if (Array.isArray(input)) return input.filter(isAgentLite);
    if (isObject(input)) {
      const d = (input).data;
      if (Array.isArray(d)) return d.filter(isAgentLite);
      if (isObject(d) && Array.isArray(d.data)) return d.data.filter(isAgentLite);
      const items = (input).items;
      if (Array.isArray(items)) return items.filter(isAgentLite);
    }
    return [];
  };
  const agentsDataContainer: unknown = (agentsQuery as Record<string, unknown> | null | undefined)?.data;
  const agents: AgentLite[] = extractAgents(agentsDataContainer);

  // Create ticket mutation
   
  // @ts-expect-error tRPC router typing collision on accessor; tracked elsewhere
  const createMutation = api.ticket.create.useMutation({
    onSuccess: async () => {
      setCreateOpen(false);
      setCreateForm({ subject: "", description: "", status: "OPEN", agentId: "" });
      setCreateErrors({});
      // try refetching the table
      // Access refetch safely without unsafe casts
      const maybeRefetch = (ticketsQuery as unknown as { refetch?: () => Promise<unknown> }).refetch;
      if (typeof maybeRefetch === "function") await maybeRefetch();
    },
  });
  const createPending = getBooleanField(createMutation, "isPending");

  interface CreatePayload { subject: string; description?: string; status: TStatus; agentId?: string }
  const doCreate = (payload: CreatePayload) => {
    const m = (createMutation as unknown as { mutate?: (p: CreatePayload) => void }).mutate;
    if (typeof m === "function") m(payload);
  };

  const validateCreate = () => {
    const errs: Record<string, string> = {};
    if (!createForm.subject.trim()) errs.subject = t("createModal.errors.subjectRequired", { default: "Subject is required" });
    return errs;
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {safeT("title", "Manage Tickets")}
          </h1>
          <p className="text-muted-foreground">
            {safeT("subtitle", "Track, filter, and manage all support tickets.")}
          </p>
        </div>

      {/* Create Ticket Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{safeT("createModal.title", "Create Ticket")}</DialogTitle>
            <DialogDescription>
              {safeT("createModal.description", "Fill in the details below to create a new support ticket.")}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const errs = validateCreate();
              setCreateErrors(errs);
              if (Object.keys(errs).length) return;
              doCreate({
                subject: createForm.subject,
                description: createForm.description || undefined,
                status: createForm.status,
                agentId: createForm.agentId || undefined,
              });
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tk-subject" className="text-right">
                  {safeT("createModal.fields.subject", "Subject")} *
                </Label>
                <Input
                  id="tk-subject"
                  value={createForm.subject}
                  onChange={(e) => setCreateForm((p) => ({ ...p, subject: e.target.value }))}
                  className="col-span-3"
                  required
                  aria-invalid={!!createErrors.subject}
                  aria-describedby={createErrors.subject ? "tk-subject-error" : undefined}
                />
              </div>
              {createErrors.subject && (
                <div className="col-span-4 text-xs text-red-500" id="tk-subject-error">
                  {createErrors.subject}
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tk-description" className="text-right">
                  {safeT("createModal.fields.description", "Description")}
                </Label>
                <Textarea
                  id="tk-description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  {safeT("createModal.fields.status", "Status")}
                </Label>
                <div className="col-span-3">
                  <Select
                    value={createForm.status}
                    onValueChange={(v) => setCreateForm((p) => ({ ...p, status: v as TStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={safeT("filters.status.all", "All")} />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses
                        .filter((s) => s.key)
                        .map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  {safeT("createModal.fields.agent", "Assign Agent")}
                </Label>
                <div className="col-span-3">
                  <Select
                    value={createForm.agentId}
                    onValueChange={(v) =>
                      setCreateForm((p) => ({ ...p, agentId: v === "NONE" ? "" : v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={safeT("createModal.fields.agentPlaceholder", "Optional")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">{safeT("createModal.none", "None")}</SelectItem>
                      {Array.isArray(agents) && agents.map((a: AgentLite) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name ?? a.email ?? a.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                {safeT("createModal.cancel", "Cancel")}
              </Button>
              <Button type="submit" disabled={createPending}>
                {createPending
                  ? safeT("createModal.creating", "Creating...")
                  : safeT("createModal.create", "Create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
        <Button className="gap-2" variant="default" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          {safeT("create", "Create Ticket")}
        </Button>
      </div>

      <section className="mb-4 rounded-lg border bg-background p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={safeT("filters.searchPlaceholder", "Search by subject...")}
              aria-label={safeT("filters.searchAria", "Search tickets by subject")}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="mobile-text-sm w-full rounded-md border bg-background px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as "" | TStatus)}
              aria-label={safeT("filters.status.aria", "Filter by status")}
            >
              {statuses.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{safeT("table.subject", "Subject")}</TableHead>
              <TableHead>{safeT("table.status", "Status")}</TableHead>
              <TableHead>{safeT("table.requester", "Requester")}</TableHead>
              <TableHead>{safeT("table.agent", "Agent")}</TableHead>
              <TableHead>{safeT("table.createdAt", "Created")}</TableHead>
              <TableHead className="w-0">{safeT("table.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-sm text-muted-foreground">
                  {safeT("loading", "Loading tickets...")}
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-sm text-muted-foreground">
                  {safeT("empty", "No tickets found. Adjust filters or create a new ticket.")}
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((tk) => (
                <TableRow key={tk.id}>
                  <TableCell className="font-medium">{tk.subject}</TableCell>
                  <TableCell>
                    <Badge variant={tk.status === "OPEN" ? "default" : "secondary"} className="mobile-text-xs">
                      {statusLabel(tk.status as TStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getFullName(tk.User, tk.userId)}</TableCell>
                  <TableCell>{getFullName(tk.Agent ?? null, "-")}</TableCell>
                  <TableCell>{new Date(tk.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      {safeT("view", "View")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {safeT("pagination.showing", "Showing {from}-{to} of {total}", { from, to, total })}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {safeT("pagination.previous", "Previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {safeT("pagination.next", "Next")}
          </Button>
        </div>
      </div>
    </main>
  );
}

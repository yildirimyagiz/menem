import type { FC } from "react";

import Link from "next/link";
import { useEffect, useState } from "react";

import CardAgentBox from "~/components/CardAgentBox";
import CardAgentBox2 from "~/components/CardAgentBox2";
import { useLanguage } from "~/context/LanguageContext";

import ButtonPrimary from "~/shared/ButtonPrimary";
import { api } from "~/trpc/react";
import type { Agent } from "~/utils/types";
import { env } from "~/env";

interface Props {
  className?: string;
  agents?: AgentCardInput[];
  boxCard?: "box1" | "box2";
  gridClassName?: string;
}

// Allow passing in partial agent data plus UI-only fields expected by cards
interface AgentCardInput extends Partial<Agent> {
  displayName?: string;
  handle?: string;
  avatarUrl?: string;
  starRating?: number;
  jobName?: string;
  bgImage?: string;
  count?: number;
}

const SectionGridAgentBox: FC<Props> = ({
  className = "",
  agents,
  boxCard = "box1",
  gridClassName = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ",
}) => {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [allAgents, setAllAgents] = useState<AgentCardInput[]>([]);

  // Helper: safely unwrap TRPC response shape { data: Agent[], ... }
  const extractAgentsFromQuery = (result: unknown): AgentCardInput[] => {
    if (!result || typeof result !== "object") return [];
    const maybeData = (result as { data?: unknown }).data;
    return Array.isArray(maybeData) ? (maybeData as AgentCardInput[]) : [];
  };

  // Fetch agents data if not provided
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    data: queryResult,
    isLoading,
    error,
    isFetching,
    // The typed helper may be flagged due to backend router name collisions
    // Cast only at this call site to avoid TS property errors while keeping types elsewhere
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  } = (api as unknown as any).agent.public.useQuery(
    {
      page,
      pageSize: 20, // Increased from 10 to 20
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    {
      enabled: !agents || agents.length === 0,
    },
  );

  useEffect(() => {
    if (!queryResult) return;
    const newAgents = extractAgentsFromQuery(queryResult);
    setAllAgents((prev) => (page === 1 ? newAgents : [...prev, ...newAgents]));
  }, [queryResult, page]);

  // Normalize possibly any-typed flag from TRPC to a concrete boolean
  const fetching = Boolean(isFetching);

  // Defensive: always use an array for displayAgents
  let displayAgents: AgentCardInput[] = [];
  if (Array.isArray(agents) && agents.length > 0) {
    displayAgents = agents;
  } else if (allAgents.length > 0) {
    displayAgents = allAgents;
  } else if (queryResult) {
    // Safely unwrap
    displayAgents = extractAgentsFromQuery(queryResult);
  }

  // Defensive: ensure safeAgents is always an array and has required fields
  const safeAgents = Array.isArray(displayAgents)
    ? displayAgents.map((agent) => ({
        // spread first so our computed values take precedence and avoid accidental overwrite
        ...agent,
        id: agent.id ?? `agent-${Math.random()}`,
        displayName: agent.displayName ?? agent.name ?? "Unknown Agent",
        handle: agent.handle ?? agent.id ?? "unknown",
        avatarUrl:
          agent.avatarUrl ??
          // fallback placeholder avatar
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E",
        starRating: agent.starRating ?? 4.5,
        jobName: agent.jobName ?? "Real Estate Agent",
        bgImage: agent.bgImage ?? agent.Photo?.[0]?.url ?? agent.logoUrl,
      }))
    : [];

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <div className={`grid gap-6 md:gap-8 ${gridClassName}`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-64 rounded-lg bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const hasMessage = (e: unknown): e is { message: unknown } =>
      typeof e === "object" && e !== null && "message" in e;
    return (
      <div className={`relative ${className}`}>
        <div className="py-12 text-center text-red-500">
          {t("agents.error", { default: "Error loading agents" })}:{" "}
          {hasMessage(error) ? String(error.message) : String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`grid gap-6 md:gap-8 ${gridClassName}`}>
        {safeAgents.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            <div>{t("agents.noAgents", { default: "No agents found." })}</div>
            {env.NODE_ENV === "development" && (
              <div className="mt-2 text-xs text-gray-500">
                Note: Only agents with status="ACTIVE" and deletedAt=null are
                shown.
                <br />
                Check your database for agent statuses.
              </div>
            )}
          </div>
        )}
        {safeAgents.map((agent) => (
          <div key={agent.id} className="flex">
            {boxCard === "box1" ? (
              <CardAgentBox agent={agent} />
            ) : (
              <CardAgentBox2 agent={agent} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col justify-center gap-y-3 sm:flex-row sm:gap-x-5 sm:gap-y-0">
        <button
          type="button"
          className="rounded bg-neutral-200 px-6 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          onClick={() => setPage((p: number) => p + 1)}
          disabled={fetching}
        >
          {fetching
            ? t("agents.loading", { default: "Loading..." })
            : t("agents.showMore", { default: "Show me more" })}
        </button>
        <Link href="/become-agent" passHref legacyBehavior>
          <a>
            <ButtonPrimary type={"button"} className={""} loading={false}>
              {t("agents.becomeHost", { default: "Become a host" })}
            </ButtonPrimary>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SectionGridAgentBox;


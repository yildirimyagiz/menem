"use client";

import { api } from "~/trpc/react";
import AgencySubscriptionManager from "../../../components/subscription/AgencySubscriptionManager";
import EnhancedHeroSection from "../../_components/home/EnhancedHeroSection";
import EnhancedMakeMoneySection from "../../_components/home/EnhancedMakeMoneySection";
import EnhancedStatsSection from "../../_components/home/EnhancedStatsSection";
import FeaturedProperties from "../../_components/home/FeaturedProperties";
import GetStartedBanner from "../../_components/home/GetStartedBanner";
import NeighborhoodHighlights from "../../_components/home/NeighborhoodHighlights";
import QuickBrowseLinks from "../../_components/home/QuickBrowseLinks";
import SectionHowItWork from "../../_components/SectionHowItWork";
import AgencyAdCard from "./facility/_components/AgencyAdCard";
import SectionGridAgentBox from "./property/components/SectionGridAgentBox";

interface SearchData {
  location: string;
  moveInDate: string;
  budget: string;
  propertyType: string;
}

// Agency Promotions Section
import type { Agency } from "@reservatior/validators";
import type { Agent } from "~/utils/types";

function AgencyPromotions({ agency }: { agency: Agency }) {
  return (
    <section className="py-16 ios-layout android-layout">
      <div className="container mx-auto px-4">
        <AgencyAdCard agency={agency} />
      </div>
    </section>
  );
}

// Agent Promotions Section
function AgentPromotions({ agents }: { agents: Agent[] }) {
  return (
    <section className="py-16 ios-layout android-layout">
      <div className="container mx-auto px-4">
        <SectionGridAgentBox agents={agents} />
      </div>
    </section>
  );
}

export default function ClientHomePage() {
  // Fetch data
  interface QueryResult { data?: unknown }
  const agenciesQuery = (api as unknown as {
    agency: { all: { useQuery: () => QueryResult } };
  }).agency.all.useQuery();
  const agentsQuery = (api as unknown as {
    agent: { all: { useQuery: () => QueryResult } };
  }).agent.all.useQuery();

  const agencies: Agency[] = Array.isArray(agenciesQuery.data)
    ? (agenciesQuery.data as Agency[])
    : [];
  const agents: Agent[] = Array.isArray(agentsQuery.data)
    ? (agentsQuery.data as Agent[])
    : [];

  const handleSearch = (searchData: SearchData) => {
    console.log("Search data:", searchData);
    // Handle search logic here
  };

  return (
    <div className="ios-layout android-layout">
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection onSearch={handleSearch} />

      {/* Enhanced Stats Section */}
      <EnhancedStatsSection />

      {/* Featured Properties */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <FeaturedProperties />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <SectionHowItWork />
        </div>
      </section>

      {/* Quick Browse Links */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <QuickBrowseLinks />
        </div>
      </section>

      {/* Neighborhood Highlights */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <NeighborhoodHighlights />
        </div>
      </section>

      {/* Enhanced Make Money Section */}
      <EnhancedMakeMoneySection />

      {/* Agency Promotions */}
      {agencies.length > 0 && agencies[0] && (
        <AgencyPromotions agency={agencies[0]} />
      )}

      {/* Agent Promotions */}
      {agents.length > 0 && (
        <AgentPromotions agents={agents} />
      )}

      {/* Get Started Banner */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <GetStartedBanner />
        </div>
      </section>

      {/* Agency Subscription Manager */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          {/* TODO: Pass correct props for AgencySubscriptionManager when ready */}
          <AgencySubscriptionManager agencyId={agencies[0]?.id ?? ""} agencyName={agencies[0]?.name ?? ""} />
        </div>
      </section>
    </div>
  );
}

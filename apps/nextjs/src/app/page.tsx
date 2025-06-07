import React from "react";

import Footer from "~/components/Footer";
import FeaturedProperties from "./_components/home/FeaturedProperties";
import GetStartedBanner from "./_components/home/GetStartedBanner";
import HeroSearchSection from "./_components/home/HeroSearchSection";
import HowItWorksSection from "./_components/home/HowItWorksSection";
import MarketTrendsSection from "./_components/home/MarketTrendsSection";
import NeighborhoodHighlights from "./_components/home/NeighborhoodHighlights";
import QuickBrowseLinks from "./_components/home/QuickBrowseLinks";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HeroSearchSection />
      <QuickBrowseLinks />
      <FeaturedProperties />
      <MarketTrendsSection />
      <HowItWorksSection />
      <NeighborhoodHighlights />
      <GetStartedBanner />
      <Footer />
    </main>
  );
}

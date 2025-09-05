
import Footer from "~/components/Footer";
import ExploreDestinations from "./_components/home/ExploreDestinations";
import FeaturedProperties from "./_components/home/FeaturedProperties";
import GetStartedBanner from "./_components/home/GetStartedBanner";
import HeroSearchSection from "./_components/home/HeroSearchSection";
import HowItWorksSection from "./_components/home/HowItWorksSection";
import MarketTrendsSection from "./_components/home/MarketTrendsSection";
import NeighborhoodHighlights from "./_components/home/NeighborhoodHighlights";
import QuickBrowseLinks from "./_components/home/QuickBrowseLinks";
import StatsSection from "./_components/home/StatsSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HeroSearchSection />
      <StatsSection />
      <div className="my-2" />
      <ExploreDestinations />
      <div className="my-2" />
      <QuickBrowseLinks />
      <div className="my-8" />
      <FeaturedProperties />
      <div className="my-8" />
      <MarketTrendsSection />
      <div className="my-8" />
      <HowItWorksSection />
      <div className="my-8" />
      <NeighborhoodHighlights />
      <div className="my-8" />
      <GetStartedBanner />
      <Footer />
    </main>
  );
}

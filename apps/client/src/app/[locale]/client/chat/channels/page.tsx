"use client";

import dynamic from "next/dynamic";

const ChannelManager = dynamic(() => import("../ChannelManager"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading channel manager...</p>
      </div>
    </div>
  ),
});

export default function ChannelsPage() {
  return <ChannelManager />;
} 
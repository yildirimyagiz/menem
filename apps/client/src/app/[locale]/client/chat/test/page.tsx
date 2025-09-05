"use client";

import dynamic from "next/dynamic";

const ChannelTest = dynamic(() => import("../ChannelTest"), {
  ssr: false,
});

export default function ChannelTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Channel API Test Page</h1>
      <ChannelTest />
    </div>
  );
} 
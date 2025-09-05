"use client";

import { useEffect } from "react";
import { api } from "~/trpc/react";

export default function ChannelTest() {
  const { data: channelsData, isLoading, error } = api.channel.list.useQuery({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    console.log("=== CHANNEL API TEST ===");
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    console.log("channelsData:", channelsData);
    console.log("channelsData?.data:", channelsData?.data);
    console.log("channelsData?.data?.data:", channelsData?.data?.data);
    console.log("channelsData?.data?.data length:", channelsData?.data?.data?.length);
    console.log("channelsData?.data?.total:", channelsData?.data?.total);
    console.log("========================");
  }, [channelsData, isLoading, error]);

  if (isLoading) {
    return <div>Loading channels...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Channel API Test</h2>
      <div className="mb-4">
        <strong>Total channels:</strong> {channelsData?.data?.total ?? 0}
      </div>
      <div className="mb-4">
        <strong>Channels found:</strong> {channelsData?.data?.data?.length ?? 0}
      </div>
      {channelsData?.data?.data && channelsData.data.data.length > 0 ? (
        <div className="space-y-2">
          <h3 className="font-semibold">Channel List:</h3>
          {channelsData.data.data.map((channel) => 
            channel ? (
              <div key={channel.id} className="p-2 border rounded">
                <div><strong>ID:</strong> {channel.id}</div>
                <div><strong>Name:</strong> {channel.name}</div>
                <div><strong>Description:</strong> {channel.description ?? "No description"}</div>
                <div><strong>Type:</strong> {channel.type}</div>
                <div><strong>Category:</strong> {channel.category}</div>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <div>No channels found</div>
      )}
    </div>
  );
} 
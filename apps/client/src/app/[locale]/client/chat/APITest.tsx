"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

import React from "react";
import { useAuth } from "~/hooks/use-auth";
import { api } from "~/trpc/react";

export default function APITest() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Test support agents API
  const { data: agentsData, isLoading: agentsLoading, error: agentsError } = (api as any).chat.getSupportAgents.useQuery({
    limit: 10,
  });

  // Test channels API
  const { data: channelsData, isLoading: channelsLoading, error: channelsError } = (api as any).channel.list.useQuery({
    page: 1,
    pageSize: 10,
  });

  // Test message sending
  const sendMessageMutation = (api as any).chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setTestResults(prev => ({ ...prev, sendMessage: { success: true, data } }));
      toast.success("Test message sent successfully!");
    },
    onError: (error) => {
      setTestResults(prev => ({ ...prev, sendMessage: { success: false, error: error.message } }));
      toast.error(`Failed to send test message: ${error.message}`);
    },
  });

  // Test typing status
  const typingMutation = (api as any).chat.updateTypingStatus.useMutation({
    onSuccess: () => {
      setTestResults(prev => ({ ...prev, typing: { success: true } }));
      toast.success("Typing status updated!");
    },
    onError: (error) => {
      setTestResults(prev => ({ ...prev, typing: { success: false, error: error.message } }));
      toast.error(`Failed to update typing status: ${error.message}`);
    },
  });

  // Test channel creation
  const createChannelMutation = (api as any).channel.create.useMutation({
    onSuccess: (data) => {
      setTestResults(prev => ({ ...prev, createChannel: { success: true, data } }));
      toast.success("Test channel created successfully!");
    },
    onError: (error) => {
      setTestResults(prev => ({ ...prev, createChannel: { success: false, error: error.message } }));
      toast.error(`Failed to create test channel: ${error.message}`);
    },
  });

  // Debug logging
  React.useEffect(() => {
    console.log("=== API TEST DEBUG ===");
    console.log("agentsData:", agentsData);
    console.log("agentsData?.data:", agentsData?.data);
    console.log("agentsData?.data type:", typeof agentsData?.data);
    console.log("agentsData?.data is array:", Array.isArray(agentsData?.data));
    console.log("agentsError:", agentsError);
    console.log("agentsLoading:", agentsLoading);
    console.log("channelsData:", channelsData);
    console.log("channelsError:", channelsError);
    console.log("channelsLoading:", channelsLoading);
    console.log("=====================");
  }, [agentsData, agentsError, agentsLoading, channelsData, channelsError, channelsLoading]);

  const runTests = async () => {
    setTestResults({});

    // Test 1: Send a message
    if (user?.id) {
      try {
        await sendMessageMutation.mutateAsync({
          content: "This is a test message from the API test component",
          receiverId: user.id, // Send to self for testing
          threadId: "test-thread",
          type: "PROBLEM",
        });
      } catch (error) {
        console.error("Send message test failed:", error);
      }
    }

    // Test 2: Update typing status
    try {
      await typingMutation.mutateAsync({
        threadId: "test-thread",
        isTyping: true,
      });
    } catch (error) {
      console.error("Typing status test failed:", error);
    }

    // Test 3: Create a test channel
    try {
      await createChannelMutation.mutateAsync({
        name: "Test Channel " + Date.now(),
        description: "This is a test channel created by the API test",
        category: "AGENT",
        type: "PUBLIC",
      });
    } catch (error) {
      console.error("Create channel test failed:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chat API Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Support Agents Test */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Support Agents API</h3>
              <div className="text-sm space-y-1">
                <div>Status: {agentsLoading ? "Loading..." : agentsError ? "Error" : "Success"}</div>
                <div>Count: {agentsData?.data?.length || 0}</div>
                {agentsError && (
                  <div className="text-red-500">Error: {agentsError.message}</div>
                )}
                {agentsData?.data && agentsData.data.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium">Sample Agents:</div>
                    {agentsData.data.slice(0, 3).map((agent) => (
                      <div key={agent.id} className="text-xs">
                        • {agent.displayName || agent.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Channels Test */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Channels API</h3>
              <div className="text-sm space-y-1">
                <div>Status: {channelsLoading ? "Loading..." : channelsError ? "Error" : "Success"}</div>
                <div>Count: {channelsData?.data?.length || 0}</div>
                {channelsError && (
                  <div className="text-red-500">Error: {channelsError.message}</div>
                )}
                {channelsData?.data && channelsData.data.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium">Sample Channels:</div>
                    {channelsData.data.slice(0, 3).map((channel) => (
                      <div key={channel.id} className="text-xs">
                        • {channel.name} ({channel.category})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Message Sending Test */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Message Sending API</h3>
              <div className="text-sm space-y-1">
                <div>Status: {sendMessageMutation.isLoading ? "Sending..." : testResults.sendMessage ? (testResults.sendMessage.success ? "Success" : "Error") : "Not tested"}</div>
                {testResults.sendMessage?.error && (
                  <div className="text-red-500">Error: {testResults.sendMessage.error}</div>
                )}
                {testResults.sendMessage?.success && (
                  <div className="text-green-500">Message sent successfully!</div>
                )}
              </div>
            </div>

            {/* Typing Status Test */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Typing Status API</h3>
              <div className="text-sm space-y-1">
                <div>Status: {typingMutation.isLoading ? "Updating..." : testResults.typing ? (testResults.typing.success ? "Success" : "Error") : "Not tested"}</div>
                {testResults.typing?.error && (
                  <div className="text-red-500">Error: {testResults.typing.error}</div>
                )}
                {testResults.typing?.success && (
                  <div className="text-green-500">Typing status updated!</div>
                )}
              </div>
            </div>

            {/* Channel Creation Test */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Channel Creation API</h3>
              <div className="text-sm space-y-1">
                <div>Status: {createChannelMutation.isLoading ? "Creating..." : testResults.createChannel ? (testResults.createChannel.success ? "Success" : "Error") : "Not tested"}</div>
                {testResults.createChannel?.error && (
                  <div className="text-red-500">Error: {testResults.createChannel.error}</div>
                )}
                {testResults.createChannel?.success && (
                  <div className="text-green-500">Channel created successfully!</div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">User Authentication</h3>
              <div className="text-sm space-y-1">
                <div>Status: {user ? "Authenticated" : "Not authenticated"}</div>
                {user && (
                  <>
                    <div>User ID: {user.id}</div>
                    <div>Name: {user.name}</div>
                    <div>Email: {user.email}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="flex gap-2">
            <Button onClick={runTests} disabled={sendMessageMutation.isLoading || typingMutation.isLoading}>
              Run API Tests
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTestResults({})}
            >
              Clear Results
            </Button>
          </div>

          {/* Detailed Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Test Results:</h4>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
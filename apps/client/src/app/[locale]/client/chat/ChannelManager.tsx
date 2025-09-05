"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

import { useAuth } from "~/hooks/use-auth";
import { api } from "~/trpc/react";

interface Channel {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: "PUBLIC" | "PRIVATE" | "GROUP";
  createdAt: Date;
  updatedAt: Date;
}

const CHANNEL_CATEGORIES = [
  "AGENT",
  "AGENCY", 
  "TENANT",
  "PROPERTY",
  "PAYMENT",
  "SYSTEM",
  "REPORT",
  "RESERVATION",
  "TASK",
  "TICKET",
] as const;

const CHANNEL_TYPES = [
  "PUBLIC",
  "PRIVATE", 
  "GROUP",
] as const;

export default function ChannelManager() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: "",
    description: "",
    category: "AGENT" as const,
    type: "PUBLIC" as const,
  });

  // Fetch channels
  const { data: channelsData, isLoading: channelsLoading, refetch, error: channelsError } = api.channel.list.useQuery({
    page: 1,
    pageSize: 100,
  });

  // Create channel mutation
  const createChannelMutation = (api as any).channel.create.useMutation({
    onSuccess: () => {
      toast.success("Channel created successfully!");
      setIsCreateDialogOpen(false);
      setNewChannel({
        name: "",
        description: "",
        category: "AGENT",
        type: "PUBLIC",
      });
      refetch();
    },
    onError: (error: any) => {
      console.error("Failed to create channel:", error);
      toast.error("Failed to create channel. Please try again.");
    },
  });

  // Delete channel mutation
  const deleteChannelMutation = (api as any).channel.delete.useMutation({
    onSuccess: () => {
      toast.success("Channel deleted successfully!");
      refetch();
    },
    onError: (error: any) => {
      console.error("Failed to delete channel:", error);
      toast.error("Failed to delete channel. Please try again.");
    },
  });

  const handleCreateChannel = async () => {
    if (!newChannel.name.trim()) {
      toast.error("Channel name is required");
      return;
    }

    try {
      await createChannelMutation.mutateAsync({
        name: newChannel.name.trim(),
        description: newChannel.description.trim() || undefined,
        category: newChannel.category,
        type: newChannel.type,
      });
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  const handleDeleteChannel = async (channelId: string, channelName: string) => {
    if (!confirm(`Are you sure you want to delete the channel "${channelName}"?`)) {
      return;
    }

    try {
      await deleteChannelMutation.mutateAsync({ id: channelId });
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      AGENT: "bg-blue-100 text-blue-800",
      AGENCY: "bg-purple-100 text-purple-800",
      TENANT: "bg-green-100 text-green-800",
      PROPERTY: "bg-orange-100 text-orange-800",
      PAYMENT: "bg-red-100 text-red-800",
      SYSTEM: "bg-gray-100 text-gray-800",
      REPORT: "bg-indigo-100 text-indigo-800",
      RESERVATION: "bg-pink-100 text-pink-800",
      TASK: "bg-yellow-100 text-yellow-800",
      TICKET: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const channels: Channel[] = useMemo(() => {
    console.log("ChannelManager - channelsData:", channelsData);
    console.log("ChannelManager - channelsData?.data:", channelsData?.data);
    console.log("ChannelManager - channelsData?.data?.data:", channelsData?.data?.data);
    console.log("ChannelManager - channelsData?.data?.data type:", typeof channelsData?.data?.data);
    console.log("ChannelManager - channelsData?.data?.data is array:", Array.isArray(channelsData?.data?.data));
    console.log("ChannelManager - channelsError:", channelsError);
    console.log("ChannelManager - channelsLoading:", channelsLoading);
    
    if (channelsError) {
      console.error("ChannelManager - Error fetching channels:", channelsError);
      return [];
    }
    
    if (!channelsData?.data?.data) {
      console.log("ChannelManager - No channels data available");
      return [];
    }

    if (!Array.isArray(channelsData.data.data)) {
      console.error("ChannelManager - channelsData.data.data is not an array:", channelsData.data.data);
      return [];
    }

    return channelsData.data.data.map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      description: channel.description,
      category: channel.category,
      type: channel.type,
      createdAt: new Date(channel.createdAt),
      updatedAt: new Date(channel.updatedAt),
    }));
  }, [channelsData?.data?.data, channelsError, channelsLoading]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Channel Management</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create Channel</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Channel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Channel Name</label>
                    <Input
                      value={newChannel.name}
                      onChange={(e) => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter channel name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newChannel.description}
                      onChange={(e) => setNewChannel(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter channel description (optional)"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newChannel.category}
                      onValueChange={(value) => setNewChannel(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHANNEL_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      value={newChannel.type}
                      onValueChange={(value) => setNewChannel(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHANNEL_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleCreateChannel}
                      disabled={createChannelMutation.isLoading || !newChannel.name.trim()}
                      className="flex-1"
                    >
                      {createChannelMutation.isLoading ? "Creating..." : "Create Channel"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {channelsLoading ? (
            <div className="text-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading channels...</p>
            </div>
          ) : channels.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4 h-16 w-16 rounded-full bg-muted/50 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">No channels found</h3>
              <p className="text-sm text-muted-foreground">Create your first channel to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel) => (
                <Card key={channel.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                          <Badge className={getCategoryColor(channel.category)}>
                            {channel.category}
                          </Badge>
                          <Badge variant={channel.type === "PUBLIC" ? "default" : "secondary"}>
                            {channel.type}
                          </Badge>
                        </div>
                        {channel.description && (
                          <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          Created: {channel.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteChannel(channel.id, channel.name)}
                        disabled={deleteChannelMutation.isLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
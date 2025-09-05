import React, { useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  Calendar,
  Edit,
  Globe,
  Home,
  Mail,
  Phone,
  Trash2,
  User,
  X,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";

import { api } from "~/trpc/react";

interface AgentDetailModalProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (agentId: string) => void;
  onDelete: (agentId: string) => void;
}

export default function AgentDetailModal({
  agentId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: AgentDetailModalProps) {
  const { data, isLoading, error } = api.agent.byId.useQuery(
    { id: agentId },
    { enabled: isOpen },
  );
  const agent = data?.data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Agent Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            Loading...
          </div>
        ) : error ? (
          <div className="py-8 text-red-500">
            Error loading agent details: {String(error)}
          </div>
        ) : agent ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {agent.logoUrl ? (
                <Image
                  src={agent.logoUrl}
                  alt={agent.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full border object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{agent.name}</span>
                  <Badge
                    variant={
                      agent.status === "ACTIVE"
                        ? "default"
                        : agent.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {agent.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">ID: {agent.id}</div>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(agent.id)}
                  >
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(agent.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4" />{" "}
                  {agent.email ?? <span className="text-gray-400">N/A</span>}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4" />{" "}
                  {agent.phoneNumber ?? (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe className="h-4 w-4" />{" "}
                  {agent.website ?? <span className="text-gray-400">N/A</span>}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Home className="h-4 w-4" />{" "}
                  {agent.address ?? <span className="text-gray-400">N/A</span>}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BadgeCheck className="h-4 w-4" />{" "}
                  {agent.bio ?? <span className="text-gray-400">No bio</span>}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="h-4 w-4" /> Agency:{" "}
                  {agent.agency?.name ?? (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4" /> Created:{" "}
                  {agent.createdAt
                    ? new Date(agent.createdAt).toLocaleDateString()
                    : "-"}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4" /> Updated:{" "}
                  {agent.updatedAt
                    ? new Date(agent.updatedAt).toLocaleDateString()
                    : "-"}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4" /> Last Active:{" "}
                  {agent.lastActive
                    ? new Date(agent.lastActive).toLocaleDateString()
                    : "-"}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Specialities:</span>{" "}
                  {agent.specialities?.length ? (
                    agent.specialities.map((s: any) => (
                      <Badge key={s}>{s}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>
            </div>
            {/* Future: Add photo gallery, properties, reviews, etc. */}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";

import { api } from "~/trpc/react";

interface AgentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onSuccess: () => void;
}

export default function AgentDeleteModal({
  isOpen,
  onClose,
  agentId,
  onSuccess,
}: AgentDeleteModalProps) {
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const deleteMutation = api.agent.delete.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleDelete = () => {
    setError(null);
    deleteMutation.mutate(agentId);
  };

  // Optionally, fetch agent name for confirmation
  // const agentName = ...

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Agent
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this agent? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This will permanently remove the agent from the system. All
            associated data will be marked as deleted but may be retained for
            audit purposes.
          </p>
          {/* Uncomment below for name confirmation */}
          {/*
          <div className="mt-4">
            <label htmlFor="confirmName" className="block text-sm font-medium">Type the agent's name to confirm:</label>
            <input
              id="confirmName"
              value={confirmName}
              onChange={e => setConfirmName(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
              aria-label="Type agent name to confirm deletion"
            />
          </div>
          */}
        </div>
        {error && <div className="mb-2 text-xs text-red-500">{error}</div>}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={
              deleteMutation.isPending /* || confirmName !== agentName */
            }
            aria-label="Delete Agent"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useCallback, useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { ContractCardData } from "../../../client/contract/types";

interface ContractSignModalProps {
  contractId: string;
  onClose: () => void;
}

const ContractSignModal = ({ contractId, onClose }: ContractSignModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const { data: contract } = api.contract.get.useQuery(
    { id: contractId },
    {
      enabled: !!contractId,
    },
  );

  const signContract = api.contract.sign.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contract signed successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSign = useCallback(() => {
    if (!contractId || !signature) return;

    setLoading(true);
    signContract.mutate({
      id: contractId,
      signature,
    });
  }, [contractId, signature, signContract]);

  if (!contract) return null;

  return (
    <Dialog open={!!contract} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sign Contract</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-medium">Contract Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Contract Name:
                </span>
                <span className="text-sm text-gray-900">{contract.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Property:
                </span>
                <span className="text-sm text-gray-900">
                  {contract.property?.name || "Unknown Property"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Tenant:
                </span>
                <span className="text-sm text-gray-900">
                  {contract.tenant?.name || "Unknown Tenant"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Agency:
                </span>
                <span className="text-sm text-gray-900">
                  {contract.agency?.name || "Unknown Agency"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Duration:
                </span>
                <span className="text-sm text-gray-900">
                  {new Date(contract.startDate).toLocaleDateString()} -{" "}
                  {new Date(contract.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Status:
                </span>
                <span className="text-sm text-gray-900">{contract.status}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Signatures</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Tenant Signature:
                </span>
                <input
                  type="text"
                  placeholder="Enter tenant signature"
                  value={signature || ""}
                  onChange={(e) => setSignature(e.target.value)}
                  className="flex-1 rounded border p-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Date:</span>
                <span className="text-sm text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSign} disabled={loading || !signature}>
              {loading ? "Signing..." : "Sign Contract"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractSignModal;

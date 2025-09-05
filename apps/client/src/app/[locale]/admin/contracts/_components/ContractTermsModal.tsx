"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";

import type { ContractTerms } from "../../../client/contract/types";
import { api } from "~/trpc/react";

interface ContractTermsModalProps {
  contractId: string;
  onClose: () => void;
}

const ContractTermsModal = ({
  contractId,
  onClose,
}: ContractTermsModalProps) => {
  const [terms, setTerms] = useState<ContractTerms | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: contract } = api.contract.get.useQuery(
    { id: contractId },
    {
      enabled: !!contractId,
    },
  );

  // Handle contract data changes with useEffect
  useEffect(() => {
    if (contract?.terms) {
      setTerms(contract.terms as unknown as ContractTerms);
    } else if (contract && !terms) {
      // Initialize with default terms if none exist
      setTerms({
        paymentSchedule: {
          frequency: "monthly",
          dueDate: 1,
        },
        deposit: {
          amount: 0,
          refundable: true,
        },
        maintenance: {
          responsibility: "tenant",
          emergencyContact: "",
        },
        termination: {
          noticePeriod: 30,
          conditions: [],
        },
        includedServices: [],
        extraCharges: {},
      });
    }
  }, [contract, terms]);

  const updateTerms = api.contract.updateTerms.useMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const handleAddService = useCallback(() => {
    if (!terms) return;
    setTerms({
      ...terms,
      includedServices: [...(terms.includedServices || []), ""],
    });
  }, [terms]);

  const handleAddExtraCharge = useCallback(() => {
    if (!terms) return;
    const chargeId = Date.now().toString();
    setTerms({
      ...terms,
      extraCharges: {
        ...terms.extraCharges,
        [chargeId]: {
          amount: 0,
          frequency: "monthly",
        },
      },
    });
  }, [terms]);

  const handleSave = useCallback(() => {
    if (!terms || !contractId) return;
    setLoading(true);
    updateTerms.mutate({
      id: contractId,
      terms: terms,
    });
  }, [terms, contractId, updateTerms]);

  if (!terms) return null;

  return (
    <Dialog open={!!terms} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Contract Terms</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-medium">Payment Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label htmlFor="frequency" className="w-32">
                  Frequency:
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  aria-label="Payment frequency"
                  value={terms.paymentSchedule.frequency}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      paymentSchedule: {
                        ...terms.paymentSchedule,
                        frequency: e.target.value as any,
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="dueDate" className="w-32">
                  Due Date:
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="number"
                  min="1"
                  max="31"
                  aria-label="Payment due date"
                  value={terms.paymentSchedule.dueDate}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      paymentSchedule: {
                        ...terms.paymentSchedule,
                        dueDate: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Deposit</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label htmlFor="depositAmount" className="w-32">
                  Amount:
                </label>
                <input
                  id="depositAmount"
                  name="depositAmount"
                  type="number"
                  aria-label="Deposit amount"
                  value={terms.deposit.amount}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      deposit: {
                        ...terms.deposit,
                        amount: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="refundable" className="w-32">
                  Refundable:
                </label>
                <input
                  id="refundable"
                  name="refundable"
                  type="checkbox"
                  aria-label="Deposit refundable"
                  checked={terms.deposit.refundable}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      deposit: {
                        ...terms.deposit,
                        refundable: e.target.checked,
                      },
                    })
                  }
                  className="rounded border p-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label htmlFor="responsibility" className="w-32">
                  Responsibility:
                </label>
                <select
                  id="responsibility"
                  name="responsibility"
                  aria-label="Maintenance responsibility"
                  value={terms.maintenance.responsibility}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      maintenance: {
                        ...terms.maintenance,
                        responsibility: e.target.value as any,
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                >
                  <option value="tenant">Tenant</option>
                  <option value="agency">Agency</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="emergencyContact" className="w-32">
                  Emergency Contact:
                </label>
                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  aria-label="Emergency contact"
                  value={terms.maintenance.emergencyContact}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      maintenance: {
                        ...terms.maintenance,
                        emergencyContact: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Termination</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label htmlFor="noticePeriod" className="w-32">
                  Notice Period (days):
                </label>
                <input
                  id="noticePeriod"
                  name="noticePeriod"
                  type="number"
                  min="1"
                  aria-label="Termination notice period in days"
                  value={terms.termination.noticePeriod}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      termination: {
                        ...terms.termination,
                        noticePeriod: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label htmlFor="conditions" className="mb-2 block w-32">
                  Conditions:
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  aria-label="Termination conditions"
                  value={terms.termination.conditions.join("\n")}
                  onChange={(e) =>
                    setTerms({
                      ...terms,
                      termination: {
                        ...terms.termination,
                        conditions: e.target.value.split("\n"),
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Included Services</h3>
            <div className="space-y-2">
              {terms.includedServices.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    aria-label={`Included service ${index + 1}`}
                    value={service}
                    onChange={(e) => {
                      const newServices = [...terms.includedServices];
                      newServices[index] = e.target.value;
                      setTerms({
                        ...terms,
                        includedServices: newServices,
                      });
                    }}
                    className="w-full rounded border p-2"
                  />
                  <button
                    type="button"
                    aria-label={`Remove service ${index + 1}`}
                    onClick={() => {
                      const newServices = terms.includedServices.filter(
                        (_, i) => i !== index,
                      );
                      setTerms({
                        ...terms,
                        includedServices: newServices,
                      });
                    }}
                    className="rounded bg-red-500 px-2 py-1 text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddService}
                className="w-full justify-start"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Extra Charges</h3>
            <div className="space-y-2">
              {Object.entries(terms.extraCharges).map(([key, charge]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="text"
                    aria-label={`Extra charge name for ${key}`}
                    placeholder="Charge name"
                    value={key}
                    onChange={(e) => {
                      const newCharges = { ...terms.extraCharges };
                      delete newCharges[key];
                      newCharges[e.target.value] = charge;
                      setTerms({
                        ...terms,
                        extraCharges: newCharges,
                      });
                    }}
                    className="w-32 rounded border p-2"
                  />
                  <input
                    type="number"
                    aria-label={`Extra charge amount for ${key}`}
                    placeholder="Amount"
                    value={charge.amount}
                    onChange={(e) => {
                      const newCharges = { ...terms.extraCharges };
                      newCharges[key] = {
                        ...charge,
                        amount: parseFloat(e.target.value),
                      };
                      setTerms({
                        ...terms,
                        extraCharges: newCharges,
                      });
                    }}
                    className="w-32 rounded border p-2"
                  />
                  <select
                    aria-label={`Extra charge frequency for ${key}`}
                    value={charge.frequency}
                    onChange={(e) => {
                      const newCharges = { ...terms.extraCharges };
                      newCharges[key] = {
                        ...charge,
                        frequency: e.target.value,
                      };
                      setTerms({
                        ...terms,
                        extraCharges: newCharges,
                      });
                    }}
                    className="w-32 rounded border p-2"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <button
                    type="button"
                    aria-label={`Remove extra charge ${key}`}
                    onClick={() => {
                      const newCharges = { ...terms.extraCharges };
                      delete newCharges[key];
                      setTerms({
                        ...terms,
                        extraCharges: newCharges,
                      });
                    }}
                    className="rounded bg-red-500 px-2 py-1 text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddExtraCharge}
                className="w-full justify-start"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Extra Charge
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Terms"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractTermsModal;

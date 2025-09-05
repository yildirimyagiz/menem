"use client";

import React, { useCallback, useState } from "react";

import type {
  ContractCardData,
  ContractFilter,
} from "../../client/contract/types";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import ContractCard from "../../client/contract/_components/ContractCard";
import ContractFilterForm from "../../client/contract/_components/ContractFilterForm";
import ContractSignModal from "./_components/ContractSignModal";
import ContractTermsModal from "./_components/ContractTermsModal";

const ContractAdminPage = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<ContractFilter>({});
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);

  const {
    data: contracts,
    isLoading,
    isError,
    refetch,
  } = api.contract.list.useQuery(filter, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });

  const handleFilter = useCallback((newFilter: ContractFilter) => {
    setFilter(newFilter);
  }, []);

  const handleContractClick = useCallback((contractId: string) => {
    setSelectedContract(contractId);
  }, []);

  const handleTermsClick = useCallback((contractId: string) => {
    setSelectedContract(contractId);
    setShowTermsModal(true);
  }, []);

  const handleSignClick = useCallback((contractId: string) => {
    setSelectedContract(contractId);
    setShowSignModal(true);
  }, []);

  const handleTermsModalClose = useCallback(() => {
    setShowTermsModal(false);
  }, []);

  const handleSignModalClose = useCallback(() => {
    setShowSignModal(false);
  }, []);

  if (isLoading) {
    return <div>Loading contracts...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Failed to load contracts. Please try again later.
      </div>
    );
  }

  // Filter out null contracts
  const validContracts =
    contracts?.filter(
      (contract: null): contract is NonNullable<typeof contract> =>
        contract !== null,
    ) || [];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Contract Management</h1>
        <p className="text-gray-600">
          Manage all rental contracts and agreements
        </p>
      </div>

      <ContractFilterForm onFilter={handleFilter} />

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {validContracts.map((contract: ContractCardData) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onClick={handleContractClick}
            onTermsClick={handleTermsClick}
            onSignClick={handleSignClick}
          />
        ))}
      </div>

      {showTermsModal && selectedContract && (
        <ContractTermsModal
          contractId={selectedContract}
          onClose={handleTermsModalClose}
        />
      )}

      {showSignModal && selectedContract && (
        <ContractSignModal
          contractId={selectedContract}
          onClose={handleSignModalClose}
        />
      )}
    </div>
  );
};

export default ContractAdminPage;

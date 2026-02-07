"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContractCard from "./ContractCard";
import ContractDialog from "./ContractDialog"; // ✅ Import

interface Props {
  contracts: any[];
  selectedClientId: number | null;
  clientName?: string;
}

export default function ContractList({
  contracts,
  selectedClientId,
  clientName,
}: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false); // ✅ State for modal

  const filteredContracts = contracts.filter(
    (c) => !selectedClientId || c.client?.id === selectedClientId,
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {selectedClientId
                ? `Contracts for ${clientName}`
                : "Recent Contracts"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your agreements and billing.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)} // ✅ Opens Modal
            disabled={!selectedClientId}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
          {filteredContracts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              No contracts found. Select a client and create one.
            </div>
          )}
        </div>
      </div>

      {/* ✅ The Create Modal */}
      <ContractDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        clientId={selectedClientId}
      />
    </>
  );
}

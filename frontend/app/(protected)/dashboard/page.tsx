"use client";

import { useState } from "react";

// API
import {
  useGetContractsQuery,
  useGetClientsQuery,
  useGetStatsSummaryQuery,
} from "@/lib/features/apiSlice";

// Components
import StatsOverview from "@/components/dashboard/StatsOverview";
import ClientList from "@/components/dashboard/ClientList";
import ContractList from "@/components/dashboard/ContractList";

export default function Dashboard() {
  const { data: contracts = [] } = useGetContractsQuery(undefined);
  const { data: clients = [] } = useGetClientsQuery(undefined);
  const { data: stats } = useGetStatsSummaryQuery(undefined);

  // Local State
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const selectedClient = clients.find((c: any) => c.id === selectedClientId);

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      {/* 1. Stats Section */}
      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 2. Sidebar (Clients) */}
        <div className="lg:col-span-1">
          <ClientList
            clients={clients}
            selectedClientId={selectedClientId}
            onSelect={setSelectedClientId}
          />
        </div>

        {/* 3. Main Area (Contracts) */}
        <div className="lg:col-span-3">
          <ContractList
            contracts={contracts}
            selectedClientId={selectedClientId}
            clientName={selectedClient?.name}
          />
        </div>
      </div>
    </main>
  );
}

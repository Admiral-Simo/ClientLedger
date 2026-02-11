"use client";

import { useState } from "react";

// API
import {
  useGetClientsQuery,
  useGetStatsSummaryQuery,
} from "@/lib/features/apiSlice";

// Components
import StatsOverview from "@/components/dashboard/StatsOverview";
import ClientList from "@/components/dashboard/ClientList";
import ContractList from "@/components/dashboard/ContractList";

export default function Dashboard() {
  // 1. REMOVE useGetContractsQuery from here.
  // We let ContractList handle its own data so pagination works.

  const { data: clients = [] } = useGetClientsQuery(undefined);
  const { data: stats } = useGetStatsSummaryQuery(undefined);

  // Local State
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const selectedClient = clients.find((c: any) => c.id === selectedClientId);

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ClientList
            clients={clients}
            selectedClientId={selectedClientId}
            onSelect={setSelectedClientId}
          />
        </div>

        <div className="lg:col-span-3">
          {/* ✅ PASS THE NAME HERE */}
          <ContractList
            selectedClientId={selectedClientId}
            clientName={selectedClient?.name}
          />
        </div>
      </div>
    </main>
  );
}

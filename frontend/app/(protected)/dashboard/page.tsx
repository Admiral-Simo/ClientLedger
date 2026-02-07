"use client";

import { useState } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DollarSign, LogOut, Moon, Sun } from "lucide-react";

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
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  // Data
  const { data: contracts = [] } = useGetContractsQuery(undefined);
  const { data: clients = [] } = useGetClientsQuery(undefined);
  const { data: stats } = useGetStatsSummaryQuery(undefined);

  // Local State
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const selectedClient = clients.find((c: any) => c.id === selectedClientId);

  return (
    <div className="min-h-screen bg-muted/40 transition-colors duration-300">
      {/* NAVBAR */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            ClientLedger
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
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
    </div>
  );
}

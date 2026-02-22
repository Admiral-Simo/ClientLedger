"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // For smooth entry animations
import {
  useGetClientsQuery,
  useGetStatsSummaryQuery,
} from "@/lib/features/apiSlice";

// Components
import StatsOverview from "@/components/dashboard/StatsOverview";
import ClientList from "@/components/dashboard/ClientList";
import ContractList from "@/components/dashboard/ContractList";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: clients = [], isLoading: isClientsLoading } =
    useGetClientsQuery(undefined);
  const { data: stats, isLoading: isStatsLoading } =
    useGetStatsSummaryQuery(undefined);

  // Local State
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const selectedClient = clients.find((c: any) => c.id === selectedClientId);

  // Animation Variants for staggered entry
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 dark:bg-[#020617]">
      {/* --- DECORATIVE BACKGROUND --- */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <motion.main
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative max-w-7xl mx-auto p-6 space-y-8"
      >
        {/* --- STATS SECTION --- */}
        <motion.section variants={itemVars}>
          {isStatsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <StatsOverview stats={stats} />
          )}
        </motion.section>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR: CLIENT LIST */}
          <motion.aside variants={itemVars} className="lg:col-span-1">
            <div className="sticky top-24">
              {isClientsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))}
                  </div>
                </div>
              ) : (
                <ClientList
                  clients={clients}
                  selectedClientId={selectedClientId}
                  onSelect={setSelectedClientId}
                />
              )}
            </div>
          </motion.aside>

          {/* MAIN: CONTRACT LIST */}
          <motion.div variants={itemVars} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  selectedClientId
                    ? `client-${selectedClientId}`
                    : "all-contracts"
                }
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ContractList
                  selectedClientId={selectedClientId}
                  clientName={selectedClient?.name}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
